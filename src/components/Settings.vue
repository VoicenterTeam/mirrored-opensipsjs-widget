<template>
    <div className="max-w-[250px]">
        <MediaDevicesSettings />

        <div v-if="showAutoAnswerSetup" class="flex items-center mt-2">
            <label>
                <!--                <div className="inline-block w-4 h-4 text-primary">
                    <MicrophoneIcon />
                </div>-->
                Auto answer
            </label>
            <div class="inline-block ml-2">
                <div className="pt-[4px]">
                    <BaseSwitch v-model="autoAnswerDefaultBehaviour" :disabled="!allowAutoAnswerSetup"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue'
import MediaDevicesSettings from '@/components/MediaDevicesSettings.vue'
import BaseSwitch from '@/components/base/BaseSwitch.vue'
// import AutoAnswerIcon from '@/assets/icons/autoAnswer.svg?component'
// import MicrophoneIcon from '@/assets/icons/mute.svg?component'
import { autoAnswerDefaultBehaviour, allowAutoAnswerSetup } from '@/composables/useWidgetConfig'
import { useOpenSIPSJS } from '@/composables/opensipsjs'

const { setAutoAnswer } = useOpenSIPSJS()

watch(autoAnswerDefaultBehaviour, (newV) => {
    setAutoAnswer(newV)
})

const showAutoAnswerSetup = computed(() => {
    return autoAnswerDefaultBehaviour.value || allowAutoAnswerSetup.value
})

</script>

<style scoped>

</style>
