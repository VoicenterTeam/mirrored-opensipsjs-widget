import type { MaybeRef } from 'vue'
import { computed, ref, unref, watch } from 'vue'
import type { ICall } from 'opensips-js/src/types/rtc'
import { getCallDisplayInfo, getCallerNumber, getCallerName } from '@/helpers/callerHelper'
import { useOpenSIPSJS } from '@/composables/opensipsjs.ts'
import { displayCallerInfoIdMask } from '@/composables/useWidgetConfig.ts'

const { getAudioState } = useOpenSIPSJS()
const { allActiveCalls } = getAudioState()

export default function useCallInfo (callData: MaybeRef<ICall | string | null | undefined>) {
    /* Data */
    const displayName = ref('')
    const displayNumber = ref('')

    /* Computed */
    const call = computed<ICall | undefined>(() => {
        const callDataUnref = unref(callData)

        return !callDataUnref
            ? undefined
            : typeof callDataUnref === 'string'
                ? allActiveCalls.value.find(c => c._id === callData)
                : callDataUnref
    })

    /**
     * Watch for call changes and resolve caller info
     */
    watch(
        call,
        async (newCall) => {
            if (!newCall) {
                return
            }

            displayName.value = getCallerName(newCall, displayCallerInfoIdMask.value)
            displayNumber.value = getCallerNumber(newCall, displayCallerInfoIdMask.value)

            const {
                displayNumber: resolvedDisplayNumber,
                displayName: resolvedDisplayName
            } = await getCallDisplayInfo(newCall)

            displayName.value = resolvedDisplayName
            displayNumber.value = resolvedDisplayNumber
        },
        {
            immediate: true
        }
    )

    return {
        displayName,
        displayNumber,
    }
}
