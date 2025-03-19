import { computed, ref, watch } from 'vue'
import { getInputMediaDevicesList, getOutputMediaDevicesList } from '@/helpers/mediaDevicesHelper.ts'
import { useOpenSIPSJS  } from '@/composables/opensipsjs'

const { state } = useOpenSIPSJS()

/* Types */

export type MediaDevicesList = {
    inputMediaDevicesList: Array<MediaDeviceInfo>
    outputMediaDevicesList: Array<MediaDeviceInfo>
}

/* Data */
const inputMediaDevicesList = ref<Array<MediaDeviceInfo>>([])
const outputMediaDevicesList = ref<Array<MediaDeviceInfo>>([])
export const outputMediaDeviceValue = ref('')
export const inputMediaDeviceValue = ref('')

/* Computed */
const getInputMediaDevicesListComputed = computed(() => inputMediaDevicesList.value)
const getOutputMediaDevicesListComputed = computed(() => outputMediaDevicesList.value)
export const getMediaDevicesList = computed<MediaDevicesList>(() => {
    return {
        inputMediaDevicesList: getInputMediaDevicesListComputed.value,
        outputMediaDevicesList: getOutputMediaDevicesListComputed.value
    }
})

watch(outputMediaDeviceValue, (value) => {
    const preferablePhoneDevices = localStorage.getItem('preferablePhoneDevices')

    const parsed = preferablePhoneDevices ? JSON.parse(preferablePhoneDevices) : {}

    const selectedPreferableDevices = {
        audioInput: parsed.audioInput,
        audioOutput: value,
    }

    localStorage.setItem('preferablePhoneDevices', JSON.stringify(selectedPreferableDevices))
    state.opensipsjs?.audio.setSpeaker(value || 'default')
})
watch(inputMediaDeviceValue, (value) => {
    const preferablePhoneDevices = localStorage.getItem('preferablePhoneDevices')

    const parsed = preferablePhoneDevices ? JSON.parse(preferablePhoneDevices) : {}

    const selectedPreferableDevices = {
        audioInput: value,
        audioOutput: parsed.audioOutput,
    }

    localStorage.setItem('preferablePhoneDevices', JSON.stringify(selectedPreferableDevices))
    state.opensipsjs?.audio.setMicrophone(value || 'default')

})
/* Methods */

function isDeviceInfoType (device: MediaDeviceInfo | null): device is MediaDeviceInfo {
    return device !== null
}
async function onDeviceChangeHandler () {
    const newInputMediaDeviceList = await getInputMediaDevicesList()
    const newOutputMediaDeviceList = await getOutputMediaDevicesList()

    inputMediaDevicesList.value = newInputMediaDeviceList.filter(isDeviceInfoType)
    outputMediaDevicesList.value = newOutputMediaDeviceList.filter(isDeviceInfoType)

    //check if input device still exist
    const inputDevice = inputMediaDevicesList.value.find(device => {
        return device.deviceId === inputMediaDeviceValue.value
    })
    if(!inputDevice) {
        inputMediaDeviceValue.value = 'default'
    }

    //check if output device still exist
    const outputDevice = outputMediaDevicesList.value.find(device => {
        return device.deviceId === outputMediaDeviceValue.value
    })

    if(!outputDevice) {
        outputMediaDeviceValue.value = 'default'
    }
}

export async function setDefaultMediaDevices () {
    try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('getUserMedia() not supported')
        }

        await navigator.mediaDevices.getUserMedia({ audio: true })
        const devices = await navigator.mediaDevices.enumerateDevices()


        const preferablePhoneDevices = localStorage.getItem('preferablePhoneDevices')
        const parsed = preferablePhoneDevices ? JSON.parse(preferablePhoneDevices) : {}

        const preferableInputDevice = devices.find(
            (device) => device.deviceId === parsed.audioInput && device.kind === 'audioinput')

        const inputDefaultDevice = devices.find(
            (device) => device.deviceId === 'default' && device.kind === 'audioinput')

        const preferableOutputDevice = devices.find(
            (device) => device.deviceId === parsed.audioOutput && device.kind === 'audiooutput')

        const outputDefaultDevice = devices.find(
            (device) => device.deviceId === 'default' && device.kind === 'audiooutput')

        inputMediaDeviceValue.value =  preferableInputDevice?.deviceId || inputDefaultDevice?.deviceId || ''

        outputMediaDeviceValue.value = preferableOutputDevice?.deviceId || outputDefaultDevice?.deviceId || ''

    } catch (e) {
        console.error(e)
    }
}

const setDefaultData = async () => {
    try {
        await setDefaultMediaDevices()
        await onDeviceChangeHandler()
    } catch (e) {
        console.error('Error setting default media devices:', e)
    }
}
/* Created */
setDefaultData().then()
navigator.mediaDevices.addEventListener(
    'devicechange',
    onDeviceChangeHandler
)

