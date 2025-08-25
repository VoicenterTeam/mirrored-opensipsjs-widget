<template>
    <div className="flex h-full p-1.5">
        <div class="flex items-center bg-destructive-actions-bg--focus rounded-md p-1">
            <i
                v-if="!allowShrinkOnIdle"
                class="vc-lc-server-crash text-base text-destructive-actions p-1"
            />
            <div class="text-center text-xs text-destructive-actions pr-1">
                {{ getTranslation('audio.lost.connection.to.server') }}
            </div>
        </div>
    </div>
</template>

<!--
<i class="vc-lc-arrow-right-left text-base" />
            <span class="context uppercase whitespace-nowrap">{{ getTranslation('audio.manage.calls') }}</span>
-->

<script lang="ts" setup>
import { computed } from 'vue'
import ConnectToServerIcon from '@/assets/icons/connectToServer.svg?component'
import { getTranslation } from '@/plugins/translator'
import { allowShrinkOnIdle } from '@/composables/useWidgetConfig'

const messageFontClasses = computed(() => {
    if (allowShrinkOnIdle.value) {
        return 'max-w-[120px] text-xxs p-2'
    } else {
        return 'text-sm p-3'
    }
})
</script>

<style scoped>

</style>
