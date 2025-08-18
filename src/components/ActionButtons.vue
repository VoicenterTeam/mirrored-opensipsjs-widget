<template>
    <div>
        <!--        <div :className="expandWrapperClasses">
            <div>
                <WidgetIconButton
                    color="primary"
                    :icon="ExpandRoomsIcon"
                    :pressed="isExpandRoomsState"
                    additional-classes="border-r border-border-lines"
                    @click="expandRoom" />
            </div>
            <div v-if="isExpandRoomsState" className="w-full bg-primary">
                <div/>
            </div>
        </div>-->
        <div class="flex w-full p-1">
            <slot name="prefix-buttons" />
            <SettingsIconButton />
            <!--            <div>
                <ActionIconButton
                    icon="vc-lc-settings"
                    color="primary-actions"
                />
            </div>-->
            <div>
                <!--                <WidgetIconButton
                    color="primary"
                    :icon="MuteIcon"
                    :pressed="isAgentMuted"
                    :pressed-icon="UnMuteIcon"
                    additional-classes="border-r border-border-lines"
                    @click="doMuteAgent"
                />-->
                <!--                <ActionIconButton
                    icon="vc-lc-history"
                    color="primary-actions"
                />-->
            </div>
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
                        :model-value="microphoneInputLevel"
                        :min="0"
                        :max="1"
                        :step="0.01"
                        @update:modelValue="onChangeMicrophoneSensitivity"
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
            <!--            <div v-if="showKeypad && keypadMode === 'manual'">
                <WidgetIconButton
                    color="primary"
                    :icon="KeypadIcon"
                    :pressed="showManualKeypad"
                    :pressed-icon="KeypadIcon"
                    additional-classes="border-r border-border-lines"
                    @click="toggleManualKeypad"
                />
            </div>-->

            <KeypadIconButton
                v-if="showKeypad && keypadMode === 'popover'"
                @press="onKeypadPress"
            />
            <div
                v-if="allowOutgoingCalls"
            >
                <!--                <div
                    v-if="isOutgoingCallInputOpen"
                    class="w-full"
                >
                    <InputOutgoingCall
                        v-model="outgoingInputValue"
                        @call="onOutgoingCallClick"
                        @close="onOutgoingInputClose"
                    />
                </div>-->
                <div>
                    <!--                    <WidgetIconButton
                        color="success"
                        :icon="CallIcon"
                        :use-focus-effect="false"
                        :additional-classes="outgoingCallButtonClasses"
                        @click="onOutgoingCallClick"
                    />-->
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
import WidgetIconButton from '@/components/base/WidgetIconButton.vue'
import ActionIconButton from '@/components/base/ActionIconButton.vue'
import MuteIcon from '@/assets/icons/mute.svg?component'
import UnMuteIcon from '@/assets/icons/unmute.svg?component'
import KeypadIcon from '@/assets/icons/keypad.svg?component'
import MergeIcon from '@/assets/icons/merge.svg?component'
import CallIcon from '@/assets/icons/call2.svg?component'
import {
    useOpenSIPSJS,
    isMuted,
    isMuteWhenJoin,
    allActiveCalls,
    currentActiveRoom,
    isDND,
    microphoneInputLevel
} from '@/composables/opensipsjs'
import { allowOutgoingCalls, showKeypad, keypadMode } from '@/composables/useWidgetConfig'
import type { ICall } from 'opensips-js/src/types/rtc'
import InputOutgoingCall from '@/components/InputOutgoingCall.vue'
import { VcSlider } from '@voicenter-team/voicenter-ui-plus'
import { debounce } from 'lodash'

const { muteAgent, setDND, terminateCall, startCall, setMicrophoneSensitivity, state } = useOpenSIPSJS()

const props = withDefaults(
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
    (e: 'start-call', target: number): void
    (e: 'key-press', value: string): void
    (e: 'toggle-keypad'): void
}>()

const isExpandRoomsState = ref<boolean>(false)
const isOutgoingCallInputOpen = ref<boolean>(false)
const outgoingInputValue = ref<string>('')
const showManualKeypad = ref<boolean>(false)


const expandWrapperClasses = computed(() => {
    const base = 'flex z-50'
    return isExpandRoomsState.value ? base + ' w-full' : base
})

const outgoingCallButtonClasses = computed(() => {
    let classes = ' border-border-lines'
    if (!isExpandRoomsState.value && !isOutgoingCallInputOpen.value) {
        classes += ' border-r'
    }
    return classes
})

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
    return callsInRoom.length === 1
})

const onChangeMicrophoneSensitivity = debounce((value: number) => {
    setMicrophoneSensitivity(value)
}, 100)

const onHangupSingleCall = () => {
    const callsInRoom = allActiveCalls.value.filter(call => call.roomId === currentActiveRoom.value)

    if (callsInRoom.length !== 1) {
        return
    }

    terminateCall(callsInRoom[0]._id)
}

const toggleManualKeypad = () => {
    console.log('toggleManualKeypad', showManualKeypad.value)
    showManualKeypad.value = !showManualKeypad.value
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

const expandRoom = () => {
    isOutgoingCallInputOpen.value = false
    isExpandRoomsState.value = !isExpandRoomsState.value
}

const onOutgoingCallClick = () => {
    /*if (!isOutgoingCallInputOpen.value) {
        isExpandRoomsState.value = false
        isOutgoingCallInputOpen.value = true
    } else {
        if (!outgoingInputValue.value) {
            return
        }
        const target = outgoingInputValue.value
        outgoingInputValue.value = ''

        startCall(target)
    }*/

    emit('start-call')
}

const onOutgoingInputClose = () => {
    isOutgoingCallInputOpen.value = false
    outgoingInputValue.value = ''
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
