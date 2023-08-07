<template>
    <div className="flex justify-around items-center bg-primary-bg">
        <div className="flex items-center justify-center px-2 uppercase text-xxs">
            <span className="text-center font-bold text-secondary-text">
                Transfer
            </span>
        </div>

        <div className="px-2">
            <BaseInput v-model="target" />
        </div>

        <div className="flex p-1">
            <div className="rounded-l overflow-hidden mr-[2px]">
                <WidgetIconButton
                    color="success"
                    hover-color="additional-success-bg"
                    :icon="CheckmarkIcon"
                    size="lg"
                    @click="doTransfer" />
            </div>
            <div className="rounded-r overflow-hidden">
                <WidgetIconButton
                    color="danger"
                    hover-color="additional-danger-bg"
                    :icon="CloseIcon"
                    size="lg"
                    additional-classes=""
                    @click="cancelTransferring" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import CheckmarkIcon from '@/assets/icons/checkmark.svg?component'
import CloseIcon from '@/assets/icons/close.svg?component'
import BaseInput from '@/components/base/BaseInput.vue'
import WidgetIconButton from '@/components/base/WidgetIconButton.vue'

const target = ref<string>('')

const props = withDefaults(
    defineProps<{
        callId: string
    }>(),
    {}
)

const emit = defineEmits<{
    (e: 'transfer', callId: string, target: string): void
    (e: 'cancel'): void
}>()

const doTransfer = () => {
    if (!target.value) {
        return
    }
    emit('transfer', props.callId, target.value)
}

const cancelTransferring = () => {
    emit('cancel')
}

</script>

<style scoped>

</style>
