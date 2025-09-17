import { ref, computed, watch, WatchHandle } from 'vue'
import { debounce } from 'lodash'
import { Tab } from 'tab-election'
import {
    //activeCalls,
    disconnectOpenSIPS,
    unregisterOpenSIPS,
    tryRegisterOpenSIPS,
    useOpenSIPSJS
} from '@/composables/opensipsjs'
import type { AllActiveCallsType } from '@/types/opensips'
import { ICall } from 'opensips-js-vue'
import { TabMessageType } from '@/types/tab-management'
import { getCallDisplayInfo } from '@/helpers/callerHelper.ts'

const { getAudioState } = useOpenSIPSJS()

const { activeCalls } = getAudioState()
/**
 * Advanced Multi-Tab Leadership System for VoIP Widget
 *
 * OVERVIEW:
 * This system coordinates multiple browser tabs/windows running the same VoIP widget,
 * ensuring only ONE tab at a time manages SIP connections and handles calls.
 *
 * CORE PROBLEM SOLVED:
 * - Prevents multiple tabs from registering to SIP server simultaneously
 * - Ensures tab with active calls always remains the leader
 * - Handles rapid tab switching without race conditions
 * - Provides smooth user experience when switching between tabs
 *
 * ARCHITECTURE DIAGRAM:
 * ```
 * ┌─────────────────────────────────────────────────────────────────────────────────────┐
 * │                          Multi-Tab VoIP Widget Architecture                         │
 * └─────────────────────────────────────────────────────────────────────────────────────┘
 *
 * TAB A (Active Leader)          TAB B (Requesting)           TAB C (Inactive)
 * ┌──────────────────┐          ┌─────────────────┐          ┌─────────────────┐
 * │ ✅ SIP Connected │          │ 📱 User Focus  │          │ 💤 Sleeping     │
 * │ 📞 Active Call   │          │ ⏳ Requesting   │          │ 🚫 No SIP       │
 * │ 👑 Leader        │          │ 🚫 No SIP Yet  │          │                 │
 * └──────────────────┘          └─────────────────┘          └─────────────────┘
 *          │                            │                            │
 *          │                            │                            │
 *          ▼                            ▼                            ▼
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │                         COORDINATION LAYERS                                │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * LAYER 1: tab-election Library (Basic Leadership)
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  • Provides fundamental leader election                                │
 * │  • Handles leader crashes/exits automatically                         │
 * │  • Routes leadership requests to current leader                       │
 * └─────────────────────────────────────────────────────────────────────────┘
 *                                     │
 *                                     ▼
 * LAYER 2: Custom Request/Grant Protocol (Race Prevention)
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  REQUEST: Tab B → "I want leadership" (with timestamp)                │
 * │  EVALUATE: Tab A → "Do I have calls? Is requester visible?"           │
 * │  GRANT: Tab A → "OK, here's your token" (broadcast + localStorage)    │
 * │  HANDOFF: Tab A steps down, Tab B becomes leader                      │
 * └─────────────────────────────────────────────────────────────────────────┘
 *                                     │
 *                                     ▼
 * LAYER 3: Real-time Coordination (Instant Sync)
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  📻 tab-election messaging: Instant messages between tabs             │
 * │  💾 localStorage: Persistent grants survive page reloads              │
 * │  👁️ Storage Events: All tabs see changes immediately                  │
 * │  ⏰ Debounced Requests: Prevent spam from rapid tab switching          │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * TYPICAL FLOW (User switches Tab A → Tab B):
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ 1. 👆 User clicks Tab B → DOM focus events                            │
 * │ 2. ⏳ 200ms debounce → prevents spam from rapid switching             │
 * │ 3. 📤 Tab B sends leadership request (timestamp + unique ID)          │
 * │ 4. 🤔 Tab A evaluates: "Do I have active calls?" → NO                 │
 * │ 5. ✅ Tab A grants leadership → broadcasts + stores in localStorage    │
 * │ 6. 📱 Tab B receives grant → validates token → becomes leader          │
 * │ 7. 🔌 Tab B connects to SIP → Tab A disconnects                       │
 * │ 8. 👀 Tab C sees localStorage change → stays inactive                  │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * CALL PROTECTION FLOW (Tab has active call):
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ 1. 👆 User clicks Tab B (Tab A has active call)                       │
 * │ 2. 📤 Tab B sends leadership request                                   │
 * │ 3. 🚫 Tab A: "I have active calls, request DENIED"                    │
 * │ 4. 📞 Tab A keeps leadership → call continues uninterrupted           │
 * │ 5. 💤 Tab B shows "Inactive Tab" UI → button to switch back to Tab A   │
 * └─────────────────────────────────────────────────────────────────────────┘
 * ```
 *
 * LEADERSHIP RULES:
 * - Tab with active calls cannot lose leadership (call protection)
 * - Most recently focused visible tab becomes leader (when no calls)
 * - Leadership requests are debounced to prevent spam
 * - Only newest request wins when multiple tabs compete
 */
