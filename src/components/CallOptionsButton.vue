<template>
    <div class="call-options_wrapper">
        <VcPopover
            v-model="isPopoverOpened"
            :teleported="false"
            :popover-width="100"
            :triggers="['click', 'touch']"
            placement="top"
        >
            <template #reference>
                <OptionActionButton
                    icon="vc-lc-ellipsis-vertical"
                    @click="openOptionsPopover"
                />
            </template>

            <div>
                <div
                    v-for="(option, index) in options"
                    :key="index"
                    class="flex items-center px-2 py-1 cursor-pointer"
                    :class="{'border-b border-border-lines': index !== options.length - 1}"
                    @click="option.callback"
                >
                    <i
                        :class="option.iconClass"
                        class="text-lg mr-2"
                    />

                    <div>
                        {{ option.label }}
                    </div>
                </div>
            </div>
        </VcPopover>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { VcPopover } from '@voicenter-team/voicenter-ui-plus'
import type { ICall } from 'opensips-js/src/types/rtc'
import OptionActionButton from '@/components/base/OptionActionButton.vue'
import { useOpenSIPSJS } from '@/composables/opensipsjs'

const { getAudioState } = useOpenSIPSJS()
const { allRooms } = getAudioState()

const props = withDefaults(
    defineProps<{
        call: ICall,
        isOnLocalHold: boolean
    }>(),
    {
        isOnLocalHold: false
    }
)

const emit = defineEmits<{
    (e: 'move'): void,
    (e: 'transfer'): void,
    (e: 'hold'): void,
    (e: 'unhold'): void
}>()

const isPopoverOpened = ref(false)

const options = computed(() => {
    const baseOptions = [
        {
            label: 'Transfer',
            iconClass: 'vc-lc-redo-2 text-primary-actions',
            callback: onTransfer
        }
    ]

    if (allRooms.value.length > 1) {
        baseOptions.unshift({
            label: 'Move',
            iconClass: 'vc-lc-arrow-down-up text-primary-actions',
            callback: onMove
        })
    }

    if (props.isOnLocalHold) {
        baseOptions.push({
            label: 'Unhold',
            iconClass: 'vc-lc-step-forward text-primary-actions',
            callback: onUnhold
        })
    } else {
        baseOptions.push({
            label: 'Hold',
            iconClass: 'vc-lc-circle-pause text-primary-actions',
            callback: onHold
        })
    }

    return baseOptions
})

function openOptionsPopover () {
    isPopoverOpened.value = !isPopoverOpened.value
}

function onMove () {
    emit('move')
}

function onTransfer () {
    emit('transfer')
}

function onHold () {
    emit('hold')
}

function onUnhold () {
    emit('unhold')
}
</script>

<style scoped>
.call-options_wrapper :deep(.el-popover.el-popper) {
  min-width: 100px;
}
</style>
