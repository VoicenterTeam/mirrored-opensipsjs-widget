<template>
    <div class="keypad-wrapper grid grid-cols-3 gap-2 m-auto">
        <button
            v-for="(key, index) in keyPadConfig"
            :key="index"
            class="flex-col flex items-center justify-center py-1"
            @click="onPhoneNumberInput(key.number)"
        >
            <div class="font-semibold">
                {{ key.number }}
            </div>
            <div
                v-if="key.letters"
                class="text-xs font-semibold inline-block text-secondary"
            >
                {{ key.letters }}
            </div>
        </button>
    </div>
</template>
<script lang="ts" setup>
import { onBeforeUnmount } from 'vue'
import { usePhoneState } from '@/composables/phone/usePhoneState.ts'
import { MAX_NUMBER_INPUT_LENGTH } from '@/constants/phone.ts'
/* Data */
const { phoneNumber, onPhoneNumberChange, onKeyPadToggle } = usePhoneState()
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

    if (phoneNumber.value.length >= MAX_NUMBER_INPUT_LENGTH) {
        return
    }

    const updatedNumber = phoneNumber.value + key

    onPhoneNumberChange(updatedNumber)
}

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
    min-width: 85px;

    &:hover {
      @apply bg-secondary-actions-bg--focus;
    }
    &:active {
      @apply bg-secondary-actions-bg--pressed;
    }
  }
}
</style>