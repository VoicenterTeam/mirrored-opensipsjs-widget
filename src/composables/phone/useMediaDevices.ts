import { computed, watch } from 'vue'
import { useOpenSIPSJS } from '@/composables/opensipsjs'

const { state, getAudioState, getAudioApi } = useOpenSIPSJS()

/* Types */

export type MediaDevicesList = {
    inputMediaDevicesList: Array<MediaDeviceInfo>
    outputMediaDevicesList: Array<MediaDeviceInfo>
}

const { activeInputDevice, inputDevicesList, activeOutputDevice, outputDevicesList } = getAudioState()

export const getMediaDevicesList = computed(() => {
    return {
        inputMediaDevicesList: (inputDevicesList.value || []) as Array<MediaDeviceInfo>,
        outputMediaDevicesList: (outputDevicesList.value || []) as Array<MediaDeviceInfo>
    }
})

export const outputMediaDeviceValue = activeOutputDevice
export const inputMediaDeviceValue = activeInputDevice

async function onDeviceChangeHandler () {
    if (!state.opensipsjs) return

    const { onMicrophoneChange, onSpeakerChange } = getAudioApi()
    
    const currentInputDevice = activeInputDevice.value
    if (currentInputDevice && currentInputDevice !== 'default') {
        const inputDeviceExists = inputDevicesList.value?.some(device => 
            device.deviceId === currentInputDevice
        )
        
        if (!inputDeviceExists) {
            const event = { target: { value: 'default' } } as Event & { target: HTMLSelectElement }
            await onMicrophoneChange(event)
        }
    }

    const currentOutputDevice = activeOutputDevice.value
    if (currentOutputDevice && currentOutputDevice !== 'default') {
        const outputDeviceExists = outputDevicesList.value?.some(device => 
            device.deviceId === currentOutputDevice
        )
        
        if (!outputDeviceExists) {
            const event = { target: { value: 'default' } } as Event & { target: HTMLSelectElement }
            await onSpeakerChange(event)
        }
    }
}

watch([inputDevicesList, outputDevicesList], () => {
    onDeviceChangeHandler().catch(err => {
        console.error('Error handling device change:', err)
    })
}, { deep: true })

watch(activeOutputDevice, (value) => {
    if (!value) return
    
    const preferablePhoneDevices = localStorage.getItem('preferablePhoneDevices')
    const parsed = preferablePhoneDevices ? JSON.parse(preferablePhoneDevices) : {}

    const selectedPreferableDevices = {
        audioInput: parsed.audioInput,
        audioOutput: value,
    }

    localStorage.setItem('preferablePhoneDevices', JSON.stringify(selectedPreferableDevices))
})

watch(activeInputDevice, (value) => {
    if (!value) return
    
    const preferablePhoneDevices = localStorage.getItem('preferablePhoneDevices')
    const parsed = preferablePhoneDevices ? JSON.parse(preferablePhoneDevices) : {}

    const selectedPreferableDevices = {
        audioInput: value,
        audioOutput: parsed.audioOutput,
    }

    localStorage.setItem('preferablePhoneDevices', JSON.stringify(selectedPreferableDevices))
})

export async function setDefaultMediaDevices () {
    try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('getUserMedia() not supported')
        }

        if (!state.opensipsjs) return

        const { onMicrophoneChange, onSpeakerChange } = getAudioApi()

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

        const inputDeviceId = preferableInputDevice?.deviceId || inputDefaultDevice?.deviceId || 'default'
        const outputDeviceId = preferableOutputDevice?.deviceId || outputDefaultDevice?.deviceId || 'default'

        const inputEvent = { target: { value: inputDeviceId } } as Event & { target: HTMLSelectElement }
        const outputEvent = { target: { value: outputDeviceId } } as Event & { target: HTMLSelectElement }
        
        await onMicrophoneChange(inputEvent)
        await onSpeakerChange(outputEvent)

    } catch (e) {
        console.error('Error setting default media devices:', e)
    }
}
