<template>
    <div :className="buttonWrapperClasses" @click="makeRoomActive">
        <span className="text-xxs" >
            Room {{ props.roomId }} {{currentActiveRoom}}
        </span>

    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { currentActiveRoom, useOpenSIPSJS } from '@/composables/opensipsjs'

const { setActiveRoom } = useOpenSIPSJS()

const props = withDefaults(
    defineProps<{
        roomId: number
    }>(),
    {}
)

const buttonWrapperClasses = computed(() => {
    const baseClasses = 'flex justify-center border-r border-b border-t items-center px-2 h-[40px] cursor-pointer z-50'

    if (props.roomId === currentActiveRoom.value) {
        return `${baseClasses} bg-primary text-button-pressed-text`
    } else {
        return `${baseClasses} b-secondary-bg`
    }
})

const makeRoomActive = () => {
    console.log('set', props.roomId, 'room active')
    setActiveRoom(props.roomId)
}
</script>

<style scoped>

</style>
