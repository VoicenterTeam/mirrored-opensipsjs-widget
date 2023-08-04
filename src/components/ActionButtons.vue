<template>
    <div className="flex justify-between bg-secondary-bg">
        <div className="flex">
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
import { onMounted, computed } from 'vue'
import SettingsIconButton from '@/components/SettingsIconButton.vue'
import WidgetIconButton from '@/components/base/WidgetIconButton.vue'
import MuteIcon from '@/assets/icons/mute.svg?component'
import UnMuteIcon from '@/assets/icons/unmute.svg?component'
import MergeIcon from '@/assets/icons/merge.svg?component'
import { useOpenSIPSJS, isMuted, isMuteWhenJoin, allActiveCalls, currentActiveRoom } from '@/composables/opensipsjs'

const { muteAgent, opensipsjs } = useOpenSIPSJS()

const emit = defineEmits<{
    (e: 'merge-click', roomId: number): void
}>()

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

onMounted(() => {
    opensipsjs.muteWhenJoin
})

</script>

<style scoped>

</style>
