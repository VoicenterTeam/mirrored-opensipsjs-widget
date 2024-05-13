<template>
    <div>
        <div v-if="!isOpenSIPSReady">
            <IncomingCallActionButton
                color="success"
                hover-color="additional-success-bg"
                :icon="CallIcon"
                :disabled="false"
                size="xxxl"
                @click="onCall" />
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
import { computed } from 'vue'
import Draggable from '@/components/Draggable.vue'
import { isOpenSIPSReady } from '@/composables/opensipsjs'
import CallIcon from '@/assets/icons/call.svg?component'
import IncomingCallActionButton from '@/components/base/IncomingCallActionButton.vue'
import QuickCallActiveView from '@/views/QuickCallActiveView.vue'
import { layoutMode } from '@/composables/useWidgetConfig'

const emit = defineEmits([ 'call' ])

const showDraggableHandle = computed(() => layoutMode.value === 'floating')

const onCall = () => {
    emit('call')
}

</script>

<style scoped>

</style>
