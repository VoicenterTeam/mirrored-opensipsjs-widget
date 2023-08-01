<template>
    <div>
        <BasePopper v-model="isPopoverOpened">
            <template #content>
                <Settings />
            </template>

            <WidgetIconButton
                color="primary"
                :icon="SettingsIcon"
                :additional-classes="props.buttonClasses"
                @click="openSettingsPopover" />
        </BasePopper>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import WidgetIconButton from '@/components/base/WidgetIconButton.vue'
import SettingsIcon from '@/assets/icons/settings.svg?component'
import BasePopper from '@/components/base/BasePopper.vue'
import Settings from '@/components/Settings.vue'

const props = withDefaults(
    defineProps<{
        buttonClasses?: string
    }>(),
    {}
)

const isPopoverOpened = ref(false)

const openSettingsPopover = () => {
    isPopoverOpened.value = !isPopoverOpened.value
}
</script>

<style scoped>

</style>
