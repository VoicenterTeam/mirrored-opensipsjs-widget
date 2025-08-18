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
                        v-if="displayCallerInfoName && callerName"
                        class="w-1/2 max-w-1/2 truncate"
                    >
                        {{ callerName }}
                    </span>
                    <span
                        v-if="displayCallerInfoId && callerNumber"
                        class="w-1/2 max-w-1/2 truncate"
                    >
                        {{ callerNumber }}
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


        <!--        <div className="flex justify-around items-center bg-primary-bg">
            <div className="flex items-center justify-center px-2 uppercase text-xxs">
                <span className="text-center font-bold text-secondary-text">
                    {{ getTranslation('audio.transfer') }}
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
                        @click="doTransfer"
                    />
                </div>
                <div className="rounded-r overflow-hidden">
                    <WidgetIconButton
                        color="danger"
                        hover-color="additional-danger-bg"
                        :icon="CloseIcon"
                        size="lg"
                        additional-classes=""
                        @click="cancelTransferring"
                    />
                </div>
            </div>
        </div>-->
    </div>
</template>

<script lang="ts" setup>
import { computed, ref, type UnwrapRef } from 'vue'
import CheckmarkIcon from '@/assets/icons/checkmark.svg?component'
import CloseIcon from '@/assets/icons/close2.svg?component'
import BaseInput from '@/components/base/BaseInput.vue'
import WidgetIconButton from '@/components/base/WidgetIconButton.vue'
import { getTranslation } from '@/plugins/translator'
import ActionIconButton from '@/components/base/ActionIconButton.vue'
import { displayCallerInfoId, displayCallerInfoName } from '@/composables/useWidgetConfig.ts'
import useCallInfo from '@/composables/useCallInfo.ts'
import InputOutgoingCall from '@/components/InputOutgoingCall.vue'
import { allActiveCalls, isDND } from '@/composables/opensipsjs.ts'

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

const { callerNumber, callerName } = useCallInfo(transferringCall.value)

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
