<template>
    <div
        class="h-full"
        :style="{width: `${elementWidth}px`}"
    >
        <div class="w-full h-[90%] flex max-w-[874px] overflow-x-hidden">
            <div class="main-participant_wrapper">
                <MainSource v-if="mainSource" />
            </div>
            <div class="other-participants">
                <div
                    v-for="source in sourcesExceptMain"
                    :key="source.id"
                    class="mr-2 ml-2 mb-2 relative border-2 border-default-text rounded cursor-pointer"
                    @click="selectParticipant(source)"
                >
                    <video
                        :id="source.id"
                        :srcObject.prop="source.stream"
                        :controls="false"
                        :muted="source.type === 'publisher'"
                        :volume="source.type === 'publisher' ? 0: 0.9"
                        :width="videoWidth"
                        height="150"
                        autoplay
                        playsinline
                        webkit-playsinline
                    />

                    <div class="participant-name">
                        {{ source.name || 'name' }}
                    </div>
                </div>
            </div>
        </div>

        <div class="w-full h-[10%]">
            <BottomActions
                v-if="isMainSource"
                @hangup="onHangup"
            />
            <!--            <button
                class="mr-4"
                @click="onJoinRoom"
            >
                Join
            </button>

            <button
                class="mr-4"
                @click="enableScreenShare"
            >
                Start Screen Share
            </button>

            <button
                v-if=""
                class="mr-4"
                @click="enablePresentationWhiteboard"
            >
                Start Whiteboard
            </button>-->
        </div>
    </div>
</template>

<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { ref, watch, computed, type UnwrapRef } from 'vue'
import {
    useOpenSIPSJS
} from '@/composables/opensipsjs.ts'
import MainSource from '@/components/conferencing/MainSource.vue'
import BottomActions from '@/components/conferencing/BottomActions.vue'
import type { ICall } from 'opensips-js/src/types/rtc'

const { getVideoState, getVideoApi } = useOpenSIPSJS()

const {
    conferenceStarted,
    sourcesExceptMain,
    mainSource,
    isImageWhiteboardEnabled,
    isPresentationWhiteboardEnabled,
    isScreenShareWhiteboardEnabled,
    isWhiteboardEnabled,
} = getVideoState()
const { initVideoCall, selectMainSource, enableScreenShare, enablePresentationWhiteboard } = getVideoApi()

const props = withDefaults(
    defineProps<{
        elementWidth: number
    }>(),
    {}
)

/* Computed */
const isMainSource = computed(() =>{
    return mainSource.value !== undefined
})

/*import NotInitializedView from '@/views/NotInitializedView.vue'
import InitializedView from '@/views/InitializedView.vue'

const isLoading = ref<boolean>(false)

watch(allCallStatuses, (statuses) => {
    if (statuses && statuses.length) {
        const isInLoadingState = statuses.some(status => status.isMerging || status.isMoving || status.isTransferring)
        isLoading.value = isInLoadingState
    } else {
        isLoading.value = false
    }
}, { deep: true })*/

const selectParticipant = (source) => {
    if (isScreenShareWhiteboardEnabled.value || isPresentationWhiteboardEnabled.value || isImageWhiteboardEnabled.value) {
        return
    }
    selectMainSource(source)
}

function onHangup () {
    console.log('onHangup')
}

</script>

<style lang="css" scoped>
.main-participant_wrapper {
  width: 80%;
  background-color: #363636;
}

.other-participants {
  @apply w-[20%] h-full overflow-y-auto pt-2;
  background-color: #363636;
}

.participant-name {
  @apply px-2 bg-secondary-bg rounded-xl text-main-text;
  position: absolute;
  bottom: 2px;
  left: 2px;
  opacity: 0.4;
  color: #000;
  max-width: 100px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
