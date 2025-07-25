//import type { ICallSettings } from '@/types/public-api'
import { defaultRingingSound } from '@/utils/ringingSound'

export const defaultCallSettings/*: ICallSettings*/ = {
    quickCallNumber: '665',
    showKeypad: true,
    allowTransfer: true,
    autoAnswer: {
        allowChange: false,
        defaultBehavior: false
    },
    DND: {
        allowChange: false,
        defaultBehavior: false
    },
    callWaiting: true,
    outgoingCalls: false,
    mergeCalls: true,
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
