<template>
    <div class="ppp">
        <BasePopper v-model="isPopoverOpened" class="--base-popper">
            <template #content>
                <Keypad @press="onPress" />
            </template>

            <WidgetIconButton
                color="primary"
                pressed-color="primary-bg"
                :icon="KeypadIcon"
                :additional-classes="props.buttonClasses"
                @click="openSettingsPopover" />
        </BasePopper>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import KeypadIcon from '@/assets/icons/keypad.svg?component'
import WidgetIconButton from '@/components/base/WidgetIconButton.vue'
import BasePopper from '@/components/base/BasePopper.vue'
import Keypad from '@/components/Keypad.vue'

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

const openSettingsPopover = () => {
    isPopoverOpened.value = !isPopoverOpened.value
}
</script>

<style scoped>

</style>