class TabManager {
    /** Unique identifier for this tab instance (format: "tab-{timestamp}-{random}") */
    public readonly tabId: string

    /** Namespace for tab-election library - all widget tabs share this namespace */
    private readonly namespace = 'opensips-widget'

    /** tab-election instance for basic leadership coordination */
    private tab: Tab

    /** Enable detailed console logging for debugging (set to true when troubleshooting) */
    private readonly debug = false

    // === State Management ===
    /** Flag indicating if this TabManager has been destroyed/cleaned up */
    private isDestroyed = false

    /** Reactive state: true if this tab is currently the active leader */
    private _isActiveTab = ref(false)

    /** Reactive state: ID of the tab that currently has active calls (empty if none) */
    private _tabWithActiveCalls = ref<string>('')

    /** Vue watcher handle for monitoring active calls - used for cleanup */
    private callWatchHandle: WatchHandle | null = null

    /** Map of active OS notifications for incoming calls (callId -> Notification) */
    private activeNotifications = new Map<string, Notification>()

    // === Event Handler Bound Methods (for proper cleanup) ===
    /** Bound method for sendLeadershipRequest to ensure proper event listener cleanup */
    private readonly boundSendLeadershipRequest: () => void

    /** Bound method for handleVisibilityChange to ensure proper event listener cleanup */
    private readonly boundHandleVisibilityChange: () => void

    /** Bound method for onStorageChange to ensure proper event listener cleanup */
    private readonly boundOnStorageChange: (e: StorageEvent) => void

    /** Bound method for handleBeforeUnload to ensure proper event listener cleanup */
    private readonly boundHandleBeforeUnload: (event: BeforeUnloadEvent) => void | string

    /** Bound method for handlePageHide to ensure proper event listener cleanup */
    private readonly boundHandlePageHide: () => void

    // === Leadership Request/Grant System ===
    /**
     * Tracks the last sent request ID to prevent duplicate requests
     * Format: "{timestamp}-{tabId}"
     */
    private lastSentRequestId: string | null = null

    /** localStorage key for leadership grants */
    private readonly GRANT_KEY = `${this.namespace}:grant`

    /** How long a grant remains valid in localStorage (2 seconds) */
    private readonly GRANT_TTL_MS = 2000


    constructor () {
        // Generate unique tab identifier for this instance
        this.tabId = this.generateTabId()
        if (this.debug) console.log(`[TabManager] Initializing new tab: ${this.tabId.slice(-8)}`)

        // Create tab-election instance for basic leadership coordination
        this.tab = new Tab(this.namespace)
        if (this.debug) console.log(`[TabManager] tab-election instance created with namespace: ${this.namespace}`)

        // Bind event handler methods to preserve 'this' context and enable proper cleanup
        // CRITICAL: We must store bound references to remove listeners properly later
        this.boundSendLeadershipRequest = this.sendLeadershipRequest.bind(this)
        this.boundHandleVisibilityChange = this.handleVisibilityChange.bind(this)
        this.boundOnStorageChange = this.onStorageChange.bind(this)
        this.boundHandleBeforeUnload = this.handleBeforeUnload.bind(this)
        this.boundHandlePageHide = this.handlePageHide.bind(this)
        if (this.debug) console.log('[TabManager] Event handler methods bound successfully')

        // Initialize all coordination systems in sequence
        if (this.debug) console.log('[TabManager] Starting system initialization...')

        this.setupEventListeners()     // DOM events (focus, click, etc.)
        if (this.debug) console.log('[TabManager] ✅ Event listeners configured')

        this.setupCallWatcher()        // Monitor active calls state
        if (this.debug) console.log('[TabManager] ✅ Call state watcher initialized')

        this.setupTabMessageListener() // Inter-tab messaging
        if (this.debug) console.log('[TabManager] ✅ Inter-tab messaging configured')

        this.initializeTabElection()   // tab-election leadership system
        if (this.debug) console.log('[TabManager] ✅ Leadership election system started')

        // Delayed leadership request to prevent race conditions during app startup
        // This 100ms delay allows other tabs and systems to fully initialize first
        if (this.debug) console.log('[TabManager] Scheduling initial leadership request in 100ms...')
        setTimeout(() => {
            if (!this.isDestroyed) {
                if (this.debug) console.log('[TabManager] Executing delayed initial leadership request')
                this.sendLeadershipRequest()
            } else {
                if (this.debug) console.log('[TabManager] Skipping delayed leadership request - tab was destroyed')
            }
        }, 100)

        if (this.debug) console.log(`[TabManager] Constructor completed for tab: ${this.tabId.slice(-8)}`)
    }

