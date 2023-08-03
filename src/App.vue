<template>
    <div className="shadow-xl rounded-md min-h-[60px] flex flex-row border overflow-hidden">
        <Draggable :dragStart="dragStart" />
        <WidgetContent />
    </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { registerOpenSIPS, useExternalOpenSIPSJS, isOpenSIPSReady } from '@/composables/opensipsjs'
import { setCallSettingsPermissions, setColorThemeSettings } from '@/composables/useCallSettingsPermissions'
import WidgetContent from '@/views/WidgetContent.vue'
import Draggable from '@/components/Draggable.vue'
import type { IWidgetAppProps } from '@/types/internal'
import type { IWidgetInitOptions } from '@/types/public-api'

// Props
const props = defineProps<IWidgetAppProps>()

// Methods

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
