<template>
    <span :id="`volume-level-${deviceId}`">
        <canvas
            :id="`canvas-${deviceId}`" 
            ref="canvas"
            class="volume-canvas"
        />
    </span>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, defineProps } from 'vue'

//* Props *//
interface Props {
    stream: MediaStream | null,
    deviceId: string,
    height?: number,
    lineWidth?:number
}
const props = withDefaults(
    defineProps<Props>(),
    {
        height: 20,
        lineWidth: 4,
    }
)

// Reactive state
const interval = ref<number | undefined>(undefined)


const canvas = ref<HTMLCanvasElement | null>(null)

// Helper functions
const getMaxSmallIndicatorHeight = (value: number) => {
    const halfLineHeight = props.height / 4
    return value < halfLineHeight ? value : halfLineHeight
}

const getVolumeLevelBar = (stream: MediaStream) => {
    if (interval.value) {
        clearInterval(interval.value)
    }
    const audioContext = new AudioContext()
    const analyser = audioContext.createAnalyser()
    const microphone = audioContext.createMediaStreamSource(stream)
    const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1)

    analyser.smoothingTimeConstant = 0.8
    analyser.fftSize = 1024

    microphone.connect(analyser)
    analyser.connect(javascriptNode)
    javascriptNode.connect(audioContext.destination)

    // Make sure the canvas ref is not null before accessing it
    if (canvas.value) {
        const indicatorWidth = props.lineWidth * 5
        const halfLineHeight = props.height / 2

        canvas.value.setAttribute('width', `${indicatorWidth}`)
        canvas.value.setAttribute('height', `${props.height}`)

        const canvasContext = canvas.value.getContext('2d') as CanvasRenderingContext2D

        interval.value = window.setInterval(() => {
            const array = new Uint8Array(analyser.frequencyBinCount)
            analyser.getByteFrequencyData(array)
            let values = 0

            for (let i = 0; i < array.length; i++) {
                values += array[i]
            }

            const average = values / array.length
            const halfValue = average / 2

            canvasContext.fillStyle = getComputedStyle(document.body).getPropertyValue('--primary')
            canvasContext.clearRect(0, halfLineHeight, props.lineWidth, halfLineHeight)
            canvasContext.fillRect(0, halfLineHeight, props.lineWidth, getMaxSmallIndicatorHeight(halfValue))
            canvasContext.clearRect(0, halfLineHeight, props.lineWidth, -halfLineHeight)
            canvasContext.fillRect(0, halfLineHeight, props.lineWidth, 0 - getMaxSmallIndicatorHeight(halfValue))

            canvasContext.clearRect(props.lineWidth * 2, halfLineHeight, props.lineWidth, halfLineHeight)
            canvasContext.fillRect(props.lineWidth * 2, halfLineHeight, props.lineWidth, average)
            canvasContext.clearRect(props.lineWidth * 2, halfLineHeight, props.lineWidth, -halfLineHeight)
            canvasContext.fillRect(props.lineWidth * 2, halfLineHeight, props.lineWidth, 0 - average)

            canvasContext.clearRect(props.lineWidth * 4, halfLineHeight, props.lineWidth, halfLineHeight)
            canvasContext.fillRect(props.lineWidth * 4, halfLineHeight, props.lineWidth, getMaxSmallIndicatorHeight(halfValue))
            canvasContext.clearRect(props.lineWidth * 4, halfLineHeight, props.lineWidth, -halfLineHeight)
            canvasContext.fillRect(props.lineWidth * 4, halfLineHeight, props.lineWidth, 0 - getMaxSmallIndicatorHeight(halfValue))
        }, 50)
    }
}

const runIndicator = () => {
    if (props.stream?.getTracks().length) {
        getVolumeLevelBar(props.stream)
    }
}

// Watchers
watch(
    () => props.stream,
    () => {
        runIndicator()
    },
    { deep: true }
)

// Lifecycle hooks
onMounted(() => {
    runIndicator()
})

onBeforeUnmount(() => {
    if (interval.value) {
        clearInterval(interval.value)
    }
})
</script>

<style scoped lang="scss">
.volume-canvas {
  width: 100%;
  height: 100%;
}
</style>
