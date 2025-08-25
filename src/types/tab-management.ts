/**
 * Simplified tab management types for BroadcastChannel communication
 */

/**
 * Tab message types for inter-tab communication
 */
export enum TabMessageType {
    CALL_STATE = 'call-state',
    ACTIVATION_REQUEST = 'activation-request',
    HEARTBEAT = 'heartbeat',
    FOCUS_REQUEST = 'focus-request',
    LEADERSHIP_GRANT = 'leadership-grant'
}

/**
 * Call state broadcast message
 */
export interface ICallStateMessage {
    type: TabMessageType.CALL_STATE
    tabId: string
    hasActiveCalls: boolean
}

/**
 * Activation request message
 */
export interface IActivationRequestMessage {
    type: TabMessageType.ACTIVATION_REQUEST
    tabId: string
}

/**
 * Heartbeat message from active tab
 */
export interface IHeartbeatMessage {
    type: TabMessageType.HEARTBEAT
    tabId: string
    timestamp: number
}

/**
 * Focus request message
 */
export interface IFocusRequestMessage {
    type: TabMessageType.FOCUS_REQUEST
    tabId: string
}

/**
 * Union type for all tab messages
 */
export type TabMessage = ICallStateMessage | IActivationRequestMessage | IHeartbeatMessage | IFocusRequestMessage

/**
 * Tab configuration (currently unused but kept for future extensibility)
 */
export interface ITabConfig {
    channelName?: string
    focusDelay?: number
    activationDelay?: number
}
