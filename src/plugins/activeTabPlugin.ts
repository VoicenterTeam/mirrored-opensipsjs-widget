import { ref, computed, watch, WatchHandle } from 'vue'
import { debounce } from 'lodash'
import { Tab } from 'tab-election'
import {
    activeCalls,
    disconnectOpenSIPS,
    unregisterOpenSIPS,
    tryRegisterOpenSIPS,
    useOpenSIPSJS
} from '@/composables/opensipsjs'
import { useCallerInfo } from '@/composables/useCallerInfo'
import type { AllActiveCallsType } from '@/types/opensips'
import { ICall } from 'opensips-js-vue'
import { TabMessageType, type ICallStateMessage } from '@/types/tab-management'

/**
 * Multi-tab coordination using tab-election library
 * - Focused tab becomes active unless another tab has active calls
 * - OS notifications for incoming calls with tab focus on click
 * - Tab close confirmation when active calls exist
 */
class TabManager {
    public readonly tabId: string
    private readonly namespace = 'opensips-widget'
    private tab: Tab
    private readonly debug = false // Set to true for debug logging

    private isDestroyed = false
    private _isActiveTab = ref(false)
    private _tabWithActiveCalls = ref<string>('')
    private callWatchHandle: WatchHandle | null = null
    private activeNotifications = new Map<string, Notification>()

    private debouncedFocusHandler = debounce(() => {
        this.requestActivation()
    }, 50)

    constructor () {
        this.tabId = this.generateTabId()
        this.tab = new Tab(this.namespace)

        this.setupEventListeners()
        this.setupCallWatcher()
        this.initializeTabElection()

        setTimeout(() => {
            if (!this.isDestroyed) {
                this.requestActivation()
            }
        }, 100)
    }

    get isActiveTab () { return computed(() => this._isActiveTab.value) }
    get tabWithActiveCalls () { return computed(() => this._tabWithActiveCalls.value) }

