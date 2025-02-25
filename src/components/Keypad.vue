<template>
    <div className="grid grid-cols-3 gap-2 max-w-[250px] p-1">
        <div v-for="(button) in buttons" :key="button">
            <div
                className="flex items-center justify-center w-12 h-8 rounded border border-border-lines font-semibold
          hover:bg-primary hover:text-button-pressed-text hover:border-none cursor-pointer"
                @click="onPress(button)"
            >
                {{ button }}
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, watch, ref } from 'vue'
import MediaDevicesSettings from '@/components/MediaDevicesSettings.vue'
import BaseSwitch from '@/components/base/BaseSwitch.vue'
import AutoAnswerIcon from '@/assets/icons/autoAnswer.svg?component'
// import MicrophoneIcon from '@/assets/icons/mute.svg?component'
import { autoAnswerDefaultBehaviour, allowAutoAnswerSetup } from '@/composables/useWidgetConfig'
import { useOpenSIPSJS } from '@/composables/opensipsjs'

const { setAutoAnswer } = useOpenSIPSJS()


const emit = defineEmits<{
    (e: 'press', value: string): void
}>()

const buttons = [ '1', '2', '3', '4', '5', '6', '7', '8' ,'9', '*', '0', '#' ]

const onPress = (value: string) => {
    emit('press', value)
}
/*watch(autoAnswerDefaultBehaviour, (newV) => {
    setAutoAnswer(newV)
})

const showAutoAnswerSetup = computed(() => {
    return autoAnswerDefaultBehaviour.value || allowAutoAnswerSetup.value
})*/

</script>

<style scoped>

</style>
