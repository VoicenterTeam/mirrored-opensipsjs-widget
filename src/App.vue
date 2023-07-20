<template>
    <div className="p-5 shadow-xl rounded-md relative border border-sky-500">
        <div className="absolute left-0 top-1/2 h-1/2 -translate-y-1/2 bg-black cursor-grab w-3" @mousedown="onMouseDown" />
        hello
    </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import type { IWidgetAppProps } from '@/types/main'
import { initializeOpenSIPSJS, useExternalOpenSIPSJS } from '@/composables/opensipsjs'

// Props
const props = defineProps<IWidgetAppProps>()

// Methods
function onMouseDown (e: MouseEvent) {
    props.dragStart(e)
}

onMounted(async () => {
    const opensips = await initializeOpenSIPSJS(props.credentials)

    opensips.doCall({ target: '380937019064', addToCurrentRoom: false })

    const sipsPublic = useExternalOpenSIPSJS()

    props.dispatchActionEvent(
        'widget:ready',
        sipsPublic
    )
})
</script>
