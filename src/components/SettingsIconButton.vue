<template>
    <div>
        <VcPopover
            v-model="isPopoverOpened"
            :teleported="false"
            :popover-width="280"
            :triggers="['click', 'touch']"
            placement="top"
        >
            <template #reference>
                <ActionIconButton
                    icon="vc-lc-settings"
                    color="primary-actions"
                    @click="openSettingsPopover"
                />
            </template>

            <div class="p-2">
                <Settings />
            </div>

            <!--            <WidgetIconButton
                color="primary"
                :icon="SettingsIcon"
                :additional-classes="props.buttonClasses"
                @click="openSettingsPopover" />-->
        </VcPopover>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import WidgetIconButton from '@/components/base/WidgetIconButton.vue'
import SettingsIcon from '@/assets/icons/settings.svg?component'
import BasePopper from '@/components/base/BasePopper.vue'
import Settings from '@/components/Settings.vue'
import ActionIconButton from '@/components/base/ActionIconButton.vue'
import { VcPopover } from '@voicenter-team/voicenter-ui-plus'

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
