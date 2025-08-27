<template>
    <div
        class="p-1.5"
    >
        <div
            class="flex p-1"
            style="box-shadow: 0 0 6px rgba(0,0,0,0.1); border-radius: 5px;"
        >
            <div class="w-full">
                <div
                    class="flex text-sm text-main-text font-medium"
                    style="width: 220px; max-width: 220px;"
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
                <div class="text-xs text-inactive-text font-semibold">
                    {{ getTranslation('audio.incoming.call').toUpperCase() }}
                </div>
            </div>
            <div
                v-if="!call.autoAnswer"
                class="flex items-center"
            >
                <div>
                    <ActionIconButton
                        icon="vc-icon-phone"
                        color="white"
                        bg-color="success-actions"
                        rounded
                        :disabled="answerClicked"
                        @click="answerIncomingCall"
                    />
                </div>
                <div class="ml-1">
                    <ActionIconButton
                        icon="vc-icon-phone-down"
                        color="white"
                        bg-color="destructive-actions"
                        rounded
                        @click="declineIncomingCall"
                    />
                </div>
                <div
                    v-if="allowTransfer"
                    class="mx-1"
                >
                    <ActionIconButton
                        icon="vc-lc-redo-2"
                        color="primary-actions"
                        bg-color="inactive-elements-bg--focus"
                        size="sm"
                        rounded
                        @click="transferIncomingCall"
                    />
                </div>

                <!--                <IncomingCallActionButton
                    v-if="allowTransfer"
                    color="secondary"
                    hover-color="secondary-text"
                    :icon="TransferIcon"
                    size="xxxl"
                    additional-classes=""
                    @click="transferIncomingCall"
                />-->
            </div>
            <div
                v-else
                class="flex"
            >
                <!--            Answering...-->
                <div class="flex items-center mx-2 w-[46px]">
                    <span class="text-xs text-main-text">
                        {{ callTime }}
                    </span>
                </div>

                <IncomingCallActionButton
                    color="danger"
                    hover-color="additional-danger-bg"
                    :icon="DeclineIcon"
                    size="xxxl"
                    additional-classes=""
                    @click="declineIncomingCall"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { UnwrapRef } from 'vue'
import DeclineIcon from '@/assets/icons/decline.svg?component'
import IncomingCallActionButton from '@/components/base/IncomingCallActionButton.vue'
import type { ICall } from 'opensips-js/src/types/rtc'
import { useOpenSIPSJS } from '@/composables/opensipsjs'
import { callTimes } from '@/composables/opensipsjs'
import useCallInfo from '@/composables/useCallInfo'
import { ref, onMounted, computed } from 'vue'
import {
    displayCallerInfoName,
    displayCallerInfoId,
    allowTransfer
} from '@/composables/useWidgetConfig'
import { getFormattedTimeFromSeconds } from '@/helpers/timeHelper'
import useRingingSound from '@/composables/useRingingSound.ts'
import { getTranslation } from '@/plugins/translator'
import ActionIconButton from '@/components/base/ActionIconButton.vue'

const props = withDefaults(
    defineProps<{
        call: UnwrapRef<ICall>
    }>(),
    {}
)

/* Emits */
const emit = defineEmits<{
    (e: 'transfer-click'): void
}>()

/* Composables */
const { answerCall, terminateCall } = useOpenSIPSJS()
const { displayNumber, displayName } = useCallInfo(props.call)
const { play, stop } = useRingingSound()

/* Computed */
const callTime = computed(() => {
    const time = callTimes.value[props.call._id]
    return getFormattedTimeFromSeconds(time)
})

/* Data */
const answerClicked = ref(false)

/* Methods */
const answerIncomingCall = () => {
    answerCall(props.call._id)
    stop()
    answerClicked.value = true
}
const declineIncomingCall = () => {
    terminateCall(props.call._id)
}
const transferIncomingCall = () => {
    emit('transfer-click')
}

onMounted(() => {
    play()
})
</script>

<style scoped>

</style>
