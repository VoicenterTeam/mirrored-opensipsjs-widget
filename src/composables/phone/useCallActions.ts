import { computed, ref } from 'vue'
import { usePhoneState } from '@/composables/phone/usePhoneState.ts'
import { useOpenSIPSJS } from '@/composables/opensipsjs'
import { KeyPadTriggerObjectType, CALL_ACTIONS_NAMES } from '@/constants/phone.ts'
import { ActionsPopupInitiator } from '@/types/phone'
import { ActionsTriggerObjectType } from '@/constants/phone.ts'
import { ActionsObjectType, CallActionName } from '@/types/phone'
import { useVsipInject } from '@/composables/phone/useVsipProvideInject.ts'
import { validTarget } from '@/helpers/general.ts'
import { getTranslation } from '@/plugins/translator'

const actionsPopupType = ref<null | ActionsPopupInitiator>(null)
const callToMove = ref<string | undefined>(undefined)
const callToTransfer = ref<string | undefined>(undefined)

export default function useCallActions () {

    /* Data */
    const { callsInActiveRoom, roomsWithoutActive } = useVsipInject()
    const { phoneNumber, onPhoneNumberChange, keyPadTrigger, onKeyPadToggle } = usePhoneState()
    const { startCall, transferCall } = useOpenSIPSJS()

    /* Methods */
    const onActionsToggle = (value: null | ActionsPopupInitiator) => {
        actionsPopupType.value = value
    }
    const onCallToTransferChange =  (callId: string | undefined) => {
        callToTransfer.value = callId
    }
    const onCallToMoveChange =  (callId: string | undefined) => {
        callToMove.value = callId
    }
    const handleCallMove = () => {
        const activeCall = actionsPopupType.value?.callId
        onActionsToggle(null)
        onCallToMoveChange(activeCall)
    }

    const handleCallTransfer = () => {
        const activeCall = actionsPopupType.value?.callId
        onActionsToggle(null)
        onCallToTransferChange(activeCall)
    }

    const onCallTransfer = (phone: string) => {
        if(!callToTransfer.value) {
            return
        }

        transferCall( callToTransfer.value, phone)
        onCallToTransferChange(undefined)
    }

    const capitalizeFirstLetter =  (input: string) => {
        return input.trim().replace(/^\w/, char => char.toUpperCase()) || ''
    }
    const initCall = () => {
        if (!phoneNumber.value || !validTarget(phoneNumber.value)) {
            return
        }
        const addToCurrentRoom = keyPadTrigger.value === KeyPadTriggerObjectType.add_caller
        //const holdRestCalls = addToCurrentRoom // If addToCurrentRoom is true, holdRestCalls will also be true
        // add holdRestCalls to start call method

        startCall(phoneNumber.value, addToCurrentRoom, true)

        onKeyPadToggle(undefined)
        onPhoneNumberChange('')
    }
    const shouldIncludeAction = (action: ActionsObjectType) => {
        const isMoveAction = action.name === CALL_ACTIONS_NAMES.MOVE

        if (roomsWithoutActive.value.length === 0 && isMoveAction) {
            return false
        }

        return true
    }

    const createAction = (icon: string, color: string, textKey: string, action: () => void, name: CallActionName): ActionsObjectType => ({
        icon,
        color,
        title: capitalizeFirstLetter(textKey),
        action,
        name
    })
    const separateCallActionsBaseConfig = computed(() => {
        return [
            [
                // createAction('vc-lc-circle-pause', 'var(--red-icon-phone)', 'dialPad.actions.mute.recording', handleCallRecord),
                createAction(
                    'vc-lc-forward',
                    'var(--blue-actions-button)',
                    getTranslation('audio.transfer'),
                    handleCallTransfer,
                    CALL_ACTIONS_NAMES.TRANSFER
                ),
                createAction(
                    'vc-lc-git-pull-request-arrow',
                    'var(--blue-actions-button)',
                    getTranslation('audio.move'),
                    handleCallMove,
                    CALL_ACTIONS_NAMES.MOVE
                ),
                // createAction('vc-lc-clipboard-pen', 'var(--time-grey)', 'dialPad.actions.fill.form', handleCallFormFill),
            ]
        ]
    })
    const displayAllControls = computed(() => {
        const callCount = callsInActiveRoom.value.length
        return callCount <= 3
    })
    const controlsConfig = computed(() => [
        // createAction(allCallsMuted.value ? 'vc-lc-mic-off' : 'vc-lc-mic', 'var(--red-icon-phone)', allCallsMuted.value ? 'dialPad.unmute.all' : 'dialPad.mute.all', toggleMuteAll),
        createAction(
            'vc-lc-phone',
            'var(--blue-bg)',
            getTranslation('audio.new.call'),
            () => onKeyPadToggle(KeyPadTriggerObjectType.new_call),
            CALL_ACTIONS_NAMES.NEW_CALL
        ),
        createAction(
            'vc-lc-user-plus',
            'var(--blue-bg)',
            getTranslation('audio.add.caller'),
            () => onKeyPadToggle(KeyPadTriggerObjectType.add_caller),
            CALL_ACTIONS_NAMES.ADD_CALLER
        ),
        // createAction('vc-lc-grip', 'var(--blue-bg)', 'dialPad.conference.button', () => unHoldAllCalls()),
    ])
    const singleCallActionsBaseConfig = [ [
        createAction(
            'vc-lc-phone',
            'var(--blue-bg)',
            getTranslation('audio.new.call'),
            () => onKeyPadToggle(KeyPadTriggerObjectType.new_call),
            CALL_ACTIONS_NAMES.NEW_CALL
        ),
        createAction(
            'vc-lc-git-pull-request-arrow',
            'var(--blue-actions-button)',
            getTranslation('audio.move'),
            handleCallMove,
            CALL_ACTIONS_NAMES.MOVE
        ),
    ] ]
    const multipleActions = computed(() => {
        if (!displayAllControls.value) {
            return [
                [ ...controlsConfig.value ],
            ]
        }
        return [
            [
                createAction(
                    'vc-lc-phone',
                    'var(--blue-bg)',
                    getTranslation('audio.new.call'),
                    () => onKeyPadToggle(KeyPadTriggerObjectType.new_call),
                    CALL_ACTIONS_NAMES.NEW_CALL
                ),
            ]
        ]
    })
    const separateCallActionsConfig = computed(() => {
        const filteredActions = separateCallActionsBaseConfig.value[0].filter(shouldIncludeAction)
        return [ filteredActions ]
    })
    const singleCallActionsConfig = computed(() => {
        const filteredActions = singleCallActionsBaseConfig[0].filter(shouldIncludeAction)
        return [ filteredActions ]
    })

    const actionsConfig = computed(() => {
        switch (actionsPopupType.value?.initiator) {
            case ActionsTriggerObjectType.separate:
                return separateCallActionsConfig.value
            case ActionsTriggerObjectType.single:
                return singleCallActionsConfig.value
            default:
                return multipleActions.value
        }
    })
    return {
        initCall,
        onActionsToggle,
        onCallToMoveChange,
        handleCallMove,
        onCallTransfer,
        onCallToTransferChange,
        actionsConfig,
        callToMove,
        callToTransfer,
        actionsPopupType,
        displayAllControls
    }
}
