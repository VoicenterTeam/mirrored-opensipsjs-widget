import { computed, ref } from 'vue'
import { keyPadTriggerType, KeyPadTriggerObjectType, MAX_NUMBER_INPUT_LENGTH } from '@/constants/phone.ts'
import { useOpenSIPSJS, allActiveCalls, currentActiveRoom } from '@/composables/opensipsjs'
import { buttonPressSound } from '@/constants/phone.ts'


const phoneNumber = ref('')
const keyPadTrigger = ref<keyPadTriggerType | undefined>(undefined)
const isActiveCallsPopupActive = ref(false)
const buttonPressAudioElement = new Audio(buttonPressSound)
let digitBuffer = ''

export function usePhoneState () {


    /* Data */
    const { sendDTMF } = useOpenSIPSJS()

    /* Computed */
    const callsInActiveRoom = computed(() => {
        return allActiveCalls.value.filter((call) => {
            return call.roomId === currentActiveRoom.value
        })
    })
    
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

    const sendDTMFLocal = (dtmfValue: string) => {
        const activeCalls = callsInActiveRoom.value

        if (activeCalls.length === 0) {
            console.warn('No active calls to send DTMF to.')
            return
        }

        activeCalls.forEach((call) => {
            sendDTMF(call._id, dtmfValue)
        })

        digitBuffer = ''

    }
    const playBeepSound = () => {
        buttonPressAudioElement.play()
    }

    const onPhoneNumberChange = (value: string) => {

        // Check if the keypad trigger is active
        if (keyPadTrigger.value === KeyPadTriggerObjectType.keypad) {
            const newDigits = value.slice(phoneNumber.value.length)

            digitBuffer += newDigits

            if( digitBuffer ) {
                sendDTMFLocal(digitBuffer)
                playBeepSound()
            }
        }

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
