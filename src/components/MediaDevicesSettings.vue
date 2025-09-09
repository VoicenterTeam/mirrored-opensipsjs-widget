<template>
    <div style="display: flex; flex-direction: column">
        <label>
            <div class="inline-block w-4 h-4 text-primary">
                <MicrophoneIcon />
            </div>
            {{ getTranslation('audio.input.device') }}
        </label>
        <select
            id="microphoneEl"
            v-model="activeInputDevice"
            @change="onMicrophoneChange"
        >
            <option
                v-for="(item, key) in inputDevicesList"
                :key="key"
                :value="item.deviceId"
            >
                {{ item.label }}
            </option>
        </select>
        <label>
            <div class="inline-block w-4 h-4 text-primary mt-2">
                <HeadphonesIcon />
            </div>
            {{ getTranslation('audio.output.device') }}
        </label>
        <select
            id="speakerEl"
            v-model="activeOutputDevice"
            @change="onSpeakerChange"
        >
            <option
                v-for="(item, key) in outputDevicesList"
                :key="key"
                :value="item.deviceId"
            >
                {{ item.label }}
            </option>
        </select>
    </div>
</template>
<script setup lang="ts">
import {
    activeInputDevice,
    inputDevicesList,
    activeOutputDevice,
    outputDevicesList,
    onMicrophoneChange,
    onSpeakerChange
} from '@/composables/opensipsjs'
import MicrophoneIcon from '@/assets/icons/mute.svg?component'
import HeadphonesIcon from '@/assets/icons/headphones.svg?component'
import { getTranslation } from '@/plugins/translator'
</script>
