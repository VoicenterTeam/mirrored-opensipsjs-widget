<template>
    <div class="flex h-full p-1.5">
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

<script lang="ts" setup>
import { getTranslation } from '@/plugins/translator'
import { allowShrinkOnIdle } from '@/composables/useWidgetConfig'

</script>

<style scoped>

</style>
