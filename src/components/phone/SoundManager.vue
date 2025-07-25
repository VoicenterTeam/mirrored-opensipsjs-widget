<template>
    <div class="speaker-manager-wrapper flex items-center w-full gap-y-1">
        <SpeakerManager class="item" />
        <MuteManager
            class="item"
        />
        <DNDButton v-if="allowDNDSetup" />
        <VcPopover
            :teleported="false"
            triggers="click"
            placement="bottom"
            popover-width="350"
        >
            <template #reference>
                <VcButtonIcon
                    icon="vc-lc-settings"
                    type="outline"
                    color="primary"
                />
            </template>
            <div
                class="p-10"
            >
                <VcFormItem
                    :label="getTranslation('audio.speaker')"
                >
                    <VcSelect
                        v-model="outputMediaDeviceValue"
                        :teleported="false"
                        :options="getMediaDevicesList.outputMediaDevicesList"
                        :config="mediaConfigOptions"
                        class="mb-4"
                    />
                </VcFormItem>
                <VcFormItem
                    :label="getTranslation('audio.microphone')"
                >
                    <VcSelect
                        v-model="inputMediaDeviceValue"
                        :teleported="false"
                        :options="getMediaDevicesList.inputMediaDevicesList"
                        :config="mediaConfigOptions"
                    >
                        <template #option="{option}">
                            <InputDeviceOption
                                :key="option.deviceId"
                                :device-id="option.deviceId"
                                :label="option.label"
                                :active="option.deviceId === inputMediaDeviceValue"
                            />
                        </template>
                    </VcSelect>
                </VcFormItem>
            </div>
        </VcPopover>
    </div>
</template>
<script lang="ts" setup>
import SpeakerManager from '@/components/phone/SpeakerManager.vue'
import MuteManager from '@/components/phone/MuteManager.vue'
import InputDeviceOption from '@/components/phone/common/InputDeviceOption.vue'
import { getMediaDevicesList, outputMediaDeviceValue, inputMediaDeviceValue } from '@/composables/phone/useMediaDevices.ts'
import DNDButton from '@/components/phone/DNDButton.vue'
import { allowDNDSetup } from '@/composables/useWidgetConfig'
import { getTranslation } from '@/plugins/translator'

/* Data */
const  mediaConfigOptions = {
    labelKey: 'label',
    valueKey: 'deviceId',
    onclickFuncKey: 'func',
    searchKey: 'name',
}

</script>
<style lang="scss" scoped>
.speaker-manager-wrapper {
  column-gap: 15px;
  overflow: hidden;
  box-shadow: 0px 10px 20px -19px var(--card-shadow-color);
  border-bottom: 0.5px solid var(--ui-lines);
  .item {
    flex: 1 1 0;
    min-width: 0;
  }
}
</style>
