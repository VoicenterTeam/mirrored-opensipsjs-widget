<template>
    <div className="flex action-buttons_wrapper">
        <div className="p-2">
            1
        </div>
        <div className="p-2">
            <SettingsIconButton />
        </div>
        <div className="p-2">
            3
        </div>
        <div className="p-2">
            4
        </div>
    </div>
</template>

<script lang="ts" setup>
import SettingsIconButton from '@/components/SettingsIconButton.vue'
const openSettingsPopover = (event: Event) => {
    event.preventDefault()

}
</script>

<style scoped>

</style>
