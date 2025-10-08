<template>
    <div
        :class="buttonWrapperClasses"
        @click="makeRoomActive"
    >
        <span class="text-xs">
            {{ props.roomId }}
        </span>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useOpenSIPSJS } from '@/composables/opensipsjs'

const { getAudioApi } = useOpenSIPSJS()
const { setActiveRoom } = getAudioApi()

const props = withDefaults(
    defineProps<{
        roomId: number
        isActive: boolean
        isMultiCallMode: boolean
        callsInActiveRoomLength: number
        roomsLength: number
        index: number
    }>(),
    {}
)

const isWithBorder = computed(() => {
    if (props.callsInActiveRoomLength > props.roomsLength) {
        return props.index + 1 < props.callsInActiveRoomLength
    } else if (props.callsInActiveRoomLength < props.roomsLength) {
        return props.index < props.callsInActiveRoomLength
    } else {
        return props.index + 1 < props.callsInActiveRoomLength
    }
})

const buttonWrapperClasses = computed(() => {
    let baseClasses = 'flex justify-center items-center px-2 w-[40px] cursor-pointer z-50 '

    if (props.isMultiCallMode) {
        baseClasses += 'h-[20px] '
    } else {
        baseClasses += 'h-[40px] '
    }

    if (props.isActive) {
        baseClasses += 'bg-primary text-button-pressed-text '
        return isWithBorder.value ? baseClasses + 'border-t border-t-border-lines' : baseClasses
    } else {
        return baseClasses + 'bg-secondary-bg border-b border-t border-primary-bg '
    }
})

const makeRoomActive = () => {
    setActiveRoom(props.roomId)
}
</script>

<style scoped>

</style>
