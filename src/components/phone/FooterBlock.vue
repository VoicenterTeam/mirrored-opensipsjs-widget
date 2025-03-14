<template>
    <CallButton
        v-if="!isDtmf"
        class="m-auto"
        @click="initCall"
    />
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import CallButton from '@/components/phone/common/CallButton.vue'
import useCallActions from '@/composables/phone/useCallActions.ts'
import { usePhoneState } from '@/composables/phone/usePhoneState.ts'
import { KeyPadTriggerObjectType } from '@/constants/phone.ts'

//import HangupButton from "@/components/phone/HangupButton.vue";

/* Data */
const { initCall } = useCallActions()
const { keyPadTrigger } = usePhoneState()


const isDtmf = computed(() => {
    return keyPadTrigger.value === KeyPadTriggerObjectType.keypad
})

</script>