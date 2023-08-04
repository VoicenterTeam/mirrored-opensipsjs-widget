<template>
    <div className="">
        <ul>
            <li className="h-8 cursor-pointer hover:bg-secondary-bg p-2" @click="onMoveClick">
                <!--                <div className="inline-block">
                    <div className="w-4 h-4 text-primary">
                        <MoveToCallIcon />
                    </div>

                </div>-->

                <span>
                    Move Call
                </span>

            </li>
            <li v-if="allowTransfer" className="h-8 cursor-pointer hover:bg-secondary-bg p-2" @click="onTransferClick" >
                <!--                <div className="inline-block w-4 h-4 text-primary">
                    <TransferIcon />
                </div>-->
                <span>
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

import { allowTransfer } from '@/composables/useCallSettingsPermissions'

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
