import type { MaybeRef } from 'vue'
import { computed, ref, unref, watch } from 'vue'
import type { ICall } from 'opensips-js/src/types/rtc'
import { getCallDisplayInfo } from '@/helpers/callerHelper'
import { allActiveCalls } from '@/composables/opensipsjs.ts'

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
