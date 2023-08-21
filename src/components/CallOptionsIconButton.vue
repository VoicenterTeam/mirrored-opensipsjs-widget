<template>
    <div>
        <BasePopper v-model="isPopoverOpened">
            <template #content>
                <CallOptionsContent
                    :is-single-room="props.isSingleRoom"
                    @transfer-click="onTransferClick"
                    @move-click="onMoveClick"
                />
            </template>

            <WidgetIconButton
                color="primary"
                :icon="ActionIcon"
                :size="actionIconSize"
                :additional-classes="props.buttonClasses"
                :use-padding="!props.isMultiCallMode"
                @click="openOptionsPopover" />
        </BasePopper>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import WidgetIconButton from '@/components/base/WidgetIconButton.vue'
import ActionIcon from '@/assets/icons/action.svg?component'
import BasePopper from '@/components/base/BasePopper.vue'
import CallOptionsContent from '@/components/CallOptionsContent.vue'

const props = withDefaults(
    defineProps<{
        buttonClasses?: string
        isSingleRoom: boolean
        isMultiCallMode: boolean
    }>(),
    {}
)

const emit = defineEmits<{
    (e: 'transfer-click'): void
    (e: 'move-click'): void
}>()

const isPopoverOpened = ref(false)

const actionIconSize = computed(() => {
    return props.isMultiCallMode ? 'base' : 'xxl'
})

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
