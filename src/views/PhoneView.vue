<template>
    <div
        class="main-wrapper relative"
        :class="{ 'has-draggable': showDraggableHandle }"
        :style="{ ...dynamicStyle }"
    >
        <Draggable
            v-show="showDraggableHandle"
            ref="draggableHandle"
            class="draggable"
        />
        <div class="phone-view-wrapper">
            <component :is="phoneUI" />
            <OfflineWrapper />
            <IncomingCalls v-if="visibleCalls.length" />
        </div>
    </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import type { IRoom, ICall } from '@voicenter-team/opensips-js/src/types/rtc'
import { allRooms } from '@/composables/opensipsjs'
import OfflineWrapper from '@/components/phone/common/OfflineWrapper.vue'
import NoActiveCallsView from '@/components/phone/NoActiveCallsView.vue'
import ActiveCallsWithKeypadView from '@/components/phone/ActiveCallsWithKeypadView.vue'
import ActiveCallsWithActionButtonsView from '@/components/phone/ActiveCallsWithActionButtonsView.vue'
import { currentActiveRoom, activeCalls, allActiveCalls } from '@/composables/opensipsjs'
import { useVsipProvide } from '@/composables/phone/useVsipProvideInject.ts'
import { GenericObjectType, CallUserDataType } from '@/types/phone'
import { usePhoneState } from '@/composables/phone/usePhoneState.ts'
import { KeyPadTriggerObjectType } from '@/constants/phone.ts'
import IncomingCalls from '@/components/phone/incomingCalls/IncomingCalls.vue'
import { useIncomingCalls } from '@/composables/phone/useIncomingCalls.ts'
import Draggable from '@/components/Draggable.vue'
import { showDraggableHandle } from '@/composables/useWidgetConfig'

/* Emit */
const emit = defineEmits<{
    (event: 'ready', value: HTMLElement | undefined): void
}>()

/* Data */
const phoneUIConfig = {
    mainUI: NoActiveCallsView,
    callsWithActionButtons: ActiveCallsWithActionButtonsView,
    callsWithKeyPad: ActiveCallsWithKeypadView
}

const draggableHandle = ref<typeof Draggable>()
const { visibleCalls } = useIncomingCalls()
const callersData = ref<GenericObjectType<CallUserDataType>>({})
const { keyPadTrigger, onKeyPadToggle } = usePhoneState()

/* Watchers */
watch(
    activeCalls,
    (calls) => {

        // Add new caller data for new calls
        for (const id in calls) {
            if (!callersData.value[id]) {
                callersData.value[id] = createCallerData(calls[id])
            }
        }

        // // Remove caller data for ended calls
        for (const id in callersData.value) {
            if (!(id in calls)) {
                delete callersData.value[id]
            }
        }

    },
    {
        immediate: true,
        deep: true
    }
)
watch(currentActiveRoom, () => {
    const isKeyPadTriggered = keyPadTrigger.value === KeyPadTriggerObjectType.keypad ||
        keyPadTrigger.value === KeyPadTriggerObjectType.add_caller

    if (!currentActiveRoom.value && isKeyPadTriggered) {
        onKeyPadToggle(undefined)
    }
})

const getPercentage = (lightValue: number, darkValue: number) => {
    // return isDark.value ? darkValue : lightValue
    return lightValue
}
function getActiveCallsInRoom (roomId: number): Array<ICall> {
    const activeCallsArr = Object.values(activeCalls.value)
    return activeCallsArr.filter((call: ICall) => call.roomId === roomId)
}

const dynamicStyle = computed(() => {
    return {
        '--dynamic-percentage-10': `${getPercentage(10, 40)}%`,
        '--dynamic-percentage-10-hover': `${getPercentage(20, 50)}%`,
        '--dynamic-percentage-5': `${getPercentage(5, 30)}%`,
        '--dynamic-percentage-5-hover': `${getPercentage(10, 40)}%`
    }
})
/* Computed */
const phoneUI = computed(() => {
    if(!activeRoomsWithoutIncoming.value.length) {
        return phoneUIConfig.mainUI
    } else if(activeRoomsWithoutIncoming.value && keyPadTrigger.value || activeRoomsWithoutIncoming.value && !currentActiveRoom.value) {
        return  phoneUIConfig.callsWithKeyPad
    }
    return phoneUIConfig.callsWithActionButtons
})

const activeRoomsWithoutIncoming = computed(() => {
    const activeRooms: Array<IRoom> = Object.values(allRooms.value)
    return activeRooms.filter((room) => {
        return !room.incomingInProgress
    })
})
const roomsWithoutActive = computed(() => {
    return activeRoomsWithoutIncoming.value.filter((room) => {
        return room.roomId !== currentActiveRoom.value
    })
})
const callsInActiveRoom = computed(() => {
    return allActiveCalls.value.filter((call) => {
        return call.roomId === currentActiveRoom.value
    })
})

const callsExceptIncoming = computed(() => {
    const activeRoomIds = activeRoomsWithoutIncoming.value.map(room => room.roomId)
    const allActiveCalls = Object.values(activeCalls.value)
    return allActiveCalls.filter(call => call.roomId && activeRoomIds.includes(call.roomId))
})
const lengthOfCallsWithoutIncoming = computed(() => {
    return callsExceptIncoming.value.length
})

/* Methods */
const createCallerData = (call: ICall) => {
    const callerNumber = call._remote_identity._uri._user
    const callerName = call._remote_identity._display_name

    return {
        userName: callerName,
        userPhone: callerNumber,
    }
}
/* Provide */
useVsipProvide({
    callsInActiveRoom,
    activeRoomsWithoutIncoming,
    lengthOfCallsWithoutIncoming,
    callersData,
    roomsWithoutActive,
    getActiveCallsInRoom
})

/* Hooks */
onMounted(() => {
    const draggableRoot = draggableHandle.value?.root as HTMLElement | undefined

    emit('ready', draggableRoot)
})
</script>
<style lang="scss" scoped>
.main-wrapper {
  height: 100%;
  min-height: 400px;
  min-width: 300px;
    @apply bg-primary-bg;

    &.has-draggable {
        @apply flex;

        .phone-view-wrapper {
            @apply pl-2;
        }
    }

    .phone-view-wrapper {
        @apply w-full relative;
    }
}
</style>
