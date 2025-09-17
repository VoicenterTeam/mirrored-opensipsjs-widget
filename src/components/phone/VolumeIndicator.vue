<template>
    <div id="agent-volume-level-wrapper">
        <canvas
            id="agent-volume-canvas"
            ref="volumeCanvasRef"
        />
    </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'

/* Props */
interface Props {
    stream: MediaStream | null
    barHeight: number
    barWidth: number
    sensitivity: number
}

const props = withDefaults(defineProps<Props>(), {
    barHeight: 2,
    barWidth: 100,
    sensitivity: 1
})

/* Data */
const volumeCanvasRef = ref<HTMLCanvasElement | null>(null)
let interval: number | undefined

/* Constants */
const BAR_WIDTH = 1.75
const BAR_HEIGHT = 7
const NUMBER_OF_BARS = 59
const BAR_SPACING = 2.5
const DEFAULT_BAR_COLOR = '#D5DBDF'

/* Utility Functions */
const drawBars = (
    canvasContext: CanvasRenderingContext2D,
    average: number,
    maxBarWidth: number,
    barColor: string
) => {
    canvasContext.clearRect(0, 0, maxBarWidth, BAR_HEIGHT)
    for (let i = 0; i < NUMBER_OF_BARS; i++) {
        const x = i * (BAR_WIDTH + BAR_SPACING)
        canvasContext.fillStyle = average > (i / NUMBER_OF_BARS) * maxBarWidth ? barColor : DEFAULT_BAR_COLOR
        canvasContext.fillRect(x, 0, BAR_WIDTH, BAR_HEIGHT)
    }
}

const initializeCanvas = (canvas: HTMLCanvasElement, width: number, height: number) => {
    canvas.width = width
    canvas.height = height
}

const resetCanvas = (canvasContext: CanvasRenderingContext2D) => {
    drawBars(canvasContext, 0, BAR_WIDTH * NUMBER_OF_BARS, '')
}

/* Methods */
const setupAudioProcessing = (stream: MediaStream) => {
    const audioContext = new AudioContext()
    const analyser = audioContext.createAnalyser()
    const microphone = audioContext.createMediaStreamSource(stream)
    const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1)

    analyser.smoothingTimeConstant = 0.8
    analyser.fftSize = 1024

    microphone.connect(analyser)
    analyser.connect(javascriptNode)
    javascriptNode.connect(audioContext.destination)

    return {
        analyser,
        audioContext
    }
}

const getVolumeLevelBar = (stream: MediaStream) => {
    clearInterval(interval)

    const { analyser, audioContext } = setupAudioProcessing(stream)

    const canvas = volumeCanvasRef.value
    if (!canvas) return

    initializeCanvas(canvas, props.barWidth, props.barHeight)

    const canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D
    const barColor = getComputedStyle(document.body).getPropertyValue('--primary')

    interval = window.setInterval(() => {
        const array = new Uint8Array(analyser.frequencyBinCount)
        analyser.getByteFrequencyData(array)
        const values = array.reduce((sum, value) => sum + value, 0)
        let average = (values / array.length) * props.sensitivity
        average = Math.min(average, props.barWidth)

        drawBars(canvasContext, average, props.barWidth, barColor)
    }, 50)

    return () => {
        clearInterval(interval)
        audioContext.close()
    }
}

const runIndicator = (): void => {
    const canvas = volumeCanvasRef.value
    if (!canvas) return

    initializeCanvas(canvas, props.barWidth, props.barHeight)

    const canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D

    if (props.stream && props.stream.getTracks().length) {
        getVolumeLevelBar(props.stream)
    } else {
        resetCanvas(canvasContext)
    }
}

/* Hooks */
onMounted(() => {
    runIndicator()
})

onUnmounted(() => {
    clearInterval(interval)
})

/* Watchers */
watch(() => props.stream, () => {
    runIndicator()
}, { deep: true })

</script>

<style scoped lang="scss">
</style>
