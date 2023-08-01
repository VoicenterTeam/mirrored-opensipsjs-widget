<template>
    <div className="flex action-buttons_wrapper">
        <div>
            1
        </div>
        <SettingsIconButton className="border-r-1 border-border-lines" />
        <div>
            3
        </div>
        <div>
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
