import { onUnmounted, ref } from 'vue'
import { ringingSoundBase64 } from '@/composables/useWidgetConfig.ts'
import { defaultRingingSound } from '@/utils/ringingSound.ts'

export default function useRingingSound () {
    /* Data */
    const df = ref<DocumentFragment | undefined>()
    const soundEl = ref<HTMLAudioElement | undefined>()

    /* Methods */
    function playRingingSound (src: string) {
        df.value = document.createDocumentFragment()
        soundEl.value = new Audio(src)
        df.value.appendChild(soundEl.value) // keep in fragment until finished playing
        soundEl.value.addEventListener('ended', function () {
            // df.removeChild(snd)
            soundEl.value?.play()
        })
        soundEl.value.play()
        return soundEl.value
    }
    function stop () {
        if (soundEl.value) {
            soundEl.value?.pause()

            df.value?.removeChild(soundEl.value)

            soundEl.value = undefined
        }
    }
    function play () {
        if (ringingSoundBase64.value) {
            playRingingSound(ringingSoundBase64.value)
        } else {
            playRingingSound(defaultRingingSound)
        }
    }

    /* Lifecycle */
    onUnmounted(() => {
        stop()
    })

    return {
        play,
        stop
    }
}
