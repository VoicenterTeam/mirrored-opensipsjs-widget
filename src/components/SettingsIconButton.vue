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
        </VcPopover>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Settings from '@/components/Settings.vue'
import ActionIconButton from '@/components/base/ActionIconButton.vue'
import { VcPopover } from '@voicenter-team/voicenter-ui-plus'

const isPopoverOpened = ref(false)

const openSettingsPopover = () => {
    isPopoverOpened.value = !isPopoverOpened.value
}
</script>

<style scoped>

</style>
