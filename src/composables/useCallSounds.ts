import { onDialSound, hangupSound, autoAnswerBeepSound } from '@/constants/callSounds'

/**
 * Composable for playing call-related sounds (OnDial, Hangup, AutoAnswerBeep)
 * 
 * These sounds play once (not looping) through the ringing device.
 * Each sound auto-cleans up after playback completes.
 */
export default function useCallSounds() {
    /**
     * Play a sound once through the ringing device
     * @param src - Base64 encoded audio source
     */
    function playSound(src: string): void {
        try {
            const soundEl = new Audio(src)
            
            // Auto-cleanup after playback completes
            soundEl.addEventListener('ended', function() {
                soundEl.remove()
            })
            
            // Also cleanup on error
            soundEl.addEventListener('error', function(e) {
                console.error('Error playing call sound:', e)
                soundEl.remove()
            })
            
            // Play the sound
            soundEl.play().catch((error) => {
                console.error('Failed to play call sound:', error)
            })
        } catch (error) {
            console.error('Error creating call sound:', error)
        }
    }

    /**
     * Play the OnDial sound when initiating an outgoing call
     */
    function playOnDialSound(): void {
        playSound(onDialSound)
    }

    /**
     * Play the Hangup sound when a call is terminated
     */
    function playHangupSound(): void {
        playSound(hangupSound)
    }

    /**
     * Play the AutoAnswerBeep sound when answering a call
     */
    function playAnswerBeepSound(): void {
        playSound(autoAnswerBeepSound)
    }

    return {
        playOnDialSound,
        playHangupSound,
        playAnswerBeepSound
    }
}


