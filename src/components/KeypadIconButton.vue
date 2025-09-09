<template>
    <div>
        <VcPopover
            v-model="isPopoverOpened"
            :teleported="false"
            :popover-width="220"
            :triggers="['click', 'touch']"
            placement="top"
        >
            <template #reference>
                <ActionIconButton
                    icon="vc-lc-grip"
                    color="primary-actions"
                    @click="openSettingsPopover"
                />
            </template>

            <div class="p-2">
                <Keypad
                    @press="onPress"
                />
            </div>
        </VcPopover>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { VcPopover } from '@voicenter-team/voicenter-ui-plus'
import Keypad from '@/components/Keypad.vue'
import ActionIconButton from '@/components/base/ActionIconButton.vue'

const emit = defineEmits<{
    (e: 'press', value: string): void
}>()

const isPopoverOpened = ref(false)

const onPress = (value: string) => {
    emit('press', value)
}

const openSettingsPopover = () => {
    isPopoverOpened.value = !isPopoverOpened.value
}
</script>

<style scoped>

</style>
