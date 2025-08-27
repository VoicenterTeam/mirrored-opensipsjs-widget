<template>
    <div class="">
        <ul>
            <li
                v-if="!props.isSingleRoom"
                class="h-8 cursor-pointer hover:bg-secondary-bg p-2"
                @click="onMoveClick"
            >
                <!--                <div class="inline-block">
                    <div class="w-4 h-4 text-primary">
                        <MoveToCallIcon />
                    </div>

                </div>-->
                <div class="inline-block w-3 h-3 text-primary">
                    <MoveToCallIcon />
                </div>

                <span class="text-xs mx-2">
                    {{ getTranslation('audio.move.call') }}
                </span>
            </li>
            <li
                v-if="allowTransfer"
                class="h-8 cursor-pointer hover:bg-secondary-bg p-2"
                @click="onTransferClick"
            >
                <div class="inline-block w-3 h-3 text-primary">
                    <TransferIcon />
                </div>
                <span class="text-xs mx-2">
                    Transfer Call
                </span>
            </li>
        </ul>
    </div>
</template>

<script lang="ts" setup>
// import AutoAnswerIcon from '@/assets/icons/autoAnswer.svg?component'
import MoveToCallIcon from '@/assets/icons/moveToCall.svg?component'
import TransferIcon from '@/assets/icons/transfer.svg?component'

import { allowTransfer } from '@/composables/useWidgetConfig'
import { getTranslation } from '@/plugins/translator'

const props = withDefaults(
    defineProps<{
        isSingleRoom: boolean
    }>(),
    {}
)

const emit = defineEmits<{
    (e: 'transfer-click'): void
    (e: 'move-click'): void
}>()

const onTransferClick = () => {
    emit('transfer-click')
}

const onMoveClick = () => {
    emit('move-click')
}


</script>

<style scoped>

</style>
