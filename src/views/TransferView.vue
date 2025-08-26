<template>
    <div class="p-1">
        <div class="flex items-center mb-1">
            <div>
                <ActionIconButton
                    icon="vc-lc-arrow-left"
                    color="primary-actions"
                    bg-color="inactive-elements-bg--focus"
                    size="sm"
                    rounded
                    @click="cancelTransferring"
                />
            </div>
            <div class="w-full ml-2">
                <div class="text-xs text-inactive-text font-semibold">
                    {{ getTranslation('audio.transfer').toUpperCase() }}
                </div>
                <div
                    class="flex text-sm text-main-text font-medium"
                    style="width: 300px; max-width: 300px;"
                >
                    <span
                        v-if="displayCallerInfoName && displayName"
                        class="w-1/2 max-w-1/2 truncate"
                    >
                        {{ displayName }}
                    </span>
                    <span
                        v-if="displayCallerInfoId && displayNumber"
                        class="w-1/2 max-w-1/2 truncate"
                    >
                        {{ displayNumber }}
                    </span>
                </div>
            </div>
        </div>

        <div class="flex w-full">
            <div class="w-full">
                <InputOutgoingCall
                    v-model="target"
                    bg-color=""
                    @call="doTransfer"
                    @close="clearTargetInput"
                />
            </div>
            <div>
                <ActionIconButton
                    icon="vc-lc-redo-2"
                    bg-color="primary-actions-bg--focus"
                    color="primary"
                    @click="doTransfer"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { getTranslation } from '@/plugins/translator'
import ActionIconButton from '@/components/base/ActionIconButton.vue'
import { displayCallerInfoId, displayCallerInfoName } from '@/composables/useWidgetConfig.ts'
import useCallInfo from '@/composables/useCallInfo.ts'
import InputOutgoingCall from '@/components/InputOutgoingCall.vue'
import { allActiveCalls } from '@/composables/opensipsjs.ts'

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

const transferringCall = computed(() => {
    return allActiveCalls.value.find((call) => {
        return call._id === props.callId
    })
})

const { displayNumber, displayName } = useCallInfo(transferringCall.value)

const target = ref<string>('')

const doTransfer = () => {
    if (!target.value) {
        return
    }
    emit('transfer', props.callId, target.value)
}

function clearTargetInput () {
    target.value = ''
}

const cancelTransferring = () => {
    emit('cancel')
}

</script>

<style scoped>

</style>
