<template>
    <div className="p-5 shadow-xl rounded-md relative border border-sky-500">
        <MediaDevicesSettings />
        <button @click="makeCall">Call</button>
        <div className="absolute left-0 top-1/2 h-1/2 -translate-y-1/2 bg-black cursor-grab w-3" @mousedown="onMouseDown" />
        hello
    </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import type { IWidgetAppProps } from '@/types/main'
import { initializeOpenSIPSJS, useExternalOpenSIPSJS, useOpenSIPSJS } from '@/composables/opensipsjs'
import MediaDevicesSettings from '@/components/MediaDevicesSettings.vue'

const { startCall } = useOpenSIPSJS()

// Props
const props = defineProps<IWidgetAppProps>()

// Methods
function onMouseDown (e: MouseEvent) {
    props.dragStart(e)
}

function makeCall (event: Event) {
    event.preventDefault()
    startCall('380937369802', false)
}

onMounted(async () => {
    const opensips = await initializeOpenSIPSJS(props.credentials)

    //opensips.doCall({ target: '380937369802', addToCurrentRoom: false })

    const sipsPublic = useExternalOpenSIPSJS()

    props.dispatchActionEvent(
        'widget:ready',
        sipsPublic
    )
})
</script>
