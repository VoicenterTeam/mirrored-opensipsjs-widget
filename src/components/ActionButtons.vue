<template>
    <div :className="actionButtonWrapperClasses">
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
        <div className="flex w-full">
            <slot name="prefix-buttons" />
            <SettingsIconButton className="border-r-1 border-border-lines" />
            <div>
                <WidgetIconButton
                    color="primary"
                    :icon="MuteIcon"
                    :pressed="isAgentMuted"
                    :pressed-icon="UnMuteIcon"
                    additional-classes="border-r border-border-lines"
                    @click="doMuteAgent" />
            </div>
            <div v-if="allowOutgoingCalls && props.showOutgoingButton" className="flex w-full">
                <div v-if="isOutgoingCallInputOpen" className="w-full">
                    <InputOutgoingCall
                        v-model="outgoingInputValue"
                        @call="onOutgoingCallClick"
                        @close="onOutgoingInputClose"
                    />
                </div>
                <div>
                    <WidgetIconButton
                        color="success"
                        :icon="CallIcon"
                        :use-focus-effect="false"
                        :additional-classes="outgoingCallButtonClasses"
                        @click="onOutgoingCallClick" />
                </div>

            </div>
            <slot name="suffix-buttons" />
        </div>
        <div v-if="showMergeButton">
            <WidgetIconButton
                color="primary"
                :icon="MergeIcon"
                additional-classes="border-l border-border-lines"
                @click="onMergeClick" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { UnwrapRef } from 'vue'
import { onMounted, computed, ref } from 'vue'
import SettingsIconButton from '@/components/SettingsIconButton.vue'
import WidgetIconButton from '@/components/base/WidgetIconButton.vue'
import MuteIcon from '@/assets/icons/mute.svg?component'
import UnMuteIcon from '@/assets/icons/unmute.svg?component'
import ExpandRoomsIcon from '@/assets/icons/expandRooms.svg?component'
import MergeIcon from '@/assets/icons/merge.svg?component'
import CallIcon from '@/assets/icons/call2.svg?component'
import { useOpenSIPSJS, isMuted, isMuteWhenJoin, allActiveCalls, currentActiveRoom } from '@/composables/opensipsjs'
import { allowOutgoingCalls } from '@/composables/useWidgetConfig'
import type { ICall } from '@voicenter-team/opensips-js/src/types/rtc'
import InputOutgoingCall from '@/components/InputOutgoingCall.vue'

const { muteAgent, startCall, opensipsjs } = useOpenSIPSJS()

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
}>()

const isExpandRoomsState = ref<boolean>(false)
const isOutgoingCallInputOpen = ref<boolean>(false)
const outgoingInputValue = ref<string>('')

const actionButtonWrapperClasses = computed(() => {
    const justifyStyle = isExpandRoomsState.value ? 'justify-between' : 'justify-start'
    return `flex ${justifyStyle} bg-secondary-bg`
})

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

const doMuteAgent = () => {
    if (!allActiveCalls.value.length) {
        opensipsjs.setMuteWhenJoin(!isAgentMuted.value)
    } else {
        muteAgent(!isAgentMuted.value)
    }
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
    if (!isOutgoingCallInputOpen.value) {
        isExpandRoomsState.value = false
        isOutgoingCallInputOpen.value = true
    } else {
        if (!outgoingInputValue.value) {
            return
        }
        const target = outgoingInputValue.value
        outgoingInputValue.value = ''

        startCall(target)
    }

}

const onOutgoingInputClose = () => {
    isOutgoingCallInputOpen.value = false
    outgoingInputValue.value = ''
}

onMounted(() => {
    opensipsjs.muteWhenJoin
})
</script>

<style scoped>

</style>
