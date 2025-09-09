<template>
    <VcModal
        :visible="modalVisibleModel"
        :header="getTranslation('video.device.settings')"
        :breakpoints="{
            '960px': '80vw', '680px': '95vw'
        }"
        width="50vw"
        append-to="self"
        @close="closeModal"
    >
        <VcForm
            ref="formRef"
            :model="settingsModel"
        >
            <VcFormItem
                :label="getTranslation('video.microphone')"
                prop="audioInput"
                :rules="[required]"
            >
                <VcSelect
                    v-model="settingsModel.audioInput"
                    :teleported="false"
                    :options="microphoneList"
                    :config="mediaDeviceSelectorConfig"
                />
            </VcFormItem>
            <VcFormItem
                :label="getTranslation('video.speakers')"
                prop="audioOutput"
                :rules="[required]"
            >
                <VcSelect
                    v-model="settingsModel.audioOutput"
                    :teleported="false"
                    :options="speakerList"
                    :config="mediaDeviceSelectorConfig"
                />
            </VcFormItem>
            <VcFormItem
                :label="getTranslation('video.camera')"
                prop="videoInput"
                :rules="[required]"
            >
                <VcSelect
                    v-model="settingsModel.videoInput"
                    :teleported="false"
                    :options="cameraList"
                    :config="mediaDeviceSelectorConfig"
                />
            </VcFormItem>
        </VcForm>

        <template #footer>
            <div class="flex justify-between w-full">
                <VcButton @click="submitModal">
                    {{ getTranslation('common.submit') }}
                </VcButton>
                <VcButton
                    color="secondary"
                    @click="closeModal"
                >
                    {{ getTranslation('common.close') }}
                </VcButton>
            </div>
        </template>
    </VcModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useVModel } from '@vueuse/core'
import { VcForm, VcFormItem, VcButton, VcModal } from '@voicenter-team/voicenter-ui-plus'
import useValidationRules from '@/composables/useValidationRules.ts'
import { useOpenSIPSJS } from '@/composables/opensipsjs.ts'
import { getTranslation } from '@/plugins/translator'

const { changeMediaConstraints } = useOpenSIPSJS()

/* Types */
interface SettingsModel {
    audioInput: string
    audioOutput: string
    videoInput: string
}

/* Composables */
const { required } = useValidationRules()

/* Props */
export interface Props {
    modalVisible?: boolean
}

const props = withDefaults(
    defineProps<Props>(),
    {
        modalVisible: false
    }
)

/* Emit */
export interface Emit {
    (e: 'update:modalVisible', payload: boolean): void
}

const emit = defineEmits<Emit>()

/* Data */
const formRef = ref<typeof VcForm>()
const modalVisibleModel = useVModel(props, 'modalVisible', emit)
const mediaDeviceSelectorConfig = {
    labelKey: 'label',
    valueKey: 'deviceId'
}
const settingsModel = ref<SettingsModel>({
    audioInput: 'default',
    audioOutput: 'default',
    videoInput: 'default'
})
const cameraList = ref<Array<MediaDeviceInfo>>([])
const speakerList = ref<Array<MediaDeviceInfo>>([])
const microphoneList = ref<Array<MediaDeviceInfo>>([])
// const videoInput = ref<MediaDeviceInfo | undefined>()

/* Methods */
async function changeAudioOutput (element: HTMLVideoElement, deviceId: string) {
    if (!element || !deviceId) {
        return
    }

    if (typeof element.sinkId !== 'undefined') {
        try {
            await element.setSinkId(deviceId)
            console.log(`Success, audio output device attached: ${deviceId}`)
        } catch (error: unknown) {
            let errorMessage = error
            if (error?.name === 'SecurityError') {
                errorMessage = `You need to use HTTPS for selecting audio output device: ${error}`
            }
            console.error(errorMessage)
        }
    } else {
        console.warn('Browser does not support output device selection.')
    }
}

async function submitModal () {
    const inputsChanged = settingsModel.value.audioInput !== 'default' || settingsModel.value.videoInput !== 'default'

    const selectedDevices = {
        videoInput: settingsModel.value.videoInput,
        audioInput: settingsModel.value.audioInput,
        audioOutput: settingsModel.value.audioOutput,
    }

    localStorage.setItem('selectedDevices', JSON.stringify(selectedDevices))

    if (!inputsChanged) {
        modalVisibleModel.value = false

        return
    }

    const constraints = {
        audio: selectedDevices.audioInput,
        video: selectedDevices.videoInput,
    }

    changeMediaConstraints(constraints)

    setTimeout(() => {
        const rootDocument = document.querySelector('opensips-widget')
        const shadowRootDocument = rootDocument?.shadowRoot
        const videoElements = shadowRootDocument?.querySelectorAll('video')

        if (settingsModel.value.audioOutput && videoElements?.length) {
            videoElements.forEach((element) => {
                changeAudioOutput(element, settingsModel.value.audioOutput)
            })
        }
    }, 2000)

    modalVisibleModel.value = false
}
function closeModal () {
    resetValidate()

    modalVisibleModel.value = false
}
function resetValidate () {
    if (formRef.value) {
        formRef.value.resetFields()
    }
}
async function setMediaDevices () {
    const devices = await navigator.mediaDevices.enumerateDevices()

    speakerList.value = devices.filter(d => d.kind === 'audiooutput')
    microphoneList.value = devices.filter(d => d.kind === 'audioinput')
    cameraList.value = devices.filter(d => d.kind === 'videoinput')

    const selectedDevices = localStorage.getItem('selectedDevices')
    const parsed = JSON.parse(selectedDevices || '{}')

    const audioInput = parsed.audioInput || 'default'
    const audioOutput = parsed.audioOutput || 'default'
    let videoInput = parsed.videoInput // || cameraList.value[0].deviceId

    //const audioInput = 'default'
    //const audioOutput = 'default'

    if (!videoInput) {
        videoInput = cameraList.value[0] ? cameraList.value[0].deviceId : undefined
    }
    //const videoInput = cameraList.value[0] ? cameraList.value[0].deviceId : undefined

    if (speakerList.value.find((d) => d.deviceId === audioOutput)) {
        settingsModel.value.audioOutput = audioOutput
    } else {
        settingsModel.value.audioOutput = 'default'
    }

    if (microphoneList.value.find((d) => d.deviceId === audioInput)) {
        settingsModel.value.audioInput = audioInput
    } else {
        settingsModel.value.audioInput = 'default'
    }

    if (cameraList.value.find((d) => d.deviceId === videoInput)) {
        settingsModel.value.videoInput = videoInput
    }

    /*setTimeout(async () => {
        await changePublisherStream(
            settingsModel.value.audioInput,
            settingsModel.value.videoInput,
        )

        const videoElements = document.querySelectorAll('video')
        if (settingsModel.value.audioOutput && videoElements.length) {
            videoElements.forEach(element => {
                DeviceManager.changeAudioOutput(element, 'default')
            })

            await nextTick(() => {
                videoElements.forEach(element => {
                    DeviceManager.changeAudioOutput(element, settingsModel.value.audioOutput)
                })
            })
        }
    }, 1000)*/
}
function setListeners () {
    navigator.mediaDevices.addEventListener('devicechange', setMediaDevices)
}

/* Created */
setMediaDevices()
setListeners()
</script>
