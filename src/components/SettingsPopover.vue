<template>
    <BasePopper class="--base-popper">
        <template #content>
            <div>
                {{ getTranslation('pages.settings.tooltip') }}
            </div>
        </template>
        <button>{{ getTranslation('common.settings') }}</button>
    </BasePopper>
</template>

<script lang="ts" setup>
import BasePopper from '@/components/base/BasePopper.vue'
import { getTranslation } from '@/plugins/translator'

</script>

<style scoped>

</style>
