<template>
    <div
        class="incoming-call justify-between flex items-center px-3 py-2 h-14 w-full mb-2"
    >
        <div class="mr-2.5 w-1/2">
            <div class="caller font-bold text-sm mr-2.5 truncate">
                {{ displayName }}
            </div>
            <div class="title font-semibold font-inter">
                {{ getTranslation('audio.incoming.call') }}
            </div>
        </div>
        <div class="flex items-center gap-x-1.5">
            <CallButton
                class="button"
                icon="vc-icon-phone"
                size="small"
                @click="onAnswerCall"
            />
            <HangupButton
                class="button"
                icon="vc-icon-phone-down"
                color="destructive-actions"
                size="small"
                @click="onTerminateCall"
            />
            <!--            <ActionsButton @click="onActionsToggle" />-->
        </div>
    </div>
</template>
<script setup lang="ts">
import type { ICall } from 'opensips-js/src/types/rtc'
import CallButton from '@/components/phone/common/CallButton.vue'
import HangupButton from '@/components/phone/common/HangupButton.vue'
//import ActionsButton from '@/ui/phoneDialer/components/common/ActionsButton.vue'
import { useOpenSIPSJS } from '@/composables/opensipsjs.ts'
import { getTranslation } from '@/plugins/translator'
import useCallInfo from '@/composables/useCallInfo.ts'
//import { useIncomingCalls } from '@/ui/phoneDialer/composables/useIncomingCalls'

/* Data */
const { answerCall, terminateCall } = useOpenSIPSJS()
//const { onActionsCallChange, incomingCallActions } = useIncomingCalls()

/* Props */
type Props = {
    call: ICall
}
const props = defineProps<Props>()

/* Emit */
const emit = defineEmits<{
    (e: 'answer-call'): void
    (e: 'terminate-call'): void
}>()

/* Computed */
const { displayName } = useCallInfo(props.call)

/* Methods */
function onAnswerCall () {
    emit('answer-call')
    answerCall(props.call._id)
}
function onTerminateCall () {
    emit('terminate-call')
    terminateCall(props.call._id)
}

/* Methods */
// const onActionsToggle = () => {
//     const valueToPass = incomingCallActions.value ? null : {
//         call: props.call,
//         caller: caller.value
//     }
//     onActionsCallChange(valueToPass)
// }

</script>

<style lang="scss" scoped>
.incoming-call {
  transition: opacity 0.3s ease, visibility 0.3s ease;
  border-radius: 10px;
  border: 1px solid var(--ui-lines);
  background-color: var(--light-bg);
  box-shadow: 0px 4px 20px 0px var(--card-shadow-color);

  .caller {
    color: var(--default-text);
    line-height: 128.571%;
  }

  .title {
    color: var(--secondary);
    font-size: 11px;
    line-height: 145.455%;
    letter-spacing: 1.1px;
    text-transform: uppercase;
  }
  .button {
    width: 36px;
    height: 36px;
  }
}
</style>
