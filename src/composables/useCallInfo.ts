import { unref, computed } from 'vue'
import type { MaybeRef } from 'vue'
import type { ICall } from 'opensips-js/src/types/rtc'
import { getCallerNumber } from '@/helpers/callerHelper'
import { displayCallerInfoIdMask } from '@/composables/useWidgetConfig'

export default function useCallInfo (call: MaybeRef<ICall | undefined>) {
    const callerNumber = computed(() => {
        const cNumber = unref(call)?._remote_identity?._uri._user || '' as string

        return getCallerNumber(cNumber, displayCallerInfoIdMask.value)
    })

    const callerName = computed(() => {
        const cNumber = unref(call)?._remote_identity?._uri._user as string
        const cName = unref(call)?._remote_identity?._display_name || '' as string

        if (cName === cNumber) {
            return callerNumber.value
        }

        return cName
    })

    return {
        callerNumber,
        callerName,
    }
}
