import { ActionsTriggerObjectType } from '@/constants/phone.ts'

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
}