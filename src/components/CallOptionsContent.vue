<template>
    <div className="">
        <ul>
            <!--            <li className="h-8 cursor-pointer hover:bg-secondary-bg p-2" @click="onCallMove">
                <div className="inline-block">
                    <div className="w-4 h-4 text-primary">
                        <MoveToCallIcon />
                    </div>

                </div>

                <span>
                    Move the Call
                </span>

            </li>-->
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

import MuteIcon from '@/assets/icons/mute.svg?component'
import { allowTransfer } from '@/composables/useCallSettingsPermissions'

const emit = defineEmits<{
    (e: 'transfer-click'): void
}>()

const onCallMove = () => {
    console.log('move')
}
const onTransferClick = () => {
    emit('transfer-click')
    console.log('transfer')

}


</script>

<style scoped>

</style>