    /** Computed: true if this tab is currently the active leader */
    get isActiveTab () {
        return computed(() => this._isActiveTab.value)
    }

    /** Computed: ID of tab with active calls, empty string if none */
    get tabWithActiveCalls () {
        return computed(() => this._tabWithActiveCalls.value)
    }

    /** Computed: true if this tab can become active (no other tab has active calls) */
    get canActivate () {
        return computed(() => !(this._tabWithActiveCalls.value && this._tabWithActiveCalls.value !== this.tabId))
    }

    /**
     * Store a leadership grant in localStorage with TTL
     *
     * WHY: localStorage persists across page reloads and is instantly visible
     * to all tabs via storage events. This provides immediate coordination.
     *
     * @param grant - Grant details (recipient tab, timestamp, validation token)
     */
    private writeGrant (grant: { to: string; token: string; ts: number }) {
        const payload = {
            ...grant,
            expiresAt: Date.now() + this.GRANT_TTL_MS
        }
        localStorage.setItem(this.GRANT_KEY, JSON.stringify(payload))
    }

    /**
     * Read and validate a leadership grant from localStorage
     *
     * Automatically cleans up expired grants to prevent stale data.
     *
     * @returns Grant object if valid, null if expired/missing/corrupted
     */
    private readGrant (): null | { to: string; token: string; ts: number; expiresAt: number } {
        const raw = localStorage.getItem(this.GRANT_KEY)

        if (!raw) return null

        try {
            const grant = JSON.parse(raw)

            // Check if grant has expired
            if (!grant.expiresAt || Date.now() > grant.expiresAt) {
                localStorage.removeItem(this.GRANT_KEY)
                return null
            }

            return grant
        } catch {
            // Corrupted data - clean up
            localStorage.removeItem(this.GRANT_KEY)
            return null
        }
    }

    /**
     * Remove current grant from localStorage
     * Used when leadership changes or grants expire
     */
    private clearGrant () {
        localStorage.removeItem(this.GRANT_KEY)
    }

    /**
     * Setup DOM event listeners for tab activation triggers
     *
     * ACTIVATION TRIGGERS:
     * - window focus: User switches to this browser window
     * - visibility change: Tab becomes visible (from hidden/minimized)
     * - mousedown/keydown: User interacts with the page
     *
     * COORDINATION EVENTS:
     * - storage change: Another tab updated localStorage (grants)
     *
     * CLEANUP EVENTS:
     * - beforeunload: Ask user to confirm if they have active calls
     * - pagehide: Terminate calls and clean up when tab closes
     */
    private setupEventListeners (): void {
        if (this.debug) console.log('[TabManager] Setting up DOM event listeners...')

        // User interaction events → trigger leadership request
        // These events indicate the user is actively using this tab
        window.addEventListener('focus', this.boundSendLeadershipRequest)
        if (this.debug) console.log('[TabManager] ✅ window focus listener added')

        window.addEventListener('visibilitychange', this.boundHandleVisibilityChange)
        if (this.debug) console.log('[TabManager] ✅ visibilitychange listener added')

        document.addEventListener('mousedown', this.boundSendLeadershipRequest)
        if (this.debug) console.log('[TabManager] ✅ document mousedown listener added')

        document.addEventListener('keydown', this.boundSendLeadershipRequest)
        if (this.debug) console.log('[TabManager] ✅ document keydown listener added')

        // Cross-tab coordination → localStorage grants changed
        // When another tab writes a grant, all tabs see this event immediately
        window.addEventListener('storage', this.boundOnStorageChange)
        if (this.debug) console.log('[TabManager] ✅ storage change listener added')

        // Tab lifecycle management
        // beforeunload: Show confirmation if user tries to close tab with active calls
        window.addEventListener('beforeunload', this.boundHandleBeforeUnload)
        if (this.debug) console.log('[TabManager] ✅ beforeunload listener added')

        // pagehide: Force cleanup when tab actually closes/navigates away
        window.addEventListener('pagehide', this.boundHandlePageHide)
        if (this.debug) console.log('[TabManager] ✅ pagehide listener added')

        // Request notification permission for incoming call alerts
        // This is async but we don't need to wait for it
        if (this.debug) console.log('[TabManager] Requesting notification permission...')
        this.requestNotificationPermission()

        if (this.debug) console.log('[TabManager] Event listeners setup completed')
    }

