<template>
    <div>
        <ActiveView v-if="isActiveTab" />
        <InactiveView v-else />
    </div>
</template>

<script lang="ts" setup>
import type { IWidgetAppProps } from '@/types/internal'
import InactiveView from '@/views/InactiveView.vue'
import ActiveView from '@/views/ActiveView.vue'
import { useActiveTab } from '@/plugins/activeTabPlugin'

const { isActiveTab } = useActiveTab()

const props = defineProps<IWidgetAppProps>()

function onMouseDown (e: MouseEvent) {
    props.dragStart(e)
}
</script>

<style scoped>

</style>
