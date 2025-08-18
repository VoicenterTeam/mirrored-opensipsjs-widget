<template>
    <div class="flex justify-between">
        <!--        <CallControlButton-->
        <!--            v-if="isRecording"-->
        <!--            src="vc-icon-record"-->
        <!--            upper-case-->
        <!--            type="redButton"-->
        <!--            :name="getTranslation('dialPad.stop.record.button')"-->
        <!--            :disabled="isAnyCallOnHold"-->
        <!--            @click="updateCallRecordsState(false)"-->
        <!--        />-->
        <CallActionButton
            type="whiteButton"
            src="vc-icon-record"
            upper-case
            :disabled="true"
            :name="getTranslation('audio.record')"
        />
        <HangupButton @click="endCall" />
        <CallActionButton
            type="whiteButton"
            upper-case
            src="vc-lc-ellipsis-vertical"
            :name="getTranslation('audio.actions')"
            @click="onActionsClick"
        />
    </div>
</template>
<script setup lang="ts">
import HangupButton from '@/components/phone/common/HangupButton.vue'
import { useVsipInject } from '@/composables/phone/useVsipProvideInject.ts'
import { useOpenSIPSJS } from '@/composables/opensipsjs.ts'
import { ActionsTriggerObjectType } from '@/constants/phone.ts'
import CallActionButton from '@/components/phone/activeCallsView/CallActionButton.vue'
import useCallActions from '@/composables/phone/useCallActions.ts'
import { getTranslation } from '@/plugins/translator.ts'

/* Data */
const { callsInActiveRoom } = useVsipInject()
const { terminateCall } = useOpenSIPSJS()
const { onActionsToggle } = useCallActions()

/* Methods */
const endCall = () => {
    callsInActiveRoom.value.forEach(call => terminateCall(call._id))
}
const onActionsClick = () => {
    const initiator = callsInActiveRoom.value.length === 1 ? ActionsTriggerObjectType.single : ActionsTriggerObjectType.multiple
    const callId = callsInActiveRoom.value.length === 1 ? callsInActiveRoom.value[0]._id : ActionsTriggerObjectType.multiple

    onActionsToggle({
        initiator,
        callId
    })
}
</script>