    private setupEventListeners (): void {
        window.addEventListener('focus', () => this.debouncedFocusHandler())
        window.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.debouncedFocusHandler()
            }
        })

        document.addEventListener('mousedown', this.debouncedFocusHandler)
        document.addEventListener('keydown', this.debouncedFocusHandler)

        window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this))
        window.addEventListener('pagehide', this.handlePageHide.bind(this))

        this.requestNotificationPermission()
    }

    private setupCallWatcher (): void {
        this.callWatchHandle = watch(
            activeCalls,
            (newCalls, oldCalls) => {
                const hasActiveCalls = Object.keys(newCalls || {}).length > 0
                const hadActiveCalls = Object.keys(oldCalls || {}).length > 0

                if (hasActiveCalls !== hadActiveCalls) {
                    this.broadcastCallState(hasActiveCalls)
                }

                this.handleCallChanges(newCalls || {}, oldCalls || {})
            },
            {
                immediate: true,
                deep: true
            }
        )
    }

    private initializeTabElection (): void {
        this.tab.addEventListener('message', (event) => {
            const message = event.data
            if (message?.type === TabMessageType.CALL_STATE) {
                this._tabWithActiveCalls.value = message.tabWithCalls || ''
            }
        })

        this.tab.waitForLeadership(() => {
            if (this.debug) console.log(`[TabManager] Tab ${this.tabId.slice(-8)} became leader`)

            const myActiveCalls = Object.values(activeCalls.value).length
            this._tabWithActiveCalls.value = myActiveCalls > 0 ? this.tabId : ''
            this.setActiveState(true)

            return {
                requestLeadership: async () => {
                    if (!this.canSwitchTabs()) {
                        if (this.debug) console.log(`[TabManager] Rejected leadership request - active calls on ${this._tabWithActiveCalls.value.slice(-8)}`)
                        return false
                    }

                    this.setActiveState(false)

                    try {
                        await this.tab.relinquishLeadership()
                        return true
                    } catch (error) {
                        console.error('[TabManager] Failed to relinquish leadership:', error)
                        return false
                    }
                }
            }
        }).then(() => {
            if (!this.isDestroyed) {
                setTimeout(() => {
                    if (!this.isDestroyed) {
                        this.initializeTabElection()
                    }
                }, 10)
            }
        }).catch((error) => {
            console.error('[TabManager] Election error:', error)
            if (!this.isDestroyed) {
                setTimeout(() => {
                    if (!this.isDestroyed) {
                        this.initializeTabElection()
                    }
                }, 1000)
            }
        })
    }

    private async requestActivation (): Promise<void> {
        if (this.isDestroyed || this._isActiveTab.value) {
            return
        }

        if (this._tabWithActiveCalls.value && this._tabWithActiveCalls.value !== this.tabId) {
            if (this.debug) console.log(`[TabManager] Cannot activate - tab ${this._tabWithActiveCalls.value.slice(-8)} has active calls`)
            return
        }

        try {
            await this.tab.call('requestLeadership', this.tabId)
        } catch (error) {
            // No leader exists - will become leader through natural election
        }
    }

    private setActiveState (isActive: boolean): void {
        if (this._isActiveTab.value === isActive) return

        this._isActiveTab.value = isActive

        if (isActive) {
            tryRegisterOpenSIPS()
        } else {
            unregisterOpenSIPS()
        }
    }

    private broadcastCallState (hasActiveCalls: boolean): void {
        this._tabWithActiveCalls.value = hasActiveCalls ? this.tabId : ''

        this.tab.send({
            type: TabMessageType.CALL_STATE,
            tabWithCalls: hasActiveCalls ? this.tabId : '',
            tabId: this.tabId
        })
    }

    private handleCallChanges (newCalls: AllActiveCallsType, oldCalls: AllActiveCallsType): void {
        if (!this._isActiveTab.value) return

        const newCallIds = new Set(Object.keys(newCalls))
        const oldCallIds = new Set(Object.keys(oldCalls))

        newCallIds.forEach(callId => {
            if (!oldCallIds.has(callId)) {
                const call = newCalls[callId]
                if (call.direction === 'incoming' && !call._is_confirmed) {
                    this.showIncomingCallNotification(call, callId)
                }
            }
        })

        oldCallIds.forEach(callId => {
            if (!newCallIds.has(callId)) {
                this.cleanupNotification(callId)
            }
        })
    }

    private async requestNotificationPermission (): Promise<void> {
        if ('Notification' in window && Notification.permission === 'default') {
            try {
                await Notification.requestPermission()
            } catch (error) {
                console.error('[TabManager] Failed to request notification permission:', error)
            }
        }
    }

    private async showIncomingCallNotification (call: ICall, callId: string): Promise<void> {
        if (!('Notification' in window) || Notification.permission !== 'granted') {
            return
        }

        try {
            const { getCallerDisplayName } = useCallerInfo()
            let caller: string

            console.log('[TabManager] Showing notification for call:', call)
            try {
                console.log('[TabManager] Calling getCallerDisplayName for notification')
                caller = await getCallerDisplayName(call)
                console.log('[TabManager] Got caller name for notification:', caller)
            } catch (error) {
                console.warn('[TabManager] Failed to get caller display name:', error)
                // Fallback to default behavior if resolver fails
                caller = call.remote_identity?.display_name || call.remote_identity?.uri || 'Unknown Caller'
                console.log('[TabManager] Using fallback caller name:', caller)
            }

            const notification = new Notification('Incoming Call', {
                body: `Call from ${caller}`,
                tag: `incoming-call-${callId}`,
                requireInteraction: true
            })

            notification.onclick = () => {
                this.focusTab()
                notification.close()
            }

            notification.onclose = () => {
                this.activeNotifications.delete(callId)
            }

            this.activeNotifications.set(callId, notification)
        } catch (error) {
            console.error('[TabManager] Failed to show notification:', error)
        }
    }

    private focusTab (): void {
        try {
            window.focus()
            if (document.hidden) {
                // Try to bring window to front
                window.parent?.focus()
            }
        } catch (error) {
            console.error('[TabManager] Failed to focus tab:', error)
        }
    }

    private cleanupNotification (callId: string): void {
        const notification = this.activeNotifications.get(callId)
        if (notification) {
            notification.close()
            this.activeNotifications.delete(callId)
        }
    }

    private handleBeforeUnload (event: BeforeUnloadEvent) {
        if (this.hasActiveCalls()) {
            event.preventDefault()
            event.returnValue = 'You have active calls'
            return 'You have active calls'
        }
    }

    private handlePageHide (): void {
        if (this.hasActiveCalls()) {
            const { terminateCall } = useOpenSIPSJS()

            Object.values(activeCalls.value).forEach((call: ICall) => {
                try {
                    terminateCall(call._id)
                } catch (error) {
                    console.error('[TabManager] Failed to terminate call:', error)
                }
            })

            this.broadcastCallState(false)
        }
    }

    private hasActiveCalls (): boolean {
        return Object.keys(activeCalls.value).length > 0
    }

    private canSwitchTabs (): boolean {
        return !(this._tabWithActiveCalls.value && this._tabWithActiveCalls.value !== this.tabId)
    }

    private generateTabId (): string {
        return `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }

    async forceActivation (): Promise<void> {
        if (this.isDestroyed) return

        this.setActiveState(true)
        this._tabWithActiveCalls.value = this.hasActiveCalls() ? this.tabId : ''
    }

    destroy (): void {
        if (this.isDestroyed) return

        this.isDestroyed = true
        this.debouncedFocusHandler.cancel()

        if (this.hasActiveCalls()) {
            const { terminateCall } = useOpenSIPSJS()
            Object.values(activeCalls.value).forEach((call: ICall) => {
                try {
                    terminateCall(call._id)
                } catch (error) {
                    console.error('[TabManager] Failed to terminate call:', error)
                }
            })
        }

        if (this._tabWithActiveCalls.value === this.tabId) {
            this.broadcastCallState(false)
        }

        this.callWatchHandle?.stop()
        this.activeNotifications.forEach(notification => notification.close())
        this.activeNotifications.clear()

        if (this._isActiveTab.value) {
            unregisterOpenSIPS()
            disconnectOpenSIPS()
        }

        this.tab.close()
    }
}

let tabManager: TabManager | null = null

export function initializeActiveTab (): void {
    if (tabManager) {
        console.warn('[ActiveTab] Tab manager already initialized')
        return
    }
    tabManager = new TabManager()
}

export function useActiveTab () {
    if (!tabManager) {
        initializeActiveTab()
    }

    if (!tabManager) {
        throw new Error('Tab manager initialization failed')
    }

    return {
        isActiveTab: tabManager.isActiveTab,
        tabWithActiveCalls: tabManager.tabWithActiveCalls,
        tabId: tabManager.tabId,
        activateTab: (force = false) => force ? tabManager!.forceActivation() : Promise.resolve(false),
        destroy: () => {
            if (tabManager) {
                tabManager.destroy()
                tabManager = null
            }
        }
    }
}

// Global cleanup - use pagehide to avoid interfering with beforeunload confirmation
if (typeof window !== 'undefined') {
    window.addEventListener('pagehide', () => {
        if (tabManager) {
            tabManager.destroy()
            tabManager = null
        }
    })
}
