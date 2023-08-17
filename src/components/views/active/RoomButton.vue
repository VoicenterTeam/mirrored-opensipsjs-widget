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
    }>(),
    {}
)

const buttonWrapperClasses = computed(() => {
    const baseClasses = 'flex justify-center items-center px-2 h-[40px] w-[40px] cursor-pointer z-50 '

    if (props.isActive) {
        return baseClasses + 'bg-primary text-button-pressed-text'
    } else {
        return baseClasses + 'bg-secondary-bg border-primary-bg border-b border-t'
    }
})

const makeRoomActive = () => {
    setActiveRoom(props.roomId)
}
</script>

<style scoped>

</style>
