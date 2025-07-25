<template>
    <div class="no-active-calls-view-wrapper w-full flex flex-col h-full">
        <SoundManager class="mb-3" />
        <div class="h-10 mb-3">
            <VcInput
                :model-value="phoneNumber"
                :placeholder="getTranslation('audio.type.number.uppercase')"
                clearable
                class="h-full"
                @update:modelValue="onNumberInput"
                @keyup.enter="initCall"
            />
        </div>
        <div class="mb-4 flex-1 flex justify-center">
            <Keypad />
        </div>
        <FooterBlock />
    </div>
</template>
<script lang="ts" setup>
import { usePhoneState } from '@/composables/phone/usePhoneState.ts'
import Keypad from '@/components/phone/common/KeyPad.vue'
import SoundManager from '@/components/phone/SoundManager.vue'
import FooterBlock from '@/components/phone/FooterBlock.vue'
import useCallActions from '@/composables/phone/useCallActions.ts'
import { getTranslation } from '@/plugins/translator'

/* Data */
const { phoneNumber, onNumberInput } = usePhoneState()
const { initCall } = useCallActions()

</script>
