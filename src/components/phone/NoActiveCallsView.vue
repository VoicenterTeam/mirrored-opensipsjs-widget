<template>
    <div
        ref="noActiveCallsViewRef"
        class="no-active-calls-view-wrapper w-full flex flex-col h-full"
    >
        <SoundManager :class="isXsLayout ? 'mb-1' : 'mb-2'" />
        <div :class="inputWrapperClass">
            <VcInput
                :model-value="phoneNumber"
                :placeholder="getTranslation('audio.type.number.uppercase')"
                clearable
                class="h-full"
                @update:modelValue="onNumberInput"
                @keyup.enter="initCall"
            />
        </div>
        <div
            class="flex-1 flex justify-center min-h-0"
            :class="isXsLayout ? 'mb-1' : 'mb-3'"
        >
            <Keypad />
        </div>
        <FooterBlock class="shrink-0">
            <template #pv-bottom-left>
                <slot name="pv-bottom-left" />
            </template>
            <template #pv-bottom-right>
                <slot name="pv-bottom-right" />
            </template>
        </FooterBlock>
    </div>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'
import { usePhoneState } from '@/composables/phone/usePhoneState.ts'
import Keypad from '@/components/phone/common/KeyPad.vue'
import SoundManager from '@/components/phone/SoundManager.vue'
import FooterBlock from '@/components/phone/FooterBlock.vue'
import useCallActions from '@/composables/phone/useCallActions.ts'
import { useMainWrapperHeight } from '@/composables/phone/useMainWrapperHeight'
import { getTranslation } from '@/plugins/translator'

/* Data */
const { phoneNumber, onNumberInput } = usePhoneState()
const { initCall } = useCallActions()

const noActiveCallsViewRef = ref<HTMLElement | null>(null)
const { isXsLayout } = useMainWrapperHeight(noActiveCallsViewRef)

const inputWrapperClass = computed(() =>
    isXsLayout.value ? 'h-8 mb-1' : 'h-10 mb-2'
)
</script>
