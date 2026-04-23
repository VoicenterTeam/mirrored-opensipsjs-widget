<template>
    <div
        ref="keyPadRef"
        class="keypad-wrapper grid grid-cols-3 m-auto"
        :class="isCompactLayout ? 'gap-1 is-compact' : 'gap-2'"
    >
        <button
            v-for="(key, index) in keyPadConfig"
            :key="index"
            class="flex-col flex items-center justify-center"
            :class="isCompactLayout ? 'py-0' : 'py-1'"
            @click="onPhoneNumberInput(key.number)"
        >
            <div
                class="keypad-number font-semibold"
            >
                {{ key.number }}
            </div>
            <div
                v-if="key.letters"
                class="keypad-letters font-semibold inline-block text-secondary"
            >
                {{ key.letters }}
            </div>
        </button>
    </div>
</template>
<script lang="ts" setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { usePhoneState } from '@/composables/phone/usePhoneState.ts'
import { KeyPadTriggerObjectType, MAX_NUMBER_DTMF_INPUT_LENGTH, MAX_NUMBER_INPUT_LENGTH } from '@/constants/phone.ts'
import { useMainWrapperHeight } from '@/composables/phone/useMainWrapperHeight'
import { useOpenSIPSJS } from '@/composables/opensipsjs'
/* Data */
const { phoneNumber, keyPadTrigger, onPhoneNumberChange, onKeyPadToggle } = usePhoneState()
const { getAudioState } = useOpenSIPSJS()
const { activeRoomsWithoutIncoming } = getAudioState()
const keyPadConfig = [
    {
        id: 1,
        number: '1',
        letters: ''
    },
    {
        id: 2,
        number: '2',
        letters: 'abc'
    },
    {
        id: 3,
        number: '3',
        letters: 'def'
    },
    {
        id: 4,
        number: '4',
        letters: 'ghi'
    },
    {
        id: 5,
        number: '5',
        letters: 'jkl'
    },
    {
        id: 6,
        number: '6',
        letters: 'mno'
    },
    {
        id: 7,
        number: '7',
        letters: 'pqrs'
    },
    {
        id: 8,
        number: '8',
        letters: 'tuv'
    },
    {
        id: 9,
        number: '9',
        letters: 'wxyz'
    },
    {
        id: 10,
        number: '*',
        letters: ''
    },
    {
        id: 11,
        number: '0',
        letters: ''
    },
    {
        id: 12,
        number: '#',
        letters: ''
    }
]
const onPhoneNumberInput = (key: string) => {
    const limit = keyPadTrigger.value === KeyPadTriggerObjectType.keypad ?
        MAX_NUMBER_DTMF_INPUT_LENGTH: MAX_NUMBER_INPUT_LENGTH

    if (phoneNumber.value.length >= limit) {
        return
    }

    const updatedNumber = phoneNumber.value + key

    onPhoneNumberChange(updatedNumber)
}

const COMPACT_THRESHOLD_HEIGHT = 500

const keyPadRef = ref<HTMLElement | null>(null)
const { mainWrapperHeight } = useMainWrapperHeight(keyPadRef)

const hasActiveRooms = computed(() => activeRoomsWithoutIncoming.value.length > 0)

const isCompactLayout = computed(() => {
    const currentHeight = mainWrapperHeight.value
    const isShortWidget = !!currentHeight && currentHeight < COMPACT_THRESHOLD_HEIGHT
    return isShortWidget && hasActiveRooms.value
})

/* onBeforeUnmount  */
onBeforeUnmount (() => {
    onKeyPadToggle(undefined)
})
</script>
<style lang="scss" scoped>
.keypad-wrapper {
  button {
    border: 0.5px solid var(--ui-lines);
    min-height: 45px;
    min-width: 65px;

    &:hover {
      @apply bg-secondary-actions-bg--focus;
    }
    &:active {
      @apply bg-secondary-actions-bg--pressed;
    }
  }

  .keypad-number {
    font-size: 16px;
    line-height: 1.2;
  }
  .keypad-letters {
    font-size: 12px;
    line-height: 1.2;
  }

  &.is-compact {
    button {
      min-height: 34px;
    }
    .keypad-number {
      font-size: 13px;
    }
    .keypad-letters {
      font-size: 9px;
      letter-spacing: 0.3px;
    }
  }
}
</style>
