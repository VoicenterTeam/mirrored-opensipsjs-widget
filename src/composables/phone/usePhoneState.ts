import { ref } from 'vue'
import { keyPadTriggerType, MAX_NUMBER_INPUT_LENGTH } from '@/constants/phone.ts'

const phoneNumber = ref('')
const keyPadTrigger = ref<keyPadTriggerType | undefined>(undefined)
const isActiveCallsPopupActive = ref(false)

export function usePhoneState () {


    /* Methods */
    const onNumberInput = (value: string| number ) => {
        if (phoneNumber.value.length >= MAX_NUMBER_INPUT_LENGTH) {
            return
        }
        value = `${value}`
        onPhoneNumberChange(value.trim().replace(/[^0-9*#]/g, ''))
    }
    const onActiveCallsPopupToggle = (state: boolean) => {
        isActiveCallsPopupActive.value = state
    }

    const onPhoneNumberChange = (value: string) => {
        phoneNumber.value =  value
    }
    const onKeyPadToggle = (value?: keyPadTriggerType) => {
        keyPadTrigger.value = value
    }

    return {
        onPhoneNumberChange,
        onKeyPadToggle,
        onNumberInput,
        onActiveCallsPopupToggle,
        isActiveCallsPopupActive,
        phoneNumber,
        keyPadTrigger
    }
}
