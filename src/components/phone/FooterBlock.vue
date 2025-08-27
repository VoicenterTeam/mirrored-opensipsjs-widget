<template>
    <div class="grid grid-cols-3">
        <div>
            <slot name="pv-bottom-left" />
        </div>

        <CallButton
            v-if="!isDtmf"
            class="mx-auto"
            @click="initCall"
        />

        <div>
            <slot name="pv-bottom-right" />
        </div>
    </div>
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
