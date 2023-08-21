<template>
    <div :className="buttonWrapperClasses" @click="makeRoomActive">
        <span className="text-xs" >
            {{ props.roomId }}
        </span>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useOpenSIPSJS } from '@/composables/opensipsjs'

const { setActiveRoom } = useOpenSIPSJS()

const props = withDefaults(
    defineProps<{
        roomId: number
        isActive: boolean
        isWithBorder: boolean
        isMultiCallMode: boolean
    }>(),
    {}
)

const buttonWrapperClasses = computed(() => {
    let baseClasses = 'flex justify-center items-center px-2 w-[40px] cursor-pointer z-50 '

    if (props.isMultiCallMode) {
        baseClasses += 'h-[20px] '
    } else {
        baseClasses += 'h-[40px] '
    }

    if (props.isActive) {
        baseClasses += 'bg-primary text-button-pressed-text '
        return props.isWithBorder ? baseClasses + 'border-t border-t-border-lines' : baseClasses
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
