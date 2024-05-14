<template>
    <div>
        <div v-if="!allActiveCalls.length">
            <IncomingCallActionButton
                color="success"
                hover-color="additional-success-bg"
                :icon="CallIcon"
                :disabled="!isOpenSIPSInitialized"
                size="xxxl"
                @click="onCall"
            />
        </div>
        <div v-else className="shadow-xl rounded-md min-h-[40px] flex flex-row border overflow-hidden">
            <Draggable
                v-show="showDraggableHandle"
                ref="draggableHandle"
            />
            <div>
                <QuickCallActiveView />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, watchEffect } from 'vue'
import Draggable from '@/components/Draggable.vue'
import {
    isOpenSIPSReady,
    allActiveCalls,
    isOpenSIPSInitialized,
    useOpenSIPSJS,
    unregisterOpenSIPS,
    tryRegisterOpenSIPS,
} from '@/composables/opensipsjs'
import CallIcon from '@/assets/icons/call.svg?component'
import IncomingCallActionButton from '@/components/base/IncomingCallActionButton.vue'
import QuickCallActiveView from '@/views/QuickCallActiveView.vue'
import { layoutMode, quickCallNumber } from '@/composables/useWidgetConfig'

/* Composable */
const {
    startCall,
} = useOpenSIPSJS()

/* Computed */
const showDraggableHandle = computed(() => layoutMode.value === 'floating')

/* Methods */
function onCall () {
    if (!isOpenSIPSReady.value) {
        tryRegisterOpenSIPS()?.once(
            'ready',
            (value) => {
                if (value) {
                    startCall(quickCallNumber.value)
                }
            }
        )
    } else {
        startCall(quickCallNumber.value)
    }
}

/* Watch */
watchEffect(
    () => {
        if (!allActiveCalls.value.length) {
            unregisterOpenSIPS()
        }
    }
)
</script>
