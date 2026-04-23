<template>
    <div
        id="agent-volume-level-wrapper"
        ref="wrapperRef"
        class="volume-indicator-wrapper"
    >
        <canvas
            id="agent-volume-canvas"
            ref="volumeCanvasRef"
            class="volume-indicator-canvas"
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
const wrapperRef = ref<HTMLElement | null>(null)
const volumeCanvasRef = ref<HTMLCanvasElement | null>(null)
let interval: number | undefined
let resizeObserver: ResizeObserver | undefined
let latestAverage = 0

/* Constants */
const BAR_WIDTH = 1.75
const BAR_HEIGHT = 7
const BAR_SPACING = 2.5
const BAR_STEP = BAR_WIDTH + BAR_SPACING
const MIN_NUMBER_OF_BARS = 4
const DEFAULT_BAR_COLOR = '#D5DBDF'

/* Utility Functions */
const getNumberOfBars = (canvasWidth: number): number => {
    return Math.max(MIN_NUMBER_OF_BARS, Math.floor(canvasWidth / BAR_STEP))
}

const drawBars = (
    canvasContext: CanvasRenderingContext2D,
    average: number,
    canvasWidth: number,
    barColor: string
) => {
    const numberOfBars = getNumberOfBars(canvasWidth)
    canvasContext.clearRect(0, 0, canvasWidth, BAR_HEIGHT)
    for (let i = 0; i < numberOfBars; i++) {
        const x = i * BAR_STEP
        canvasContext.fillStyle = average > (i / numberOfBars) * canvasWidth ? barColor : DEFAULT_BAR_COLOR
        canvasContext.fillRect(x, 0, BAR_WIDTH, BAR_HEIGHT)
    }
}

const initializeCanvas = (canvas: HTMLCanvasElement, width: number, height: number) => {
    canvas.width = Math.max(1, Math.floor(width))
    canvas.height = height
}

/* Methods */
const getCurrentCanvasWidth = (): number => {
    const wrapperWidth = wrapperRef.value?.clientWidth ?? props.barWidth
    return wrapperWidth || props.barWidth
}

const redraw = () => {
    const canvas = volumeCanvasRef.value
    if (!canvas) return

    const canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D | null
    if (!canvasContext) return

    const barColor = getComputedStyle(document.body).getPropertyValue('--primary') || ''
    drawBars(canvasContext, latestAverage, canvas.width, barColor)
}

const resizeCanvasToWrapper = () => {
    const canvas = volumeCanvasRef.value
    if (!canvas) return

    const targetWidth = getCurrentCanvasWidth()
    if (canvas.width !== Math.floor(targetWidth)) {
        initializeCanvas(canvas, targetWidth, props.barHeight)
    }
    redraw()
}

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

    interval = window.setInterval(() => {
        const array = new Uint8Array(analyser.frequencyBinCount)
        analyser.getByteFrequencyData(array)
        const values = array.reduce((sum, value) => sum + value, 0)
        let average = (values / array.length) * props.sensitivity
        average = Math.min(average, canvas.width)

        latestAverage = average
        redraw()
    }, 50)

    return () => {
        clearInterval(interval)
        audioContext.close()
    }
}

const runIndicator = (): void => {
    const canvas = volumeCanvasRef.value
    if (!canvas) return

    resizeCanvasToWrapper()

    if (props.stream && props.stream.getTracks().length) {
        getVolumeLevelBar(props.stream)
    } else {
        latestAverage = 0
        redraw()
    }
}

/* Hooks */
onMounted(() => {
    runIndicator()

    if (wrapperRef.value && typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(() => {
            resizeCanvasToWrapper()
        })
        resizeObserver.observe(wrapperRef.value)
    }
})

onUnmounted(() => {
    clearInterval(interval)
    resizeObserver?.disconnect()
    resizeObserver = undefined
})

/* Watchers */
watch(() => props.stream, () => {
    runIndicator()
}, { deep: true })

</script>

<style scoped lang="scss">
.volume-indicator-wrapper {
  min-width: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.volume-indicator-canvas {
  display: block;
}
</style>
