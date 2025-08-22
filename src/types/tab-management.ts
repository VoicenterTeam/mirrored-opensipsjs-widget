/**
 * Simplified tab management types for BroadcastChannel communication
 */

/**
 * Tab message types for inter-tab communication
 */
export enum TabMessageType {
    CALL_STATE = 'call-state',
    ACTIVATION_REQUEST = 'activation-request',
    HEARTBEAT = 'heartbeat'
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
 * Union type for all tab messages
 */
export type TabMessage = ICallStateMessage | IActivationRequestMessage | IHeartbeatMessage

/**
 * Tab configuration (currently unused but kept for future extensibility)
 */
export interface ITabConfig {
    channelName?: string
    focusDelay?: number
    activationDelay?: number
}