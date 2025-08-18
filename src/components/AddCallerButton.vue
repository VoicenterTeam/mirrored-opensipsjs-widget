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
                <RoomActionButton
                    icon="vc-lc-circle-plus"
                    label="ADD CALLER"
                />
            </template>

            <div class="p-2">
                <Keypad
                    title="Add Caller"
                    @press="onPress"
                    @call="onStartCall"
                />
            </div>


            <!--            <WidgetIconButton
                color="primary"
                pressed-color="primary-bg"
                :icon="KeypadIcon"
                :use-focus-effect="true"
                :additional-classes="props.buttonClasses"
                @click="openSettingsPopover" />-->
        </VcPopover>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import KeypadIcon from '@/assets/icons/keypad.svg?component'
import WidgetIconButton from '@/components/base/WidgetIconButton.vue'
import BasePopper from '@/components/base/BasePopper.vue'
import { VcPopover } from '@voicenter-team/voicenter-ui-plus'
import Keypad from '@/components/Keypad.vue'
import { useOpenSIPSJS, currentActiveRoom } from '@/composables/opensipsjs'
import ActionIconButton from '@/components/base/ActionIconButton.vue'
import RoomActionButton from '@/components/base/RoomActionButton.vue'
import { outgoingCallInputPlaceholder } from '@/composables/useWidgetConfig.ts'
const { startCall } = useOpenSIPSJS()

const props = withDefaults(
    defineProps<{
        buttonClasses?: string
    }>(),
    {}
)

const emit = defineEmits<{
    (e: 'press', value: string): void
}>()

const isPopoverOpened = ref(false)

const onPress = (value: string) => {
    emit('press', value)
}

function onStartCall (target: string) {
    if (!currentActiveRoom.value) {
        return
    }

    startCall(target, true)
}

const openSettingsPopover = () => {
    isPopoverOpened.value = !isPopoverOpened.value
}
</script>

<style scoped>

</style>
