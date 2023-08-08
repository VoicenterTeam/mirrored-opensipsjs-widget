import type { ICallSettings } from '@/types/internal'
import { defaultRingingSound } from '@/utils/ringingSound'

export const defaultCallSettings: ICallSettings = {
    allowTransfer: true,
    autoAnswer: {
        allowChange: false,
        defaultBehavior: false
    },
    outgoingCalls: false,
    callerInfo: {
        displayName: true,
        callerId: {
            display: true,
            mask: false
        }
    },
    shrinkOnIdle: false,
    ringingSound: defaultRingingSound
}
