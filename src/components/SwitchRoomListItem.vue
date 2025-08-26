<template>
    <div class="flex justify-between items-center h-10 p-1">
        <div class="flex">
            <OptionActionButton
                v-if="isActive"
                icon="vc-lc-circle-pause"
                size="2xl"
                @click="onExitRoom"
            />
            <OptionActionButton
                v-else
                icon="vc-lc-log-in"
                size="2xl"
                @click="onSwitchRoom"
            />
            <div
                class="pl-2 truncate"
                style="max-width: 200px;"
            >
                {{ identifier }}
            </div>
        </div>

        <div class="flex">
            <div className="flex items-center mx-2 w-[46px]">
                <span className="text-xs text-main-text">
                    {{ callTime }}
                </span>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { callTimes } from '@/composables/opensipsjs'
import { getFormattedTimeFromSeconds } from '@/helpers/timeHelper'
import OptionActionButton from '@/components/base/OptionActionButton.vue'

const props = withDefaults(
    defineProps<{
        roomId: number
        isActive: boolean
        identifier: string
        oldestCallId: string
    }>(),
    {}
)

const emit = defineEmits<{
    (e: 'transfer-click', callId: string): void
    (e: 'move-click', callId: string): void
    (e: 'open-room-list'): void
    (e: 'switch-room'): void
    (e: 'exit-room'): void
}>()

const callTime = computed(() => {
    const time = callTimes.value[props.oldestCallId]
    return getFormattedTimeFromSeconds(time)
})

function onExitRoom () {
    emit('exit-room')
}

function onSwitchRoom () {
    emit('switch-room')
}

</script>

<style scoped>

</style>
