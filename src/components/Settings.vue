<template>
    <div className="max-w-[250px]">
        <MediaDevicesSettings />

        <div class="flex items-center mt-2">
            <label>
                <!--                <div className="inline-block w-4 h-4 text-primary">
                    <MicrophoneIcon />
                </div>-->
                Auto answer
            </label>
            <div class="inline-block ml-2">
                <div className="pt-[4px]">
                    <BaseSwitch v-model="autoAnswerDefaultBehaviour"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { watch } from 'vue'
import MediaDevicesSettings from '@/components/MediaDevicesSettings.vue'
import BaseSwitch from '@/components/base/BaseSwitch.vue'
// import AutoAnswerIcon from '@/assets/icons/autoAnswer.svg?component'
// import MicrophoneIcon from '@/assets/icons/mute.svg?component'
import { autoAnswerDefaultBehaviour } from '@/composables/useCallSettingsPermissions'
import { useOpenSIPSJS } from '@/composables/opensipsjs'

const { setAutoAnswer } = useOpenSIPSJS()

watch(autoAnswerDefaultBehaviour, (newV) => {
    setAutoAnswer(newV)
})

</script>

<style scoped>

</style>
