import { computed, ref } from 'vue'
import { usePhoneState } from '@/composables/phone/usePhoneState.ts'
import { useOpenSIPSJS } from '@/composables/opensipsjs'
import { KeyPadTriggerObjectType } from '@/constants/phone.ts'
import { ActionsPopupInitiator } from '@/types/phone'
import { ActionsTriggerObjectType } from '@/constants/phone.ts'
import { ActionsObjectType } from '@/types/phone'
import { useVsipInject } from '@/composables/phone/useVsipProvideInject.ts'

const actionsPopupType = ref<null | ActionsPopupInitiator>(null)


export default function useCallActions () {

    /* Data */
    const { callsInActiveRoom } = useVsipInject()
    const { phoneNumber, onPhoneNumberChange, keyPadTrigger, onKeyPadToggle } = usePhoneState()
    const { startCall } = useOpenSIPSJS()

    /* Methods */
    const onActionsToggle = (value: null | ActionsPopupInitiator) => {
        actionsPopupType.value = value
    }
    const capitalizeFirstLetter =  (input: string) => {
        return  input.trim().replace(/^\w/, char => char.toUpperCase()) || ''
    }
    const initCall = () => {
        if( !phoneNumber.value ) {
            return
        }
        const addToCurrentRoom = keyPadTrigger.value === KeyPadTriggerObjectType.add_caller
        //const holdRestCalls = addToCurrentRoom // If addToCurrentRoom is true, holdRestCalls will also be true
        // add holdRestCalls to start call method

        startCall(phoneNumber.value, addToCurrentRoom)

        onKeyPadToggle(undefined)
        onPhoneNumberChange('')
    }
    const shouldIncludeAction = (action: ActionsObjectType) => {
        // const isMoveAction = action.title === capitalizeFirstLetter(self.$t('dialPad.actions.move'))
        //
        // if (roomsWithoutActive.value.length === 0 && isMoveAction) {
        //     return false
        // }

        return true
    }

    const createAction = (icon: string, color: string, textKey: string, action: () => void) => ({
        icon,
        color,
        title: capitalizeFirstLetter(textKey),
        action
    })
    const separateCallActionsBaseConfig = computed(() => {
        return [ [
            // createAction('vc-lc-circle-pause', 'var(--red-icon-phone)', 'dialPad.actions.mute.recording', handleCallRecord),
            // createAction('vc-lc-forward', 'var(--blue-actions-button)', 'dialPad.actions.transfer', handleCallTransfer),
            // createAction('vc-lc-git-pull-request-arrow', 'var(--blue-actions-button)', 'dialPad.actions.move', handleCallMove),
            // createAction('vc-lc-clipboard-pen', 'var(--time-grey)', 'dialPad.actions.fill.form', handleCallFormFill),
        ] ]
    })
    const displayAllControls = computed(() => {
        const callCount = callsInActiveRoom.value.length
        return callCount <= 3
    })
    const controlsConfig = computed(() => [
        // createAction(allCallsMuted.value ? 'vc-lc-mic-off' : 'vc-lc-mic', 'var(--red-icon-phone)', allCallsMuted.value ? 'dialPad.unmute.all' : 'dialPad.mute.all', toggleMuteAll),
        createAction('vc-lc-phone', 'var(--blue-bg)', 'dialPad.new.call.button', () => onKeyPadToggle(KeyPadTriggerObjectType.new_call)),
        createAction('vc-lc-user-plus', 'var(--blue-bg)', 'dialPad.add.caller.button', () => onKeyPadToggle(KeyPadTriggerObjectType.add_caller)),
        // createAction('vc-lc-grip', 'var(--blue-bg)', 'dialPad.conference.button', () => unHoldAllCalls()),
    ])
    const singleCallActionsBaseConfig = [ [
        createAction('vc-lc-phone', 'var(--blue-bg)', 'new call', () => onKeyPadToggle(KeyPadTriggerObjectType.new_call)),
        // createAction('vc-lc-git-pull-request-arrow', 'var(--blue-actions-button)', 'dialPad.actions.move', handleCallMove),
    ] ]
    const multipleActions = computed(() => {
        if (!displayAllControls.value) {
            return [
                [ ...controlsConfig.value ],
            ]
        }
        return [
            [
                createAction('vc-lc-phone', 'var(--blue-bg)', 'new call', () => onKeyPadToggle(KeyPadTriggerObjectType.new_call)),
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
        actionsConfig,
        actionsPopupType,
        displayAllControls
    }
}