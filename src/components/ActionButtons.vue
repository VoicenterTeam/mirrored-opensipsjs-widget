<template>
    <div className="flex action-buttons_wrapper">
        <slot name="prefix-buttons" />
        <SettingsIconButton className="border-r-1 border-border-lines" />
        <div>
            <WidgetIconButton
                color="primary"
                :icon="MuteIcon"
                additional-classes="border-r border-border-lines"
                @click="doMuteAgent" />
        </div>
        <slot name="suffix-buttons" />
    </div>
</template>

<script lang="ts" setup>
import SettingsIconButton from '@/components/SettingsIconButton.vue'
import WidgetIconButton from '@/components/base/WidgetIconButton.vue'
import MuteIcon from '@/assets/icons/mute.svg?component'
import { useOpenSIPSJS } from '@/composables/opensipsjs'

const { muteAgent } = useOpenSIPSJS()
const openSettingsPopover = (event: Event) => {
    event.preventDefault()

}

const doMuteAgent = () => {
    console.log('mute')
    muteAgent(true)
}

</script>

<style scoped>

</style>
