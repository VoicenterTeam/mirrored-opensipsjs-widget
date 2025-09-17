<template>
    <div class="h-full">
        <video
            v-if="!isWhiteboardEnabled"
            id="main-video-id"
            :srcObject.prop="mainSource.stream"
            class="main-video"
            :class="{'publisher-video': mainSource.type === 'publisher' /*&& mainSource.name !== 'Screen Share'*/}"
            :controls="false"
            :muted="mainSource.type === 'publisher'"
            :volume="mainSource.type === 'publisher' ? 0: 0.9"
            autoplay
            playsinline
            webkit-playsinline
        />

        <div
            v-else-if="isScreenShareWhiteboardEnabled"
            id="screen-share-video-container"
            class="main-video flex justify-center"
        >
            <div
                id="composite-canvas-container"
                class="relative"
            >
                <canvas id="composite-canvas" />
            </div>

            <div
                id="container"
                class="flex items-center"
            />
        </div>

        <div
            v-else-if="isPresentationWhiteboardEnabled || isImageWhiteboardEnabled"
            id="presentation-video-container"
            class="main-video"
        >
            <div id="presentationCanvasWrapper" />
        </div>

        <div
            v-if="!isWhiteboardEnabled"
            class="username_wrapper"
            @click="metricsModalOpen = true"
        >
            {{ mainSource.name || mainSource.sender }}
        </div>
        <div
            class="fixed bottom-20 left-0 px-4 bg-default-text rounded-tr text-xl text-white"
        >
            {{ callDuration }}
        </div>
        <!--        <MetricsModal v-model:modalVisible="metricsModalOpen" />-->
    </div>
</template>

<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { onMounted, onBeforeUnmount, ref, computed } from 'vue'
import { useOpenSIPSJS } from '@/composables/opensipsjs'
//import useJanusPhoneKit from '@/composables/useJanusPhoneKit'
//import MetricsModal from './MetricsModal.vue'
//import { getCreatedTime } from '@/helper/create.time.helper'

//const useJanusPhoneKit = inject('useJanusPhoneKit')

const { getVideoState } = useOpenSIPSJS()

const {
    conferenceStarted,
    mainSource,
    isImageWhiteboardEnabled,
    isPresentationWhiteboardEnabled,
    isScreenShareWhiteboardEnabled,
    isWhiteboardEnabled
} = getVideoState()

/* Props */
export interface Props {
    roomId: string | undefined
}
const props = withDefaults(
    defineProps<Props>(),
    {
        roomId: undefined
    }
)

const metricsModalOpen = ref<boolean>(false)
const callDuration = ref('')
const created = ref<number | undefined>(undefined)

const participantName = computed(() => {
    return mainSource.value?.name || mainSource.value?.sender || ''
})

/* Methods */
/*const calculateTimeFromNow = () => {
    if (created.value && created.value > 0) {
        const currentTime = Date.now()
        const differenceInMilliseconds = currentTime - created.value
        const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000)

        const hours = Math.floor(differenceInSeconds / 3600)
        const minutes = Math.floor((differenceInSeconds % 3600) / 60)
        const seconds = differenceInSeconds % 60

        const formattedHours = hours.toString().padStart(2, '0')
        const formattedMinutes = minutes.toString().padStart(2, '0')
        const formattedSeconds = seconds.toString().padStart(2, '0')

        callDuration.value = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
    } else {
        callDuration.value = '00:00:00'
    }
}

const startTimer = () => {
    calculateTimeFromNow()

    const timerInterval = setInterval(() => {
        calculateTimeFromNow()
    }, 1000)

    onBeforeUnmount(() => {
        clearInterval(timerInterval)
    })
}

// TODO: temporary removed because of videoroom plugin
onMounted(async () => {
    const data = await getCreatedTime(props.roomId)
    created.value = data?.created || Date.now()
    startTimer(data.created)
})*/

</script>

<style scoped>
.main-video {
  min-width: 100%;
  height: 100%;
}
#screen-share-video-container {
  position: relative;
}
#container canvas {
  position: absolute;
  top: 0;
  left: 0;
}

#composite-canvas-container {
  margin: auto 0;
}

#composite-canvas {
  position: absolute;
  top: 0;
  left: 0;
}

#container {
  z-index: 11;
}

.username_wrapper {
  @apply absolute bottom-20 left-10 px-2 bg-secondary-bg rounded-xl text-main-text;
  opacity: 0.4;
  color: #000;
  max-width: 300px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