    /**
     * Clean up all event listeners to prevent memory leaks
     *
     * CRITICAL: Must use exact same function references that were added
     * in setupEventListeners() for removal to work properly
     */
    private removeEventListeners (): void {
        if (this.debug) console.log('[TabManager] Cleaning up event listeners...')

        // Remove all user interaction listeners using stored bound references
        window.removeEventListener('focus', this.boundSendLeadershipRequest)
        window.removeEventListener('visibilitychange', this.boundHandleVisibilityChange)
        document.removeEventListener('mousedown', this.boundSendLeadershipRequest)
        document.removeEventListener('keydown', this.boundSendLeadershipRequest)
        if (this.debug) console.log('[TabManager] ✅ User interaction listeners removed')

        // Remove coordination listener
        window.removeEventListener('storage', this.boundOnStorageChange)
        if (this.debug) console.log('[TabManager] ✅ Storage change listener removed')

        // Remove lifecycle listeners
        window.removeEventListener('beforeunload', this.boundHandleBeforeUnload)
        window.removeEventListener('pagehide', this.boundHandlePageHide)
        if (this.debug) console.log('[TabManager] ✅ Lifecycle listeners removed')

        if (this.debug) console.log('[TabManager] Event listener cleanup completed')
    }

    /**
     * Setup Vue watcher to monitor active calls state changes
     *
     * RESPONSIBILITIES:
     * - Track when calls are added/removed from this tab
     * - Broadcast call state changes to other tabs for coordination
     * - Handle incoming call notifications
     * - Manage call-related OS notifications
     */
    private setupCallWatcher (): void {
        if (this.debug) console.log('[TabManager] Setting up active calls watcher...')

        // Watch the reactive activeCalls object for any changes
        // immediate: true = run callback on setup with current values
        // deep: true = detect changes in nested objects (call properties)
        this.callWatchHandle = watch(
            activeCalls,
            (newCalls, oldCalls) => {
                // Calculate current call state for both new and old states
                const hasActiveCalls = Object.keys(newCalls || {}).length > 0
                const hadActiveCalls = Object.keys(oldCalls || {}).length > 0

                if (this.debug) {
                    console.log('[TabManager] Call state change detected:', {
                        before: hadActiveCalls ? Object.keys(oldCalls || {}).length : 0,
                        after: hasActiveCalls ? Object.keys(newCalls || {}).length : 0,
                        newCallIds: Object.keys(newCalls || {}),
                        oldCallIds: Object.keys(oldCalls || {})
                    })
                }

                // If call state changed (from no calls to calls, or vice versa)
                // broadcast to other tabs so they know which tab has active calls
                if (hasActiveCalls !== hadActiveCalls) {
                    if (this.debug) console.log(`[TabManager] Broadcasting call state change: ${hasActiveCalls}`)
                    this.broadcastCallState(hasActiveCalls)
                }

                // Handle individual call changes (new calls, ended calls)
                // This manages notifications for incoming calls
                this.handleCallChanges(newCalls || {}, oldCalls || {})
            },
            {
                immediate: true,  // Run immediately with current state
                deep: true        // Watch nested object changes
            }
        )

        if (this.debug) console.log('[TabManager] ✅ Active calls watcher initialized')
    }

    /**
     * Setup listener for inter-tab messages using tab-election messaging system
     *
     * MESSAGE TYPES HANDLED:
     * - CALL_STATE: Another tab broadcasts its call state (has calls or not)
     * - FOCUS_REQUEST: Request this tab to show focus notification to user
     * - LEADERSHIP_GRANT: Pre-approved leadership token from current leader
     */
    private setupTabMessageListener (): void {
        if (this.debug) console.log('[TabManager] Setting up inter-tab message listener...')

        // Listen for messages from other tabs via tab-election messaging system
        this.tab.addEventListener('message', (event) => {
            const message = event.data

            if (this.debug) {
                console.log('[TabManager] Received inter-tab message:', {
                    type: message?.type,
                    from: message?.tabId,
                    to: message?.to || 'broadcast'
                })
            }

            // Handle call state broadcasts from other tabs
            if (message?.type === TabMessageType.CALL_STATE) {
                if (this.debug) {
                    console.log('[TabManager] Processing call state message:', {
                        tabWithCalls: message.tabWithCalls || 'none',
                        fromTab: message.tabId
                    })
                }

                // Update our tracking of which tab currently has active calls
                this._tabWithActiveCalls.value = message.tabWithCalls || ''

            // Handle focus requests (user wants to switch to tab with calls)
            } else if (message?.type === TabMessageType.FOCUS_REQUEST) {
                console.log('[TabManager] Received focus request:', message)

                // Check if this focus request is meant for this specific tab
                if (message.tabId === this.tabId) {
                    console.log('[TabManager] Focus request is for this tab, showing notification...')
                    this.showFocusNotification()
                } else {
                    console.log('[TabManager] Focus request is for different tab:', message.tabId, 'vs', this.tabId)
                }

            // Handle leadership grants (pre-approved tokens from current leader)
            } else if (message?.type === TabMessageType.LEADERSHIP_GRANT) {
                // Only process grants intended for this specific tab
                if (message.to === this.tabId) {
                    if (this.debug) {
                        console.log('[TabManager] Received leadership grant:', {
                            timestamp: message.ts,
                            token: message.token?.slice(0, 8) + '...',
                            from: 'current leader'
                        })
                    }
                } else {
                    if (this.debug) {
                        console.log('[TabManager] Leadership grant is for different tab:', message.to)
                    }
                }
            } else {
                if (this.debug) console.log('[TabManager] Unknown message type:', message?.type)
            }
        })

        if (this.debug) console.log('[TabManager] ✅ Inter-tab message listener configured')
    }

