<template>
    <div>
        <ActiveView v-if="isActiveTab" />
        <InactiveView v-else />
    </div>
</template>

<script lang="ts" setup>
import InactiveView from '@/views/InactiveView.vue'
import ActiveView from '@/views/ActiveView.vue'
import { useActiveTab } from '@/composables/useActiveTab'

const { isActiveTab } = useActiveTab()
</script>

<style scoped>

</style>
