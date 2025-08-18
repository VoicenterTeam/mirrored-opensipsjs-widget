import { ActionsTriggerObjectType, CALL_ACTIONS_NAMES } from '@/constants/phone.ts'

export type CallActionName = typeof CALL_ACTIONS_NAMES[keyof typeof CALL_ACTIONS_NAMES]

export interface GenericObjectType<T> {
    [key: string]: T
}
export interface CallUserDataType {
    userName?: string
    userPhone?: string
}

export interface ControlButtonObjectType {
    type: string;
    src: string;
    name: string;
    action: () => void;
}
export type actionsTriggerType = keyof typeof ActionsTriggerObjectType
export interface ActionsPopupInitiator {
    initiator: actionsTriggerType
    callId?: string
}
export interface ActionsObjectType {
    icon: string,
    color: string,
    title: string,
    action: () => void
    name: CallActionName
}
