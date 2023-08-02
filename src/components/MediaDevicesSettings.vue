<template>
    <div style="display: flex; flex-direction: column">
        <label>
            <div className="inline-block w-4 h-4 text-primary">
                <MicrophoneIcon />
            </div>
            Input device
        </label>
        <select id="microphoneEl" v-model="activeInputDevice" @change="onMicrophoneChange">
            <option v-for="(item, key) in inputDevicesList" :key="key" :value="item.deviceId">
                {{ item.label }}
            </option>
        </select>
        <label>
            <div className="inline-block w-4 h-4 text-primary mt-2">
                <HeadphonesIcon />
            </div>
            Output device
        </label>
        <select id="speakerEl" v-model="activeOutputDevice" @change="onSpeakerChange">
            <option v-for="(item, key) in outputDevicesList" :key="key" :value="item.deviceId">
                {{ item.label }}
            </option>
        </select>
        <!--        <label>
            <div className="inline-block w-4 h-4 text-primary mt-2">
                <SoundOnIcon />
            </div>
            Ringing device
        </label>
        <select id="ringingEl" v-model="activeRingingDevice">
            <option v-for="(item, key) in ringingDevicesList" :key="key" :value="item.deviceId">
                {{ item.label }}
            </option>
        </select>-->
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import {
    activeInputDevice,
    inputDevicesList,
    activeOutputDevice,
    outputDevicesList,
    ringingDevicesList,
    activeRingingDevice,
    onMicrophoneChange,
    onSpeakerChange
} from '@/composables/opensipsjs'
import MicrophoneIcon from '@/assets/icons/mute.svg?component'
import HeadphonesIcon from '@/assets/icons/headphones.svg?component'
import SoundOnIcon from '@/assets/icons/soundOn.svg?component'

</script>
