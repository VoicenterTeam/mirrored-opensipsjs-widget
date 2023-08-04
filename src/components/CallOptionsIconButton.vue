<template>
    <div>
        <BasePopper v-model="isPopoverOpened">
            <template #content>
                <CallOptionsContent @transfer-click="onTransferClick" @move-click="onMoveClick" />
            </template>

            <WidgetIconButton
                color="primary"
                :icon="ActionIcon"
                size="xxl"
                :additional-classes="props.buttonClasses"
                @click="openOptionsPopover" />
        </BasePopper>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import WidgetIconButton from '@/components/base/WidgetIconButton.vue'
import ActionIcon from '@/assets/icons/action.svg?component'
import BasePopper from '@/components/base/BasePopper.vue'
import CallOptionsContent from '@/components/CallOptionsContent.vue'

const props = withDefaults(
    defineProps<{
        buttonClasses?: string
    }>(),
    {}
)

const emit = defineEmits<{
    (e: 'transfer-click'): void
    (e: 'move-click'): void
}>()

const isPopoverOpened = ref(false)

const openOptionsPopover = () => {
    isPopoverOpened.value = !isPopoverOpened.value
}

const onTransferClick = () => {
    emit('transfer-click')
}

const onMoveClick = () => {
    emit('move-click')
}
</script>

<style scoped>

</style>
