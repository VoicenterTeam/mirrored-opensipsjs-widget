<template>
    <div className="min-h-[60px] min-w-[354px]">
        <RingingView v-show="false" number="+9729074569356" />
        <div v-show="true">
            <div className="flex min-h-[32px] justify-center items-center">
                <VoicenterIcon />
            </div>
            <ActionButtons />
        </div>

    </div>

</template>

<script lang="ts" setup>
import ActionButtons from '@/components/ActionButtons.vue'
import VoicenterIcon from '@/assets/icons/voicenter.svg?component'
import RingingView from '@/views/RingingView.vue'

</script>

<style scoped>

</style>
