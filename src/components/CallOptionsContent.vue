<template>
    <div className="">
        <ul>
            <li
                v-if="!props.isSingleRoom"
                className="h-8 cursor-pointer hover:bg-secondary-bg p-2"
                @click="onMoveClick"
            >
                <!--                <div className="inline-block">
                    <div className="w-4 h-4 text-primary">
                        <MoveToCallIcon />
                    </div>

                </div>-->
                <div className="inline-block w-3 h-3 text-primary">
                    <MoveToCallIcon />
                </div>

                <span className="text-xs mx-2">
                    {{ getTranslation('audio.move.call') }}
                </span>
            </li>
            <li
                v-if="allowTransfer"
                className="h-8 cursor-pointer hover:bg-secondary-bg p-2"
                @click="onTransferClick"
            >
                <div className="inline-block w-3 h-3 text-primary">
                    <TransferIcon />
                </div>
                <span className="text-xs mx-2">
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
