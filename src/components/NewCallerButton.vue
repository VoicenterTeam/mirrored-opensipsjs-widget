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
import { computed, ref } from 'vue'
import KeypadIcon from '@/assets/icons/keypad.svg?component'
import WidgetIconButton from '@/components/base/WidgetIconButton.vue'
import BasePopper from '@/components/base/BasePopper.vue'
import { VcPopover } from '@voicenter-team/voicenter-ui-plus'
import Keypad from '@/components/Keypad.vue'
import { useOpenSIPSJS, currentActiveRoom } from '@/composables/opensipsjs'
import ActionIconButton from '@/components/base/ActionIconButton.vue'
import RoomActionButton from '@/components/base/RoomActionButton.vue'
import { allowOutgoingCalls, showKeypad, keypadMode } from '@/composables/useWidgetConfig'
const { startCall } = useOpenSIPSJS()

const props = withDefaults(
    defineProps<{
        buttonClasses?: string
    }>(),
    {}
)

const emit = defineEmits<{
    (e: 'toggle-keypad'): void
}>()

const isPopoverOpened = ref(false)

const triggersArray = computed(() => {
    return keypadMode.value === 'popover' ? [ 'click' ] : []
})
function onStartCall (target: string) {
    console.log('startCall', target)
    startCall(target, false, false)
}

const openNewCallPopover = () => {
    if (keypadMode.value === 'popover') {
        isPopoverOpened.value = !isPopoverOpened.value
        console.log('isPopoverOpened', isPopoverOpened.value)
        return
    }

    emit('toggle-keypad')
}
</script>

<style scoped>

</style>
