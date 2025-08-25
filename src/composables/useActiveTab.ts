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
import { useDisplayResolvers } from '@/composables/useDisplayResolvers'
import type { AllActiveCallsType } from '@/types/opensips'
import { ICall } from 'opensips-js-vue'
import { TabMessageType } from '@/types/tab-management'
import { useVsipInject } from '@/composables/phone/useVsipProvideInject.ts'
import { getTranslation } from '@/plugins/translator.ts'
import { CallerInfoResolved } from '@/types/public-api'

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
    private lastSentRequestId: string | null = null
    private expectedGrant: null | { ts: number; token: string } = null
    private readonly GRANT_KEY = `${this.namespace}:grant`
    private readonly GRANT_TTL_MS = 2000

    constructor () {
        this.tabId = this.generateTabId()
        this.tab = new Tab(this.namespace)

        this.setupEventListeners()
        this.setupCallWatcher()
        this.setupTabMessageListener()
        this.initializeTabElection()

        setTimeout(() => {
            if (!this.isDestroyed) {
                this.sendLeadershipRequest()
            }
        }, 100)
    }

    get isActiveTab () { return computed(() => this._isActiveTab.value) }
    get tabWithActiveCalls () { return computed(() => this._tabWithActiveCalls.value) }
    get canActivate () { return computed(() => !(this._tabWithActiveCalls.value && this._tabWithActiveCalls.value !== this.tabId)) }

    private writeGrant (grant: { to: string; token: string; ts: number }) {
        const payload = {
            ...grant,
            expiresAt: Date.now() + this.GRANT_TTL_MS
        }
        localStorage.setItem(this.GRANT_KEY, JSON.stringify(payload))
    }

    private readGrant (): null | { to: string; token: string; ts: number; expiresAt: number } {
        const raw = localStorage.getItem(this.GRANT_KEY)
        if (!raw) return null
        try {
            const g = JSON.parse(raw)
            if (!g.expiresAt || Date.now() > g.expiresAt) {
                localStorage.removeItem(this.GRANT_KEY)
                return null
            }
            return g
        } catch {
            localStorage.removeItem(this.GRANT_KEY)
            return null
        }
    }

    private clearGrant () {
        localStorage.removeItem(this.GRANT_KEY)
    }

    private setupEventListeners (): void {
        window.addEventListener('focus', this.sendLeadershipRequest.bind(this))
        window.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.sendLeadershipRequest()
            }
        })
        window.addEventListener('storage', this.onStorageChange.bind(this))
        document.addEventListener('mousedown', this.sendLeadershipRequest.bind(this))
        document.addEventListener('keydown', this.sendLeadershipRequest.bind(this))

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

    private setupTabMessageListener (): void {
        this.tab.addEventListener('message', (event) => {
            const message = event.data
            if (message?.type === TabMessageType.CALL_STATE) {
                this._tabWithActiveCalls.value = message.tabWithCalls || ''
            } else if (message?.type === TabMessageType.FOCUS_REQUEST) {
                console.log('[TabManager] Received focus request:', message)
                if (message.tabId === this.tabId) {
                    console.log('[TabManager] Focus request is for this tab, showing notification...')
                    this.showFocusNotification()
                } else {
                    console.log('[TabManager] Focus request is for different tab:', message.tabId, 'vs', this.tabId)
                }
            } else if (message?.type === TabMessageType.LEADERSHIP_GRANT) {
                // leader pre-approves a specific tab
                if (message.to === this.tabId) {
                    this.expectedGrant = {
                        ts: message.ts,
                        token: message.token
                    }
                    if (this.debug) console.log('[TabManager] Received grant', this.expectedGrant)
                }
            }
        })
    }

    private onStorageChange (e: StorageEvent) {
        if (e.key !== this.GRANT_KEY) return
        const g = this.readGrant()
        if (this._isActiveTab.value && g && g.to !== this.tabId) {
            if (this.debug) console.log('[Leader] Storage grant for another tab; stepping down')
            this.setActiveState(false)
            this.tab.relinquishLeadership()
        }
    }

    private initializeTabElection (): void {
        this.tab.waitForLeadership(() => {
            const g = this.readGrant()
            if (g && g.to !== this.tabId) {
                if (this.debug) console.log('[Leader] Another tab has a valid grant; stepping down')
                this.setActiveState(false)
                this.tab.relinquishLeadership()
                return {} // return any shape; we’re stepping down right away
            }

            // clear self grant if present
            if (g && g.to === this.tabId) this.clearGrant()

            if (this.debug) console.log(`[TabManager] Tab ${this.tabId.slice(-8)} became leader`)

            // Do NOT use epoch; just become leader, but we'll relinquish only for newest ts
            const myActiveCalls = Object.values(activeCalls.value).length
            this._tabWithActiveCalls.value = myActiveCalls > 0 ? this.tabId : ''
            this.setActiveState(true)

            let latest = {
                ts: 0,
                requestId: ''
            }
            let granted: null | { ts: number; requestId: string; token: string; to: string } = null

            return {
                requestLeadership: async ({ tabId, requestId, ts, visible }: { tabId: string; requestId: string; ts: number; visible: boolean }) => {
                    // Ignore our own requests entirely
                    if (tabId === this.tabId) return { granted: false }

                    if (Object.keys(activeCalls.value).length > 0) return { granted: false }
                    if (!visible) return { granted: false }

                    // Track newest candidate
                    if (ts > latest.ts || (ts === latest.ts && requestId > latest.requestId)) {
                        latest = {
                            ts,
                            requestId
                        }
                    }

                    // Only the newest may proceed
                    if (ts !== latest.ts || requestId !== latest.requestId) {
                        if (this.debug) console.log('[Leader] Ignore stale request', {
                            requestId,
                            ts,
                            latest
                        })
                        return { granted: false }
                    }

                    // Issue/refresh a grant token and BROADCAST it immediately
                    const token = Math.random().toString(36).slice(2)
                    granted = {
                        ts,
                        requestId,
                        token,
                        to: tabId
                    }
                    // 3a) Persist grant (so stray winners see it and step down)
                    this.writeGrant({
                        to: tabId,
                        token,
                        ts
                    })

                    // 3b) Broadcast (so the intended winner caches token if it wants)
                    this.tab.send({
                        type: TabMessageType.LEADERSHIP_GRANT,
                        to: tabId,
                        ts,
                        token
                    })

                    // Hand-off, but allow cancellation if a newer request appears
                    this.setActiveState(false)
                    try {
                        // If someone newer arrived, cancel (by overwriting 'latest'/'granted')
                        if (!granted || granted.ts !== ts || granted.requestId !== requestId || granted.to !== tabId) {
                            // Cancel this grant
                            const g = this.readGrant()
                            if (g && g.to === tabId && g.ts === ts) this.clearGrant()
                            if (this.debug) console.log('[Leader] Handoff canceled by newer request')
                            return { granted: false }
                        }
                        await this.tab.relinquishLeadership()
                        return { granted: true }
                    } catch (e) {
                        console.error('[Leader] Failed to relinquish:', e)
                        return { granted: false }
                    } finally {
                        if (granted && granted.ts === ts && granted.requestId === requestId && granted.to === tabId) {
                            granted = null
                        }
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

    private setActiveState (isActive: boolean): void {
        if (this._isActiveTab.value === isActive) return

        this._isActiveTab.value = isActive

        if (isActive) {
            tryRegisterOpenSIPS()
        } else {
            unregisterOpenSIPS()
        }
    }

    public sendLeadershipRequest = debounce(async () => {
        if (this.isDestroyed || this._isActiveTab.value) return
        if (this._tabWithActiveCalls.value && this._tabWithActiveCalls.value !== this.tabId) return
        if (document.hidden) return

        const ts = Date.now() * 1e3 + Math.floor(performance.now() % 1e3)
        const requestId = `${ts}-${this.tabId}`
        if (this.lastSentRequestId === requestId) return

        this.lastSentRequestId = requestId

        try {
            await this.tab.call('requestLeadership', {
                tabId: this.tabId,
                requestId,
                ts,
                visible: !document.hidden
            })
            // Grant arrives via LEADERSHIP_GRANT message (see B)
        } catch {}
    }, 200)

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

    private async getCallDisplayName (call: ICall): Promise<string> {
        const { getResolver } = useDisplayResolvers()
        const { callersData } = useVsipInject()

        const callData = callersData.value[call._id]

        const phoneNumber = callData.userPhone || ''
        const callerName = callData.userName || ''

        const callerInfoResolver = getResolver('callerInfo')

        if (!callerInfoResolver) {
            return callerName || phoneNumber || getTranslation('audio.unknown')
        }

        let resolved: CallerInfoResolved | null

        try {
            resolved = await callerInfoResolver(call, callData)
        } catch (e) {
            console.warn('[TabManager] Caller info resolver failed:', e)
            resolved = null
        }

        return resolved?.name || callerName || phoneNumber || getTranslation('audio.unknown')
    }

    private async showIncomingCallNotification (call: ICall, callId: string): Promise<void> {
        if (!('Notification' in window) || Notification.permission !== 'granted') {
            return
        }

        try {
            const caller = await this.getCallDisplayName(call)

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

    private async showFocusNotification (): Promise<void> {
        if (!('Notification' in window) || Notification.permission !== 'granted') {
            // Fallback to attempting focus directly
            this.focusTab()
            return
        }

        try {
            const notification = new Notification('Switch to Active Tab', {
                body: 'This tab has active calls. Click to switch.',
                tag: 'tab-focus-request',
                requireInteraction: false,
                icon: '/favicon.ico'
            })

            notification.onclick = () => {
                this.focusTab()
                notification.close()
            }

            // Auto-close after 3 seconds
            setTimeout(() => {
                notification.close()
            }, 3000)

        } catch (error) {
            console.error('[TabManager] Failed to show focus notification:', error)
            // Fallback to attempting focus directly
            this.focusTab()
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

    private generateTabId (): string {
        return `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }

    async forceActivation (): Promise<void> {
        if (this.isDestroyed) return

        this.setActiveState(true)
        this._tabWithActiveCalls.value = this.hasActiveCalls() ? this.tabId : ''
    }

    requestFocusOnTabWithCalls (): void {
        const targetTabId = this._tabWithActiveCalls.value
        console.log('[TabManager] Requesting focus on tab with calls:', targetTabId)
        if (targetTabId) {
            this.tab.send({
                type: TabMessageType.FOCUS_REQUEST,
                tabId: targetTabId
            })
            console.log('[TabManager] Focus request sent to tab:', targetTabId)
        } else {
            console.log('[TabManager] No tab with active calls to focus')
        }
    }

    destroy (): void {
        if (this.isDestroyed) return

        this.isDestroyed = true

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

        window.removeEventListener('focus', this.sendLeadershipRequest.bind(this))
        window.removeEventListener('visibilitychange', this.sendLeadershipRequest.bind(this))
        window.removeEventListener('storage', this.onStorageChange.bind(this))
        document.removeEventListener('mousedown', this.sendLeadershipRequest.bind(this))
        document.removeEventListener('keydown', this.sendLeadershipRequest.bind(this))
        window.removeEventListener('beforeunload', this.handleBeforeUnload.bind(this))
        window.removeEventListener('pagehide', this.handlePageHide.bind(this))

        if (this._isActiveTab.value) {
            unregisterOpenSIPS()
            disconnectOpenSIPS()
        }

        this.tab.close()
    }
}

let tabManager: TabManager | null = null

function initializeActiveTab (): void {
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
        canActivate: tabManager.canActivate,
        activateTab: async () => {
            if (tabManager) {
                return tabManager.sendLeadershipRequest()
            }
        },
        focusTabWithCalls: () => {
            if (tabManager) {
                tabManager.requestFocusOnTabWithCalls()
            }
        },
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
