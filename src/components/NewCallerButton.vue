<template>
    <div>
        <VcPopover
            v-model="isPopoverOpened"
            :teleported="false"
            :popover-width="220"
            :trigger="triggersArray"
            placement="top"
        >
            <template #reference>
                <ActionIconButton
                    icon="vc-lc-circle-plus"
                    color="primary-actions"
                    @click="openNewCallPopover"
                />
            </template>

            <div class="p-2">
                <Keypad
                    is-new-call-type
                    @call="onStartCall"
                />
            </div>
        </VcPopover>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { VcPopover } from '@voicenter-team/voicenter-ui-plus'
import Keypad from '@/components/Keypad.vue'
import { useOpenSIPSJS } from '@/composables/opensipsjs'
import ActionIconButton from '@/components/base/ActionIconButton.vue'
import { keypadMode } from '@/composables/useWidgetConfig'
import { PopoverTriggerType } from '@voicenter-team/voicenter-ui-plus/library/types/types/VcPopover.types'
const { getAudioApi } = useOpenSIPSJS()

const { startCall } = getAudioApi()

const emit = defineEmits<{
    (e: 'toggle-keypad'): void
}>()

const isPopoverOpened = ref(false)

const triggersArray = computed(() => {
    const popoverTrigger: PopoverTriggerType = 'click'

    return keypadMode.value === 'popover' ? popoverTrigger : undefined
})
function onStartCall (target: string) {
    startCall(target, false, false)
}

const openNewCallPopover = () => {
    if (keypadMode.value === 'popover') {
        isPopoverOpened.value = !isPopoverOpened.value
        return
    }

    emit('toggle-keypad')
}
</script>

<style scoped>

</style>
