<template>
    <div className="flex action-buttons_wrapper">
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
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue'
import SettingsIconButton from '@/components/SettingsIconButton.vue'
import WidgetIconButton from '@/components/base/WidgetIconButton.vue'
import MuteIcon from '@/assets/icons/mute.svg?component'
import UnMuteIcon from '@/assets/icons/unmute.svg?component'
import { useOpenSIPSJS, isMuted, isMuteWhenJoin, allActiveCalls } from '@/composables/opensipsjs'

const { muteAgent, opensipsjs } = useOpenSIPSJS()

const isAgentMuted = computed(() => {
    if (!Object.values(allActiveCalls.value).length) {
        return isMuteWhenJoin.value
    } else {
        return isMuted.value
    }
})

const doMuteAgent = () => {
    if (!Object.values(allActiveCalls.value).length) {
        opensipsjs.setMuteWhenJoin(!isAgentMuted.value)
    } else {
        muteAgent(!isAgentMuted.value)
    }
}

onMounted(() => {
    opensipsjs.muteWhenJoin
})

</script>

<style scoped>

</style>
