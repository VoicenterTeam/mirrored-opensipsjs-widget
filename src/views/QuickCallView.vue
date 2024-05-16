<template>
    <div>
        <div v-show="!allActiveCalls.length">
            <Popper
                :show="showHintPopper"
                arrow
                @mouseover="showHintPopper = false"
            >
                <IncomingCallActionButton
                    color="success"
                    hover-color="additional-success-bg"
                    :icon="CallIcon"
                    :disabled="!isOpenSIPSInitialized"
                    size="xxxl"
                    @click="onCall"
                />
                <template #content>
                    <div className="flex flex-col items-center">
                        <div>We’re online!</div>
                        <div>Click to call us via browser</div>
                    </div>
                </template>
            </Popper>
        </div>
        <div v-show="allActiveCalls.length" className="shadow-xl rounded-md min-h-[40px] flex flex-row border overflow-hidden">
            <Draggable
                v-show="false"
                ref="draggableHandle"
            />
            <div>
                <QuickCallActiveView />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref, watchEffect } from 'vue'
import Popper from 'vue3-popper'
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
import { quickCallNumber } from '@/composables/useWidgetConfig'
import { setWidgetElement } from '@/composables/useWidgetState'
import OpenSIPSExternalWidgetAPI from '@/widget/OpenSIPSExternalWidgetAPI'
import type { IWidgetAppProps } from '@/types/internal'

/* Props */
const props = defineProps<IWidgetAppProps>()

/* Composable */
const {
    startCall,
} = useOpenSIPSJS()

/* Data */
const draggableHandle = ref<typeof Draggable>()
const showHintPopper = ref<boolean>(true)

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

onMounted(() => {
    const draggableRoot = draggableHandle.value?.root as HTMLElement | undefined

    setWidgetElement(props.widgetElement, draggableRoot)

    props.widgetElement.dispatchEvent('widget:ready', OpenSIPSExternalWidgetAPI)
})

onBeforeUnmount(() => {
    props.widgetElement.dispatchEvent('widget:destroy', undefined)
})
</script>