    /**
     * Handle localStorage storage events from other tabs
     *
     * COORDINATION LOGIC:
     * - When another tab writes a leadership grant to localStorage
     * - All tabs see this storage event immediately
     * - Current leader checks if grant is for a different tab
     * - If so, current leader steps down to allow handoff
     */
    private onStorageChange (e: StorageEvent): void {
        // Only process events for our leadership grant key
        if (e.key !== this.GRANT_KEY) {
            if (this.debug && e.key?.startsWith(this.namespace)) {
                console.log('[TabManager] Storage event for different key:', e.key)
            }
            return
        }

        if (this.debug) console.log('[TabManager] Leadership grant storage event detected')

        // Read and validate the current grant from localStorage
        const grant = this.readGrant()

        if (this.debug) {
            console.log('[TabManager] Grant details:', {
                exists: !!grant,
                forTab: grant?.to || 'none',
                thisTab: this.tabId.slice(-8),
                isCurrentlyLeader: this._isActiveTab.value
            })
        }

        // If this tab is currently the leader AND a valid grant exists for a different tab
        // then this tab should step down to allow the handoff
        if (this._isActiveTab.value && grant && grant.to !== this.tabId) {
            if (this.debug) {
                console.log('[TabManager] Current leader stepping down - grant is for different tab:', {
                    grantForTab: grant.to.slice(-8),
                    currentLeader: this.tabId.slice(-8)
                })
            }

            // Step down from leadership
            this.setActiveState(false)
            this.tab.relinquishLeadership()

            if (this.debug) console.log('[TabManager] Leadership relinquished due to storage grant')
        } else if (this.debug) {
            if (!this._isActiveTab.value) {
                console.log('[TabManager] Not currently leader, ignoring storage grant')
            } else if (!grant) {
                console.log('[TabManager] No valid grant found in storage')
            } else if (grant.to === this.tabId) {
                console.log('[TabManager] Storage grant is for this tab, no action needed')
            }
        }
    }

