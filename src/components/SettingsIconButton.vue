<template>
    <div>
        <!--        <button @click="openSettingsPopover">S</button>-->
        <SettingsPopover />
    </div>
</template>

<script lang="ts" setup>
// import { ref } from 'vue'
import SettingsPopover from '@/components/SettingsPopover.vue'

/*const isPopoverOpened = ref<boolean>(false)

const openSettingsPopover = (event: Event) => {
    event.preventDefault()
    isPopoverOpened.value = true
}*/
</script>

<style scoped>

</style>
