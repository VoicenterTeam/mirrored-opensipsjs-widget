<template>
    <div className="flex min-h-[60px] justify-around items-center">
        <div>
            {{ callerNumber }}
        </div>
        <div>
            <IncomingCallActionButton
                color="success"
                hover-color="additional-success-bg"
                :icon="CallIcon"
                size="xxxl"
                @click="answerIncomingCall" />
            <IncomingCallActionButton
                color="danger"
                hover-color="additional-danger-bg"
                :icon="DeclineIcon"
                size="xxxl"
                additional-classes=""
                @click="declineIncomingCall" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { UnwrapRef } from 'vue'
import CallIcon from '@/assets/icons/call.svg?component'
import DeclineIcon from '@/assets/icons/decline.svg?component'
import IncomingCallActionButton from '@/components/base/IncomingCallActionButton.vue'
import type { ICall } from '@voicenter-team/opensips-js/src/types/rtc'
import { useOpenSIPSJS } from '@/composables/opensipsjs'
import { computed } from 'vue'
import { getCallerInfo } from '@/helpers/callerHelper'
import { displayCallerInfoName, displayCallerInfoIdMask } from '@/composables/useCallSettingsPermissions'

const { answerCall, terminateCall } = useOpenSIPSJS()

const props = withDefaults(
    defineProps<{
        call: UnwrapRef<ICall>
    }>(),
    {}
)

const answerIncomingCall = () => {
    answerCall(props.call._id)

}

const declineIncomingCall = () => {
    terminateCall(props.call._id)
}

const callerNumber = computed(() => {
    const cNumber = props.call?._remote_identity._uri._user as string
    const cName = props.call?._remote_identity._display_name as string
    return getCallerInfo(cNumber, cName, displayCallerInfoName.value, displayCallerInfoIdMask.value)
})

</script>

<style scoped>

</style>
