<template>
    <div class="flex items-center w-full p-1">
        <div class="pr-1">
            <ActionIconButton
                :icon="call.localMuted ? 'vc-lc-mic-off': 'vc-lc-mic'"
                :color="call.localMuted ? 'btn-filled-text': 'primary-actions'"
                :bg-color="call.localMuted ? 'destructive-actions': 'primary-actions-bg--focus'"
                rounded
                @click="doMuteCaller"
            />
        </div>

        <div
            class="flex text-xs text-main-text font-medium"
            style="width: 190px; max-width: 190px; min-width: 190px;"
        >
            <div
                v-if="displayCallerInfoName && displayName"
                class="w-1/2 max-w-1/2 truncate"
            >
                {{ displayName }}
            </div>
            <div
                v-if="displayCallerInfoId && displayNumber"
                class="w-1/2 truncate"
            >
                {{ displayNumber }}
            </div>
        </div>

        <div
            v-if="!isOutgoingUnanswered"
            class="mx-2 w-[46px] text-xs text-main-text"
        >
            {{ callTime }}
        </div>
        <div
            v-else
            class="w-full text-sm px-2"
        >
            {{ getTranslation('audio.calling.in.progress') }}
        </div>

        <CallOptionsButton
            v-if="!isOutgoingUnanswered"
            :call="call"
            :is-on-local-hold="isOnLocalHold"
            @hold="putOnHold"
            @unhold="unHoldCall"
            @move="onMoveClick"
            @transfer="onTransferClick"
        />

        <div
            v-if="showAddCallerButton"
            class="ml-1"
        >
            <AddCallerButton @toggle-keypad="onToggleAddCallerKeypad" />
        </div>

        <div
            v-if="showSwitchRoomButton"
            class="ml-1"
        >
            <RoomActionButton
                icon="vc-lc-arrow-right-left"
                :label="getTranslation('audio.room.switch').toUpperCase()"
                @click="onSwitchRoomButtonClick"
            />
        </div>

        <div
            v-if="showHangupButton"
            class="pl-1"
        >
            <ActionIconButton
                icon="vc-icon-phone-down"
                color="white"
                bg-color="destructive-actions"
                rounded
                @click="onHangupCall"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import type { UnwrapRef } from 'vue'
import type { ICall } from 'opensips-js/src/types/rtc'
import { useOpenSIPSJS, callTimes, allRooms, allActiveCalls } from '@/composables/opensipsjs'
import useCallInfo from '@/composables/useCallInfo'
import { getFormattedTimeFromSeconds } from '@/helpers/timeHelper'
import { displayCallerInfoId, displayCallerInfoName } from '@/composables/useWidgetConfig'
import RoomActionButton from '@/components/base/RoomActionButton.vue'
import AddCallerButton from '@/components/AddCallerButton.vue'
import ActionIconButton from '@/components/base/ActionIconButton.vue'
import CallOptionsButton from '@/components/CallOptionsButton.vue'
import { getTranslation } from '@/plugins/translator.ts'

const props = withDefaults(
    defineProps<{
        call: UnwrapRef<ICall>
        isFirstCaller: boolean
        isSingleCall: boolean
        isSingleRoom: boolean
    }>(),
    {}
)

/* Composables */
const { terminateCall, holdCall, unholdCall, muteCaller } = useOpenSIPSJS()
const { displayNumber, displayName } = useCallInfo(props.call)

const emit = defineEmits<{
    (e: 'transfer-click', callId: string): void
    (e: 'move-click', callId: string): void
    (e: 'terminate-call'): void
    (e: 'open-room-list'): void
    (e: 'toggle-keypad', callId: string): void
}>()

const isOnLocalHold = ref<boolean>(false)

const isOutgoingUnanswered = computed(() => {
    return props.call.direction === 'outgoing' && !props.call._is_confirmed && !props.call._is_canceled
})

const isMultiCallMode = computed(() => {
    return !props.isSingleCall || !props.isSingleRoom
})

const showAddCallerButton = computed(() => {
    return allActiveCalls.value.length === 1
})

const showHangupButton = computed(() => {
    return allActiveCalls.value.length !== 1
})

const showSwitchRoomButton = computed(() => {
    return allActiveCalls.value.length === 1 && allRooms.value.length > 1
})

const callTime = computed(() => {
    const time = callTimes.value[props.call._id]
    return getFormattedTimeFromSeconds(time)
})

function onToggleAddCallerKeypad () {
    emit('toggle-keypad', props.call._id)
}

function onSwitchRoomButtonClick () {
    emit('open-room-list')
}

function onHangupCall () {
    terminateCall(props.call._id)
    emit('terminate-call')
}

const putOnHold = () => {
    holdCall(props.call._id)
    isOnLocalHold.value = true
}

const unHoldCall = () => {
    unholdCall(props.call._id)
    isOnLocalHold.value = false
}

const doMuteCaller = () => {
    muteCaller(props.call._id, !props.call.localMuted)
}

const onTransferClick = () => {
    emit('transfer-click', props.call._id)
}

const onMoveClick = () => {
    emit('move-click', props.call._id)
}

onMounted(() => {
    if (props.call) {
        isOnLocalHold.value = props.call.isOnHold().local
    }
})

</script>

<style scoped>

</style>
