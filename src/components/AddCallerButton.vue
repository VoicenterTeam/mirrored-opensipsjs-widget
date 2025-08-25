<template>
    <div>
        <VcPopover
            v-model="isPopoverOpened"
            :teleported="false"
            :popover-width="220"
            :trigger="[]"
            placement="top"
        >
            <template #reference>
                <RoomActionButton
                    style="width: 98px;"
                    icon="vc-lc-circle-plus"
                    label="ADD CALLER"
                    @click="onClick"
                />
            </template>

            <div class="p-2">
                <Keypad
                    is-add-caller-type
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
import { keypadMode } from '@/composables/useWidgetConfig'
const { startCall } = useOpenSIPSJS()

const props = withDefaults(
    defineProps<{
        buttonClasses?: string
    }>(),
    {}
)

const emit = defineEmits<{
    (e: 'press', value: string): void,
    (e: 'toggle-keypad'): void
}>()

const isPopoverOpened = ref(false)

const onPress = (value: string) => {
    emit('press', value)
}

function onClick () {
    if (keypadMode.value === 'popover') {
        isPopoverOpened.value = !isPopoverOpened.value
        return
    }

    emit('toggle-keypad')
}

function onStartCall (target: string) {
    if (!currentActiveRoom.value) {
        return
    }

    console.log('startCall', target, true)
    startCall(target, true)
}

const openSettingsPopover = () => {
    isPopoverOpened.value = !isPopoverOpened.value
}
</script>

<style scoped>

</style>
