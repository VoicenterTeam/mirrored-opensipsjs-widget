<template>
    <div className="flex justify-around items-center">
        <div className="flex items-center justify-center px-2 text-xxs">
            <span className="text-center font-bold text-secondary-text uppercase">
                Move
            </span>
            <div className="flex items-center flex-col justify-evenly px-2">
                <span v-if="displayCallerInfoName" className="text-main-text font-medium">
                    {{ movingCallerName }}
                </span>
                <span v-if="displayCallerInfoId" className="text-main-text font-medium">
                    {{ movingCallerNumber }}
                </span>
            </div>
            <span className="text-center font-bold text-secondary-text uppercase">
                to
            </span>
        </div>

        <div className="px-2">
            <!--            <BaseInput v-model="target" />-->
            <select id="callerToMoveToEl" v-model="target">
                <option v-for="(item, key) in roomsList" :key="key" :value="item.roomId">
                    {{ item.roomId }}
                </option>
            </select>
        </div>

        <div className="flex p-1">
            <div className="rounded-l overflow-hidden mr-[2px]">
                <WidgetIconButton
                    color="success"
                    hover-color="additional-success-bg"
                    :icon="CheckmarkIcon"
                    size="lg"
                    @click="doMove" />
            </div>
            <div className="rounded-r overflow-hidden">
                <WidgetIconButton
                    color="danger"
                    hover-color="additional-danger-bg"
                    :icon="CloseIcon"
                    size="lg"
                    additional-classes=""
                    @click="cancelMoving" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import CheckmarkIcon from '@/assets/icons/checkmark.svg?component'
import CloseIcon from '@/assets/icons/close.svg?component'
import WidgetIconButton from '@/components/base/WidgetIconButton.vue'
import type { ICall } from '@voicenter-team/opensips-js/src/types/rtc'
import { allActiveCalls, allRooms } from '@/composables/opensipsjs'
import { getCallerInfo, getCallerNumber } from '@/helpers/callerHelper'
import {
    displayCallerInfoId,
    displayCallerInfoIdMask,
    displayCallerInfoName
} from '@/composables/useCallSettingsPermissions'
import type { IRoom } from '@voicenter-team/opensips-js/src/types/rtc'

const target = ref<string | undefined>(undefined)

const props = withDefaults(
    defineProps<{
        callId: string
    }>(),
    {}
)

const emit = defineEmits<{
    (e: 'move', callId: string, roomId: number): void
    (e: 'cancel'): void
}>()

const movingCall = computed(() => {
    return allActiveCalls.value.find((call: ICall) => {
        return call._id === props.callId
    })
})

/*const movingCallerPhone = computed(() => {
    const cNumber = movingCall.value?._remote_identity._uri._user as string
    const cName = movingCall.value?._remote_identity._display_name as string
    return getCallerInfo(cNumber, cName, displayCallerInfoName.value, displayCallerInfoIdMask.value)
})*/

const movingCallerNumber = computed(() => {
    const cNumber = movingCall.value?._remote_identity._uri._user as string
    // const cName = props.call?._remote_identity._display_name as string
    // return getCallerInfo(cNumber, cName, displayCallerInfoName.value, displayCallerInfoIdMask.value)
    return getCallerNumber(cNumber, displayCallerInfoIdMask.value)
})

const movingCallerName = computed(() => {
    // const cNumber = props.call?._remote_identity._uri._user as string
    const cName = movingCall.value?._remote_identity._display_name || '' as string
    // return getCallerInfo(cNumber, cName, displayCallerInfoName.value, displayCallerInfoIdMask.value)
    return cName
})

const roomsList = computed(() => {
    if (!movingCall.value) return

    //const rooms: Array<IRoom> = Object.values(allRooms.value)
    const filteredRooms = allRooms.value.filter(room => room.roomId !== movingCall.value?.roomId)
    return filteredRooms
})

const doMove = () => {
    if (!target.value) {
        return
    }
    emit('move', props.callId, Number(target.value))
}

const cancelMoving = () => {
    emit('cancel')
}

</script>

<style scoped>

</style>
