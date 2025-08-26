<template>
    <div>
        <div class="flex w-full p-1">
            <slot name="prefix-buttons" />
            <SettingsIconButton />
            <div>
                <ActionIconButton
                    icon="vc-lc-phone-off"
                    :color="isDND ? 'btn-filled-text': 'primary-actions'"
                    :bg-color="isDND ? 'destructive-actions': 'primary-actions-bg--focus'"
                    @click="switchDND"
                />
            </div>
            <div class="volume-bar_wrapper bg-primary-actions-bg--focus">
                <i class="vc-lc-volume-2 text-primary-actions" />
                <div>
                    <VcSlider
                        :model-value="speakerVolume"
                        :min="0"
                        :max="1"
                        :step="0.01"
                        :show-tooltip="false"
                        @update:modelValue="onChangeSpeakerVolume"
                    />
                </div>
            </div>
            <div>
                <ActionIconButton
                    :icon="isAgentMuted ? 'vc-lc-mic-off': 'vc-lc-mic'"
                    :color="isAgentMuted ? 'btn-filled-text': 'primary-actions'"
                    :bg-color="isAgentMuted ? 'destructive-actions': 'primary-actions-bg--focus'"
                    @click="doMuteAgent"
                />
            </div>
            <div v-if="showKeypad && keypadMode === 'manual'">
                <ActionIconButton
                    icon="vc-lc-grip"
                    color="primary-actions"
                    @click="toggleManualKeypad"
                />
            </div>

            <div v-if="showMergeButton">
                <ActionIconButton
                    icon="vc-lc-merge"
                    color="primary-actions"
                    @click="onMergeClick"
                />
            </div>

            <NewCallerButton @toggle-keypad="toggleNewCallerKeypad" />

            <KeypadIconButton
                v-if="showKeypad && keypadMode === 'popover'"
                @press="onKeypadPress"
            />
            <div
                v-if="allowOutgoingCalls"
            >
                <div>
                    <ActionIconButton
                        v-if="showCallButton"
                        icon="vc-icon-phone"
                        bg-color="success-actions"
                        color="white"
                        @click="onOutgoingCallClick"
                    />
                    <ActionIconButton
                        v-if="showHangupButton"
                        icon="vc-icon-phone-down"
                        bg-color="destructive-actions"
                        color="white"
                        @click="onHangupSingleCall"
                    />
                </div>
            </div>
            <slot name="suffix-buttons" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { UnwrapRef } from 'vue'
import { computed, ref } from 'vue'
import SettingsIconButton from '@/components/SettingsIconButton.vue'
import KeypadIconButton from '@/components/KeypadIconButton.vue'
import ActionIconButton from '@/components/base/ActionIconButton.vue'
import {
    useOpenSIPSJS,
    isMuted,
    isMuteWhenJoin,
    allActiveCalls,
    currentActiveRoom,
    isDND,
    speakerVolume
} from '@/composables/opensipsjs'
import { allowOutgoingCalls, showKeypad, keypadMode } from '@/composables/useWidgetConfig'
import type { ICall } from 'opensips-js/src/types/rtc'
import { VcSlider } from '@voicenter-team/voicenter-ui-plus'
import { debounce } from 'lodash'
import NewCallerButton from '@/components/NewCallerButton.vue'

const { muteAgent, setDND, terminateCall, startCall, setSpeakerVolume, state } = useOpenSIPSJS()

withDefaults(
    defineProps<{
        calls: UnwrapRef<Array<ICall>>
        showOutgoingButton: boolean
    }>(),
    {
        showOutgoingButton: false
    }
)

const emit = defineEmits<{
    (e: 'merge-click', roomId: number): void
    (e: 'start-call'): void
    (e: 'key-press', value: string): void
    (e: 'toggle-keypad'): void
    (e: 'toggle-new-call-keypad'): void
}>()

const isOutgoingCallInputOpen = ref<boolean>(false)
const outgoingInputValue = ref<string>('')

const isAgentMuted = computed(() => {
    if (!allActiveCalls.value.length) {
        return isMuteWhenJoin.value
    } else {
        return isMuted.value
    }
})

const showMergeButton = computed(() => {
    const callsInRoom = allActiveCalls.value.filter(call => call.roomId === currentActiveRoom.value)
    return callsInRoom.length === 2
})

const showCallButton = computed(() => {
    return allActiveCalls.value.length === 0
})

const showHangupButton = computed(() => {
    const callsInRoom = allActiveCalls.value.filter(call => call.roomId === currentActiveRoom.value)
    return callsInRoom.length === 1 && allActiveCalls.value.length === 1
})

const onChangeSpeakerVolume = debounce((value: number) => {
    setSpeakerVolume(value)
}, 100)

const onHangupSingleCall = () => {
    const callsInRoom = allActiveCalls.value.filter(call => call.roomId === currentActiveRoom.value)

    if (callsInRoom.length !== 1) {
        return
    }

    terminateCall(callsInRoom[0]._id)
}

function toggleNewCallerKeypad () {
    emit('toggle-new-call-keypad')
}
const toggleManualKeypad = () => {
    emit('toggle-keypad')
}

const onKeypadPress = (value: string) => {
    emit('key-press', value)
}

const doMuteAgent = () => {
    if (!allActiveCalls.value.length) {
        state?.opensipsjs?.audio.setMuteWhenJoin(!isAgentMuted.value)
    } else {
        muteAgent(!isAgentMuted.value)
    }
}

const switchDND = () => {
    setDND(!isDND.value)
}

const onMergeClick = () => {
    if (!currentActiveRoom.value) return
    emit('merge-click', currentActiveRoom.value)
}

const onOutgoingCallClick = () => {
    emit('start-call')
}

</script>

<style scoped>
.volume-bar_wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  height: 30px;
  margin: 1px;
  border-radius: 5px;
  padding-left: 10px;
}

.volume-bar_wrapper div {
  width: 100%;
  padding: 0px 8px 0px 8px;
}

.volume-bar_wrapper i {
  font-size: 20px;
}
</style>
