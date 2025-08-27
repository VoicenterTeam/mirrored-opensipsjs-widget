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
                <RoomActionButton
                    style="width: 98px;"
                    icon="vc-lc-circle-plus"
                    :label="getTranslation('audio.room.add.caller')"
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
        </VcPopover>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { VcPopover } from '@voicenter-team/voicenter-ui-plus'
import Keypad from '@/components/Keypad.vue'
import { useOpenSIPSJS, currentActiveRoom } from '@/composables/opensipsjs'
import RoomActionButton from '@/components/base/RoomActionButton.vue'
import { keypadMode } from '@/composables/useWidgetConfig'
import { getTranslation } from '@/plugins/translator.ts'
const { startCall } = useOpenSIPSJS()

const emit = defineEmits<{
    (e: 'press', value: string): void,
    (e: 'toggle-keypad'): void
}>()

const isPopoverOpened = ref(false)

const triggersArray = computed(() => {
    return keypadMode.value === 'popover' ? [ 'click' ] : []
})

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

    startCall(target, true)
}
</script>

<style scoped>

</style>
