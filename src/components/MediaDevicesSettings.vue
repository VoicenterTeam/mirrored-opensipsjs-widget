<template>
    <div>
        <select id="microphoneEl" v-model="activeInputDevice" @change="onMicrophoneChange">
            <option v-for="(item, key) in inputDevicesList" :key="key" :value="item.deviceId">
                {{ item.label }}
            </option>
        </select>
        <select id="speakerEl" v-model="activeOutputDevice" @change="onSpeakerChange">
            <option v-for="(item, key) in outputDevicesList" :key="key" :value="item.deviceId">
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

</script>