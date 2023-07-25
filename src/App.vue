<template>
    <div className="p-5 shadow-xl rounded-md relative border border-sky-500">
        <div className="absolute left-0 top-1/2 h-1/2 -translate-y-1/2 bg-black cursor-grab w-3" @mousedown="onMouseDown" />
        <div>
            <Phone v-show="!isSettingsPageOpened" />
            <Settings v-show="isSettingsPageOpened" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { registerOpenSIPS, useExternalOpenSIPSJS, isOpenSIPSReady } from '@/composables/opensipsjs'
import { setCallSettingsPermissions, setColorThemeSettings } from '@/composables/useCallSettingsPermissions'
import Phone from '@/pages/Phone.vue'
import Settings from '@/pages/Settings.vue'
import { isSettingsPageOpened } from '@/composables/useWidgetState'
import type { IWidgetAppProps } from '@/types/internal'
import type { IWidgetInitOptions } from '@/types/public-api'

// Props
const props = defineProps<IWidgetAppProps>()

// Methods
function onMouseDown (e: MouseEvent) {
    props.dragStart(e)
}

async function widgetReady ({ credentials, config }: IWidgetInitOptions) {
    if (!isOpenSIPSReady.value) {
        setCallSettingsPermissions(config.callSettings)
        setColorThemeSettings(config.themeSettings)
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
