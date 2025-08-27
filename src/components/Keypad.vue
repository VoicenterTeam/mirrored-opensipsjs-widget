<template>
    <div class="flex flex-col w-full items-center justify-center">
        <div
            v-if="showTitle"
            class="font-semibold mb-2"
        >
            {{ title }}
        </div>

        <div
            v-if="showInput"
            class="flex w-full"
        >
            <div class="w-full border border-border-lines rounded p-1 mr-1">
                <input
                    v-model="inputValue"
                    class="outline-0 w-full text-main-text text-sm pl-2 remove-arrow"
                    :placeholder="outgoingCallInputPlaceholder"
                    @input="applyPatterns"
                    @keyup.enter.prevent="onStartCall"
                >
            </div>
            <div>
                <ActionIconButton
                    icon="vc-icon-phone"
                    bg-color="success-actions"
                    color="white"
                    @click="onStartCall"
                />
            </div>
        </div>

        <div class="grid grid-cols-3 gap-2 max-w-[250px] mt-2">
            <div
                v-for="(button) in buttons"
                :key="button"
            >
                <div
                    class="flex items-center justify-center w-16 h-8 rounded border border-border-lines font-semibold
          hover:bg-primary hover:text-button-pressed-text hover:border-none cursor-pointer"
                    @click="onPress(button)"
                >
                    {{ button }}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { outgoingInputRegexValidator, outgoingCallInputPlaceholder } from '@/composables/useWidgetConfig'
import { getTranslation } from '@/plugins/translator'
import { useOpenSIPSJS } from '@/composables/opensipsjs'
import ActionIconButton from '@/components/base/ActionIconButton.vue'

const { setAutoAnswer } = useOpenSIPSJS()

const props = withDefaults(
    defineProps<{
        isNewCallType?: boolean
        isAddCallerType?: boolean
    }>(),
    {
        isNewCallType: false,
        isAddCallerType: false
    }
)

const emit = defineEmits<{
    (e: 'press', value: string): void
    (e: 'call', value: string): void
}>()

const buttons = [ '1', '2', '3', '4', '5', '6', '7', '8' ,'9', '*', '0', '#' ]

const inputValue = ref('')

const title = computed(() => {
    if (props.isNewCallType) {
        return getTranslation('audio.new.call')
    }

    if (props.isAddCallerType) {
        return getTranslation('audio.title.add.caller')
    }

    return ''
})

const showTitle = computed(() => {
    return props.isNewCallType || props.isAddCallerType
})

const showInput = computed(() => {
    return props.isNewCallType || props.isAddCallerType
})

const applyPatterns = (event: Event) => {
    const evt = event.target as HTMLInputElement
    let newInputValue = evt.value

    const regexPatterns = [ ...outgoingInputRegexValidator.value ]

    regexPatterns.forEach((pattern) => {
        const regexFromStr = new RegExp(pattern)
        if (!regexFromStr.test(newInputValue)) {
            newInputValue = newInputValue.replace(new RegExp(`[^${regexFromStr.source}]`, 'g'), '')
        }
    })

    inputValue.value = newInputValue
}

const onPress = (value: string) => {
    if (showInput.value) {
        inputValue.value = inputValue.value + value
        return
    }
    emit('press', value)
}

function onStartCall () {
    emit('call', inputValue.value)
    inputValue.value = ''
}

</script>

<style scoped>
.keypad_wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;         /* gap-2 → 0.5rem = 8px */
  max-width: 250px;    /* max-w-[250px] */
  padding: 0.25rem;    /* p-1 → 0.25rem = 4px */
}
</style>
