import type { ICallSettings } from '@/types/public-api'
import { defaultRingingSound } from '@/utils/ringingSound'

export const defaultCallSettings: ICallSettings = {
    isQuickCall: false,
    quickCallNumber: '665',
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
    ringingSound: defaultRingingSound,
    outgoingCallPlaceHolder: '',
    outgoingInputRegexValidator: [
        '/^\\+?\\d*$/'
    ]
}
