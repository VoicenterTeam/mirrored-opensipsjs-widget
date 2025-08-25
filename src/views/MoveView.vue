<template>
    <div class="p-1">
        <div class="flex items-center mb-1">
            <div>
                <ActionIconButton
                    icon="vc-lc-arrow-left"
                    color="primary-actions"
                    bg-color="inactive-elements-bg--focus"
                    size="sm"
                    rounded
                    @click="cancelMoving"
                />
            </div>
            <div class="w-full ml-2">
                <div class="text-xs text-inactive-text font-semibold">
                    {{ getTranslation('audio.move').toUpperCase() }}
                </div>
                <div
                    class="flex text-sm text-main-text font-medium"
                    style="width: 300px; max-width: 300px;"
                >
                    <span
                        v-if="displayCallerInfoName && movingCallerName"
                        class="w-1/2 max-w-1/2 truncate"
                    >
                        {{ movingCallerName }}
                    </span>
                    <span
                        v-if="displayCallerInfoId && movingCallerNumber"
                        class="w-1/2 max-w-1/2 truncate"
                    >
                        {{ movingCallerNumber }}
                    </span>
                </div>
            </div>
        </div>

        <div class="flex w-full">
            <div
                style="width: 140px;"
                class="room-select_wrapper"
            >
                <!--        <InputOutgoingCall
            v-model="target"
            bg-color=""
            @call="doTransfer"
            @close="clearTargetInput"
        />-->
                <VcSelect
                    v-model="target"
                    :teleported="false"
                    placement="top"
                    class="static"
                    :options="roomsList"
                    :config="{ labelKey: 'label', valueKey: 'value' }"
                    placeholder="Select Room"
                />

                <!--                <select
                    id="callerToMoveToEl"
                    v-model="target"
                    placeholder="Select"
                >
                    <option
                        v-for="(item, key) in roomsList"
                        :key="key"
                        :value="item.value"
                    >
                        {{ item.label }}
                    </option>
                </select>-->
            </div>
            <div class="ml-1">
                <ActionIconButton
                    icon="vc-lc-arrow-down-up"
                    bg-color="primary-actions-bg--focus"
                    color="primary"
                    @click="doMove"
                />
            </div>
        </div>
    </div>
<!--    <div className="flex justify-around items-center bg-primary-bg">
        <div className="flex items-center justify-center px-2 text-xxs">
            <span className="text-center font-bold text-secondary-text uppercase">
                {{ getTranslation('audio.move') }}
            </span>
            <div className="flex items-center flex-col justify-evenly px-2">
                <span
                    v-if="displayCallerInfoName"
                    className="text-main-text font-medium"
                >
                    {{ movingCallerName }}
                </span>
                <span
                    v-if="displayCallerInfoId"
                    className="text-main-text font-medium"
                >
                    {{ movingCallerNumber }}
                </span>
            </div>
            <span className="text-center font-bold text-secondary-text uppercase">
                {{ getTranslation('audio.to') }}
            </span>
        </div>

        <div className="px-2">
            &lt;!&ndash;            <BaseInput v-model="target" />&ndash;&gt;
            <select
                id="callerToMoveToEl"
                v-model="target"
            >
                <option
                    v-for="(item, key) in roomsList"
                    :key="key"
                    :value="item.roomId"
                >
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
                    @click="doMove"
                />
            </div>
            <div className="rounded-r overflow-hidden">
                <WidgetIconButton
                    color="danger"
                    hover-color="additional-danger-bg"
                    :icon="CloseIcon"
                    size="lg"
                    additional-classes=""
                    @click="cancelMoving"
                />
            </div>
        </div>
    </div>-->
</template>

<script lang="ts" setup>
import { ref, computed, unref } from 'vue'
import CheckmarkIcon from '@/assets/icons/checkmark.svg?component'
import CloseIcon from '@/assets/icons/close2.svg?component'
import WidgetIconButton from '@/components/base/WidgetIconButton.vue'
import type { ICall } from 'opensips-js/src/types/rtc'
import { allActiveCalls, allRooms, currentActiveRoom } from '@/composables/opensipsjs'
import {
    displayCallerInfoId, displayCallerInfoIdMask,
    displayCallerInfoName
} from '@/composables/useWidgetConfig'
import useCallInfo from '@/composables/useCallInfo'
import { getTranslation } from '@/plugins/translator'
import InputOutgoingCall from '@/components/InputOutgoingCall.vue'
import ActionIconButton from '@/components/base/ActionIconButton.vue'
import { VcSelect } from '@voicenter-team/voicenter-ui-plus'
import NewCallerButton from '@/components/NewCallerButton.vue'
import { getCallerNumber } from '@/helpers/callerHelper.ts'

const target = ref<number | undefined>()

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

const { callerNumber: movingCallerNumber, callerName: movingCallerName } = useCallInfo(movingCall)

/*const movingCallerPhone = computed(() => {
    const cNumber = movingCall.value?._remote_identity._uri._user as string
    const cName = movingCall.value?._remote_identity._display_name as string
    return getCallerInfo(cNumber, cName, displayCallerInfoName.value, displayCallerInfoIdMask.value)
})*/

const roomsList = computed(() => {
    if (!movingCall.value) return

    return allRooms.value
        .filter((room) => room.roomId !== movingCall.value?.roomId)
        .map((room) => {
            const callsInRoom = allActiveCalls.value.filter((call) => call.roomId === room.roomId)

            const participantsReduced = callsInRoom.reduce((reducer, call) => {
                const { callerName, callerNumber } = useCallInfo(call)

                /*console.log('1')
                const cNumber = call._remote_identity?._uri._user || ''
                const callerNumber = cNumber //getCallerNumber(cNumber, displayCallerInfoIdMask.value)

                const callerName = call._remote_identity?._display_name || ''

                console.log('2')
                console.log('callerName', callerName)
                console.log('callerNumber', callerNumber)*/

                if (!reducer) {
                    console.log('return i 0')
                    return callerName.value || callerNumber.value
                }

                console.log('3', reducer)
                const sumString = reducer + ', ' + (callerName.value || callerNumber.value)
                console.log('sumString', sumString)
                return sumString
            }, '')

            console.log('participantsReduced', participantsReduced)

            return {
                value: room.roomId,
                label: participantsReduced
            }})
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
.room-select_wrapper {
  @apply rounded p-0.5;
}

.room-select_wrapper select {
  @apply w-full h-full border border-border-lines rounded;
}

.room-select_wrapper select:focus {
  @apply outline-none ring-0;
}

.room-select_wrapper :deep(.el-select-dropdown .el-select-dropdown__item .vc-select__option-content) {
  @apply block max-w-64 truncate;
}
</style>
