<template>
    <div class="settings-button_popper">
        <BasePopper v-model="isPopoverOpened" class="--popper">
            <template #content>
                <Settings />
            </template>

            <IncomingCallActionButton
                color="primary"
                :icon="SettingsIcon"
                @click="openSettingsPopover" />
        </BasePopper>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import SettingsIcon from '@/assets/icons/settings.svg'
import BasePopper from '@/components/base/BasePopper.vue'
import Settings from '@/components/Settings.vue'
import IncomingCallActionButton from '@/components/base/IncomingCallActionButton.vue'

const isPopoverOpened = ref(false)

const openSettingsPopover = () => {
    isPopoverOpened.value = !isPopoverOpened.value
}
</script>

<style scoped>

</style>
