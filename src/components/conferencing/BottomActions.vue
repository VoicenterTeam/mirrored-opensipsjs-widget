<template>
    <div class="h-[60px] bg-light-bg shadow-lg w-full border-t border-field-borders">
        <div
            v-if="conferenceStarted"
            class="flex h-full w-full justify-between overflow-x-auto"
        >
            <div class="flex w-56 p-2 items-center">
                <img
                    style="width: 150px; height: auto;"
                    :src="bgLogoBase64"
                >
            </div>
            <div class="flex items-center">
                <RoundButton
                    icon="vc-icon-mic"
                    active-icon="vc-icon-mic-off"
                    color="primary"
                    class="mr-2"
                    :active="!microphoneOnModel"
                    @click="enableMicrophone"
                />
                <RoundButton
                    icon="vc-icon-camera"
                    active-icon="vc-icon-camera-off"
                    color="primary"
                    class="mr-2"
                    :active="!videoOnModel"
                    @click="enableCamera"
                />
                <RoundButton
                    icon="vc-icon-phone-down"
                    color="destructive-actions"
                    class="mr-2"
                    @click="hangupMeeting"
                />

                <div v-if="isScreenSharing && !isPresentationWhiteboardEnabled && !isImageWhiteboardEnabled">
                    <RoundButton
                        v-if="!isScreenShareWhiteboardEnabled"
                        icon="vc-icon-edit-pencil"
                        color="primary"
                        class="mr-2"
                        @click="enableScreenShareWhiteboard"
                    />
                    <RoundButton
                        v-else
                        icon="vc-icon-recycle-bin"
                        color="destructive-actions"
                        class="mr-2"
                        @click="terminateScreenShareWhiteboard"
                    />
                </div>

                <div>
                    <RoundButton
                        v-if="!isScreenSharing && !isImageWhiteboardEnabled && !isPresentationWhiteboardEnabled"
                        icon="vc-icon-edit-pencil"
                        color="primary"
                        class="mr-2"
                        @click="whiteboardModalOpen = true"
                    />
                    <RoundButton
                        v-if="!isScreenSharing && isImageWhiteboardEnabled"
                        icon="vc-icon-recycle-bin"
                        color="destructive-actions"
                        class="mr-2"
                        @click="terminateImageWhiteboard"
                    />
                    <RoundButton
                        v-if="!isScreenSharing && isPresentationWhiteboardEnabled"
                        icon="vc-icon-recycle-bin"
                        color="destructive-actions"
                        class="mr-2"
                        @click="terminatePresentationWhiteboard"
                    />
                </div>


                <div class="mx-1">
                    <DrawerOptions
                        v-if="isScreenShareWhiteboardEnabled || isImageWhiteboardEnabled || isPresentationWhiteboardEnabled"
                        :is-extended-options="isPresentationWhiteboardEnabled"
                        :is-screen-share-whiteboard-enabled="isScreenShareWhiteboardEnabled"
                    />
                </div>

                <div class="mx-1">
                    <MaskVisualizationOptions
                        v-if="isWithBokehMaskEffect"
                        :setup-visualization-config="setupMaskVisualizationConfig"
                    />
                </div>
            </div>

            <div class="flex items-center">
                <RoundButton
                    v-if="!isMobile"
                    icon="vc-icon-open"
                    active-icon="vc-icon-close"
                    color="primary"
                    :active="isScreenSharing"
                    class="mr-2"
                    @click="enableScreenShare(!isScreenSharing)"
                />
                <RoundButton
                    icon="vc-icon-settings"
                    color="primary"
                    class="mr-2"
                    @click="settingsModalOpen = true"
                />
            </div>
        </div>

        <SettingsModal v-model:modalVisible="settingsModalOpen" />
        <WhiteboardOptionsModal v-model:modalVisible="whiteboardModalOpen" />
        <MaskOptionsModal v-model:modalVisible="maskOptionsModalOpen" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VcForm, VcFormItem, VcButton, VcInput } from '@voicenter-team/voicenter-ui-plus'
import useDeviceType from '@/composables/useDeviceType'
import SettingsModal from '@/components/conferencing/SettingsModal.vue'
import WhiteboardOptionsModal from '@/components/conferencing/WhiteboardOptionsModal.vue'
import RoundButton from '@/components/conferencing/RoundButton.vue'
import DrawerOptions from '@/components/conferencing/DrawerOptions.vue'
import MaskOptionsModal from '@/components/conferencing/MaskOptionsModal.vue'
import MaskVisualizationOptions from '@/components/conferencing/MaskVisualizationOptions.vue'
import { bgLogoBase64 } from '@/composables/useWidgetConfig'

import {
    conferenceStarted,
    mainSource,
    microphoneOnModel,
    videoOnModel,
    isScreenSharing,
    isImageWhiteboardEnabled,
    isPresentationWhiteboardEnabled,
    isScreenShareWhiteboardEnabled,
    isWithBokehMaskEffect,
    isWithBgImgMaskEffect,
    useOpenSIPSJS
} from '@/composables/opensipsjs'

const {
    hangupVideoCall,
    enableAudio,
    disableAudio,
    enableVideo,
    disableVideo,
    enableScreenShare,
    enableScreenShareWhiteboard,
    terminateScreenShareWhiteboard,
    terminateImageWhiteboard,
    terminatePresentationWhiteboard,
    setupMaskVisualizationConfig
} = useOpenSIPSJS()

const { isMobile } = useDeviceType()

/* Emit */
export interface Emit {
    (e: 'hangup'): void
}

const emit = defineEmits<Emit>()

/* Data */
const settingsModalOpen = ref(false)
const whiteboardModalOpen = ref(false)
const maskOptionsModalOpen = ref(false)

/* Methods */
const hangupMeeting = () => {
    hangupVideoCall()
}

function enableMicrophone () {
    if (microphoneOnModel.value) {
        disableAudio()
    } else {
        enableAudio()
    }
}

function enableCamera () {
    if (videoOnModel.value) {
        disableVideo()
    } else {
        enableVideo()
    }
}

const toggleMaskEffect = () => {
    if (isWithBokehMaskEffect.value || isWithBgImgMaskEffect.value) {
        //disableMaskEffect()
    } else {
        maskOptionsModalOpen.value = true
    }
}
</script>

<style scoped>

</style>
