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
import { registerOpenSIPS, useExternalOpenSIPSJS, isOpenSIPSReady } from '@/composables/opensipsjs'
import MediaDevicesSettings from '@/components/MediaDevicesSettings.vue'
import type { IWidgetAppProps } from '@/types/internal'
import type { IWidgetInitOptions } from '@/types/public-api'

// const { startCall } = useOpenSIPSJS()

// Props
const props = defineProps<IWidgetAppProps>()

// Methods
function onMouseDown (e: MouseEvent) {
    props.dragStart(e)
}

function makeCall (event: Event) {
    // event.preventDefault()
    // startCall('380937369802', false)
}
async function widgetReady ({ credentials, config }: IWidgetInitOptions) {
    if (!isOpenSIPSReady.value) {
        await registerOpenSIPS(credentials)
    }

    return useExternalOpenSIPSJS()
}

onMounted(() => {
    props.dispatchActionEvent(
        'widget:ready',
        widgetReady
    )
})
</script>
