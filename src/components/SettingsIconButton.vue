<template>
    <div>
        <BasePopper v-model="isPopoverOpened">
            <template #content>
                <div>
                    <BaseSelect :options="[{label: 'Canada', code: 'ca'}]" />
                    <BaseInput v-model="model" /> {{ model }}
                </div>
            </template>

            <WidgetIconButton color="primary" :icon="SettingsIcon" @click="openSettingsPopover" />
        </BasePopper>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import WidgetIconButton from '@/components/base/WidgetIconButton.vue'
import SettingsIcon from '@/assets/icons/settings.svg?component'
import BasePopper from '@/components/base/BasePopper.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseInput from '@/components/base/BaseInput.vue'

const isPopoverOpened = ref(false)
const model = ref('')

const openSettingsPopover = () => {
    isPopoverOpened.value = !isPopoverOpened.value
}
</script>

<style scoped>

</style>