    private initializeTabElection (): void {
        this.tab.waitForLeadership(() => {
            const grant = this.readGrant()

            if (grant && grant.to !== this.tabId) {
                if (this.debug) console.log('[Leader] Another tab has a valid grant; stepping down')
                this.setActiveState(false)
                this.tab.relinquishLeadership()
                return {} // return any shape; we’re stepping down right away
            }

            // clear self grant if present
            if (grant && grant.to === this.tabId) this.clearGrant()

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
                requestLeadership: async ({ tabId, requestId, ts, visible }: {
                    tabId: string;
                    requestId: string;
                    ts: number;
                    visible: boolean
                }) => {
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
                    // Persist grant (so stray winners see it and step down)
                    this.writeGrant({
                        to: tabId,
                        token,
                        ts
                    })

                    // Broadcast (so the intended winner caches token if it wants)
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

    /**
     * Set the active state of this tab and manage SIP connection accordingly
     *
     * STATE TRANSITIONS:
     * - Active: Register with SIP server, handle calls
     * - Inactive: Unregister from SIP server, stop handling calls
     *
     * @param isActive - Whether this tab should be the active leader
     */
    private setActiveState (isActive: boolean): void {
        // Skip if state hasn't changed (prevents unnecessary SIP operations)
        if (this._isActiveTab.value === isActive) {
            if (this.debug) console.log(`[TabManager] State already ${isActive ? 'active' : 'inactive'}, no change needed`)
            return
        }

        if (this.debug) {
            console.log(`[TabManager] State change: ${this._isActiveTab.value ? 'active' : 'inactive'} → ${isActive ? 'active' : 'inactive'}`)
        }

        // Update the reactive state
        this._isActiveTab.value = isActive

        // Manage SIP connection based on active state
        if (isActive) {
            if (this.debug) console.log('[TabManager] Becoming active - registering with SIP server...')
            tryRegisterOpenSIPS()
        } else {
            if (this.debug) console.log('[TabManager] Becoming inactive - unregistering from SIP server...')
            unregisterOpenSIPS()
        }

        if (this.debug) console.log(`[TabManager] Tab is now ${isActive ? 'ACTIVE' : 'INACTIVE'}`)
    }

    /**
     * Request leadership from the current leader (debounced to prevent spam)
     *
     * PRECONDITIONS CHECKED:
     * - Tab must not be destroyed
     * - Tab must not already be active
     * - No other tab should have active calls (unless it's this tab)
     * - Tab must be visible to user
     *
     * REQUEST FLOW:
     * 1. Generate unique timestamped request ID
     * 2. Send request to current leader via tab-election
     * 3. Wait for LEADERSHIP_GRANT message response
     * 4. tab-election will promote this tab if grant is received
     */
    public sendLeadershipRequest = debounce(async () => {
        // PRECONDITION: Tab must not be destroyed
        if (this.isDestroyed) {
            if (this.debug) console.log('[TabManager] Skipping leadership request - tab is destroyed')
            return
        }

        // PRECONDITION: Don't request if already active
        if (this._isActiveTab.value) {
            if (this.debug) console.log('[TabManager] Skipping leadership request - already active')
            return
        }

        // PRECONDITION: Don't request if another tab has active calls
        if (this._tabWithActiveCalls.value && this._tabWithActiveCalls.value !== this.tabId) {
            if (this.debug) {
                console.log('[TabManager] Skipping leadership request - another tab has active calls:',
                    this._tabWithActiveCalls.value.slice(-8))
            }
            return
        }

        // PRECONDITION: Tab must be visible to user
        if (document.hidden) {
            if (this.debug) console.log('[TabManager] Skipping leadership request - tab is hidden')
            return
        }

        // Generate high-precision timestamp for race condition resolution
        // Uses milliseconds + microseconds for uniqueness across rapid requests
        const ts = Date.now() * 1e3 + Math.floor(performance.now() % 1e3)
        const requestId = `${ts}-${this.tabId}`

        // Prevent duplicate requests (safety check)
        if (this.lastSentRequestId === requestId) {
            if (this.debug) console.log('[TabManager] Skipping duplicate leadership request')
            return
        }

        this.lastSentRequestId = requestId

        if (this.debug) {
            console.log('[TabManager] Sending leadership request:', {
                tabId: this.tabId.slice(-8),
                requestId: requestId.slice(-12),
                timestamp: ts,
                visible: !document.hidden
            })
        }

        try {
            // Send request to current leader via tab-election system
            await this.tab.call('requestLeadership', {
                tabId: this.tabId,
                requestId,
                ts,
                visible: !document.hidden
            })

            if (this.debug) console.log('[TabManager] Leadership request sent successfully')
            // Response will arrive via LEADERSHIP_GRANT message if approved

        } catch (error) {
            // Request failed (no leader, network issues, etc.)
            // This is normal and expected when no leader exists yet
            if (this.debug) console.log('[TabManager] Leadership request failed (likely no current leader):', error)
        }
    }, 200)  // 200ms debounce prevents spam from rapid user interactions

    /**
     * Broadcast this tab's call state to all other tabs for coordination
     *
     * COORDINATION PURPOSE:
     * - Inform other tabs which tab currently has active calls
     * - Prevents other tabs from taking leadership when calls are active
     * - Helps inactive tabs show "Switch to Active Tab" buttons
     *
     * @param hasActiveCalls - Whether this tab currently has active calls
     */
    private broadcastCallState (hasActiveCalls: boolean): void {
        if (this.debug) {
            console.log('[TabManager] Broadcasting call state change:', {
                hasActiveCalls,
                tabId: this.tabId.slice(-8)
            })
        }

        // Update local state tracking
        this._tabWithActiveCalls.value = hasActiveCalls ? this.tabId : ''

        // Broadcast to all other tabs via tab-election messaging
        this.tab.send({
            type: TabMessageType.CALL_STATE,
            tabWithCalls: hasActiveCalls ? this.tabId : '',
            tabId: this.tabId
        })

        if (this.debug) {
            console.log(`[TabManager] Call state broadcasted: ${hasActiveCalls ? 'HAS CALLS' : 'NO CALLS'}`)
        }
    }

    /**
     * Handle individual call changes for notification management
     *
     * RESPONSIBILITIES:
     * - Show notifications for new incoming calls
     * - Clean up notifications for ended calls
     * - Only process when this tab is the active leader
     *
     * @param newCalls - Current active calls state
     * @param oldCalls - Previous active calls state
     */
    private handleCallChanges (newCalls: AllActiveCallsType, oldCalls: AllActiveCallsType): void {
        // Only the active tab should handle call notifications
        if (!this._isActiveTab.value) {
            if (this.debug) console.log('[TabManager] Skipping call change handling - not active tab')
            return
        }

        // Calculate call changes by comparing call IDs
        const newCallIds = new Set(Object.keys(newCalls))
        const oldCallIds = new Set(Object.keys(oldCalls))

        if (this.debug) {
            console.log('[TabManager] Processing call changes:', {
                newCalls: Array.from(newCallIds),
                oldCalls: Array.from(oldCallIds),
                added: Array.from(newCallIds).filter(id => !oldCallIds.has(id)),
                removed: Array.from(oldCallIds).filter(id => !newCallIds.has(id))
            })
        }

        // Handle new calls - show notifications for incoming calls
        newCallIds.forEach(callId => {
            if (!oldCallIds.has(callId)) {
                const call = newCalls[callId]
                if (this.debug) {
                    console.log('[TabManager] New call detected:', {
                        callId,
                        direction: call.direction,
                        confirmed: call._is_confirmed
                    })
                }

                // Show notification only for unconfirmed incoming calls
                if (call.direction === 'incoming' && !call._is_confirmed) {
                    if (this.debug) console.log('[TabManager] Showing incoming call notification')
                    this.showIncomingCallNotification(call, callId)
                } else if (this.debug) {
                    console.log('[TabManager] Skipping notification - not incoming or already confirmed')
                }
            }
        })

        // Handle ended calls - clean up notifications
        oldCallIds.forEach(callId => {
            if (!newCallIds.has(callId)) {
                if (this.debug) console.log('[TabManager] Call ended, cleaning up notification:', callId)
                this.cleanupNotification(callId)
            }
        })

        if (this.debug) console.log('[TabManager] Call change handling completed')
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
            const { displayName, displayNumber } = await getCallDisplayInfo(call)

            const notification = new Notification('Incoming Call', {
                body: `Call from ${displayName} (${displayNumber})`,
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

    /**
     * Handle beforeunload event to warn user about closing tab with active calls
     *
     * BROWSER BEHAVIOR:
     * - Shows browser confirmation dialog if return value is set
     * - User can choose to stay or leave
     * - Only triggers for tabs with active calls
     *
     * @param event - Browser beforeunload event
     */
    private handleBeforeUnload (event: BeforeUnloadEvent): void | string {
        // Check if this tab has active calls that would be terminated
        if (this.hasActiveCalls()) {
            const callCount = Object.keys(activeCalls.value).length
            if (this.debug) {
                console.log(`[TabManager] Preventing tab close - ${callCount} active calls`)
            }

            // Browser standard way to show confirmation dialog
            event.preventDefault()
            const message = 'You have active calls'
            event.returnValue = message
            return message
        } else if (this.debug) {
            console.log('[TabManager] Tab close allowed - no active calls')
        }
    }

    /**
     * Handle pagehide event to clean up when tab is actually closing
     *
     * CLEANUP ACTIONS:
     * - Terminate all active calls
     * - Broadcast that this tab no longer has calls
     * - Only processes if this tab has active calls
     *
     * BROWSER BEHAVIOR:
     * - pagehide fires when tab is actually closing/navigating
     * - Unlike beforeunload, this cannot be prevented
     * - Must be fast to complete before tab closes
     */
    private handlePageHide (): void {
        if (this.hasActiveCalls()) {
            const callCount = Object.keys(activeCalls.value).length
            if (this.debug) {
                console.log(`[TabManager] Tab closing with ${callCount} active calls - force terminating...`)
            }

            const { getAudioApi } = useOpenSIPSJS()
            const { terminateCall } = getAudioApi()

            // Terminate all active calls immediately
            Object.values(activeCalls.value).forEach((call: ICall) => {
                try {
                    if (this.debug) console.log(`[TabManager] Terminating call: ${call._id}`)
                    terminateCall(call._id)
                } catch (error) {
                    console.error('[TabManager] Failed to terminate call:', error)
                }
            })

            // Inform other tabs that this tab no longer has calls
            this.broadcastCallState(false)

            if (this.debug) console.log('[TabManager] Page hide cleanup completed')
        } else if (this.debug) {
            console.log('[TabManager] Page hide - no active calls to clean up')
        }
    }

    /**
     * Handle visibility change events
     * When tab becomes visible, request leadership (user focused this tab)
     *
     * VISIBILITY STATES:
     * - hidden: Tab is not visible (minimized, other tab active, etc.)
     * - visible: Tab is currently visible to user
     *
     * LEADERSHIP LOGIC:
     * - Only request leadership when becoming visible
     * - Ignore when becoming hidden (don't give up leadership)
     */
    private handleVisibilityChange (): void {
        if (this.debug) {
            console.log('[TabManager] Visibility change:', {
                hidden: document.hidden,
                visibilityState: document.visibilityState
            })
        }

        // Only request leadership when tab becomes visible
        if (!document.hidden) {
            if (this.debug) console.log('[TabManager] Tab became visible - requesting leadership')
            this.sendLeadershipRequest()
        } else if (this.debug) {
            console.log('[TabManager] Tab became hidden - no action needed')
        }
    }

    /**
     * Check if this tab currently has any active calls
     *
     * @returns true if there are active calls, false otherwise
     */
    private hasActiveCalls (): boolean {
        const callCount = Object.keys(activeCalls.value).length
        if (this.debug) console.log(`[TabManager] Active calls check: ${callCount} calls`)
        return callCount > 0
    }

    /**
     * Generate unique identifier for this tab instance
     *
     * FORMAT: "tab-{timestamp}-{randomString}"
     * - timestamp: Current time in milliseconds for ordering
     * - randomString: 9-character random string for uniqueness
     *
     * @returns Unique tab identifier string
     */
    private generateTabId (): string {
        const timestamp = Date.now()
        const randomPart = Math.random().toString(36).substr(2, 9)
        const tabId = `tab-${timestamp}-${randomPart}`

        if (this.debug) {
            console.log('[TabManager] Generated tab ID:', {
                full: tabId,
                short: tabId.slice(-8),
                timestamp,
                random: randomPart
            })
        }

        return tabId
    }

    /**
     * Force this tab to become active (bypass normal leadership election)
     *
     * USE CASES:
     * - User explicitly clicks "Activate Tab" button
     * - Emergency activation when other systems fail
     * - Debug/testing scenarios
     *
     * WARNING: This bypasses normal coordination - use carefully!
     */
    async forceActivation (): Promise<void> {
        if (this.isDestroyed) {
            if (this.debug) console.log('[TabManager] Cannot force activation - tab is destroyed')
            return
        }

        if (this.debug) console.log('[TabManager] FORCE ACTIVATION requested - bypassing normal election')

        // Force active state without going through leadership election
        this.setActiveState(true)

        // Update call state tracking
        const hasActiveCalls = this.hasActiveCalls()
        this._tabWithActiveCalls.value = hasActiveCalls ? this.tabId : ''

        if (this.debug) {
            console.log('[TabManager] Force activation completed:', {
                isActive: this._isActiveTab.value,
                hasActiveCalls,
                tabWithCalls: this._tabWithActiveCalls.value.slice(-8) || 'none'
            })
        }
    }

    /**
     * Request focus on the tab that currently has active calls
     *
     * USAGE SCENARIO:
     * - User is on inactive tab and wants to switch to active tab with calls
     * - UI shows "Switch to Active Tab" button that calls this method
     * - Sends message to tab with calls to show focus notification
     */
    requestFocusOnTabWithCalls (): void {
        const targetTabId = this._tabWithActiveCalls.value

        if (this.debug) {
            console.log('[TabManager] Focus request:', {
                targetTab: targetTabId ? targetTabId.slice(-8) : 'none',
                hasTarget: !!targetTabId
            })
        }

        if (targetTabId) {
            if (this.debug) console.log('[TabManager] Sending focus request to tab with calls')

            // Send focus request message to the specific tab
            this.tab.send({
                type: TabMessageType.FOCUS_REQUEST,
                tabId: targetTabId
            })

            if (this.debug) console.log('[TabManager] Focus request sent successfully')
        } else {
            if (this.debug) console.log('[TabManager] No tab with calls to focus on')
        }
    }

    destroy (): void {
        if (this.isDestroyed) return

        this.isDestroyed = true

        if (this.hasActiveCalls()) {
            const { getAudioApi } = useOpenSIPSJS()
            const { terminateCall } = getAudioApi()
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

        // Clean up all event listeners
        this.removeEventListeners()

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
