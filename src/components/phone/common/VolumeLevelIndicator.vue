<template>
    <span :id="`volume-level-${deviceId}`">
        <canvas
            :id="`canvas-${deviceId}`"
            class="volume-canvas"
        />
    </span>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
export default defineComponent({
    name: 'VolumeLevelIndicator',
    props: {
        stream: {
            type: Object as PropType<MediaStream | null>,
            required: true,
        },
        deviceId: {
            type: String,
            required: true
        },
        height: {
            type: Number,
            default: 20
        },
        lineWidth: {
            type: Number,
            default: 4
        }
    },
    data () {
        return {
            interval: undefined as number | undefined
        }
    },
    methods: {
        getMaxSmallIndicatorHeight (value: number) {
            const halfLineHeight = this.height / 4
            return value < halfLineHeight ? value : halfLineHeight
        },
        getVolumeLevelBar (stream: MediaStream, deviceId: string) {
            clearInterval(this.interval)
            const audioContext = new AudioContext()
            const analyser = audioContext.createAnalyser()
            const microphone = audioContext.createMediaStreamSource(stream)
            const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1)

            analyser.smoothingTimeConstant = 0.8
            analyser.fftSize = 1024

            microphone.connect(analyser)
            analyser.connect(javascriptNode)
            javascriptNode.connect(audioContext.destination)

            const canvas = document.getElementById(`canvas-${deviceId}`) as HTMLCanvasElement

            const indicatorWidth = this.lineWidth * 5
            const halfLineHeight = this.height / 2

            canvas.setAttribute('width', `${indicatorWidth}`)
            canvas.setAttribute('height', `${this.height}`)

            const canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D

            this.interval = window.setInterval(() => {
                const array = new Uint8Array(analyser.frequencyBinCount)
                analyser.getByteFrequencyData(array)
                let values = 0

                const length = array.length
                for (let i = 0; i < length; i++) {
                    values += (array[i])
                }

                const average = values / length

                canvasContext.fillStyle = getComputedStyle(document.body).getPropertyValue('--primary')
                const halfValue = average / 2
                canvasContext.clearRect(0, halfLineHeight, this.lineWidth, halfLineHeight)
                canvasContext.fillRect(0, halfLineHeight, this.lineWidth, this.getMaxSmallIndicatorHeight(halfValue))
                canvasContext.clearRect(0, halfLineHeight, this.lineWidth, -halfLineHeight)
                canvasContext.fillRect(0, halfLineHeight, this.lineWidth, 0 - this.getMaxSmallIndicatorHeight(halfValue))

                canvasContext.clearRect(this.lineWidth * 2, halfLineHeight, this.lineWidth, halfLineHeight)
                canvasContext.fillRect(this.lineWidth * 2, halfLineHeight, this.lineWidth, average)
                canvasContext.clearRect(this.lineWidth * 2, halfLineHeight, this.lineWidth, -halfLineHeight)
                canvasContext.fillRect(this.lineWidth * 2, halfLineHeight, this.lineWidth, 0 - average)

                canvasContext.clearRect(this.lineWidth * 4, halfLineHeight, this.lineWidth, halfLineHeight)
                canvasContext.fillRect(this.lineWidth * 4, halfLineHeight, this.lineWidth, this.getMaxSmallIndicatorHeight(halfValue))
                canvasContext.clearRect(this.lineWidth * 4, halfLineHeight, this.lineWidth, -halfLineHeight)
                canvasContext.fillRect(this.lineWidth * 4, halfLineHeight, this.lineWidth, 0 - this.getMaxSmallIndicatorHeight(halfValue))
            }, 50)
        },
        runIndicator () {
            if (this.stream?.getTracks().length) {
                this.getVolumeLevelBar(this.stream, this.deviceId)
            }
        }
    },
    watch: {
        stream: {
            deep: true,
            handler () {
                this.runIndicator()
            }
        }
    },
    mounted () {
        this.runIndicator()
    },
    unmounted () {
        clearInterval(this.interval)
    }
})
</script>

<style scoped lang="scss">
.volume-canvas {
  width: 100%;
  height: 100%;
}
</style>
