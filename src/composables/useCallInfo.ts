import type { MaybeRef } from 'vue'
import { computed, ref, unref, watch } from 'vue'
import type { ICall } from 'opensips-js/src/types/rtc'
import { getCallerNumber } from '@/helpers/callerHelper'
import { displayCallerInfoIdMask } from '@/composables/useWidgetConfig'
import { useDisplayResolvers } from '@/composables/useDisplayResolvers.ts'
import { CallerInfoResolved } from '@/types/public-api'
import { getTranslation } from '@/plugins/translator.ts'

export default function useCallInfo (call: MaybeRef<ICall | undefined | null>) {
    const { getResolver } = useDisplayResolvers()

    /* Data */
    const resolvedDisplayInfo = ref<CallerInfoResolved>({
        name: '',
        number: ''
    })
    const isResolving = ref(false)

    /* Computed */
    /**
     * Caller number extracted from SIP URI
     */
    const callerNumber = computed(() => {
        const cNumber = unref(call)?._remote_identity?._uri._user || ''

        return getCallerNumber(cNumber, displayCallerInfoIdMask.value)
    })
    /**
     * Caller name as provided in the SIP From header
     */
    const callerName = computed(() => {
        const cNumber = unref(call)?._remote_identity?._uri._user
        const cName = unref(call)?._remote_identity?._display_name || ''

        if (cName === cNumber) {
            return callerNumber.value
        }

        return cName
    })
    /**
     * Default display name. Either caller name, or caller number, or "Unknown"
     */
    const defaultDisplayName = computed(() => {
        return callerName.value || callerNumber.value || getTranslation('audio.unknown')
    })
    /**
     * Final display name to show. Either resolved name, or default display name
     */
    const displayName = computed(() => {
        return resolvedDisplayInfo.value?.name || defaultDisplayName.value
    })
    /**
     * Final display number to show. Either resolved number, or caller number
     */
    const displayNumber = computed(() => {
        return resolvedDisplayInfo.value?.number || callerNumber.value
    })

    /**
     * Watch for call changes and resolve caller info
     */
    watch(
        () => call,
        async (newCall) => {
            const newCallNotRef = unref(newCall)

            if (!newCallNotRef) {
                resolvedDisplayInfo.value = {
                    name: '',
                    number: ''
                }
                return
            }

            isResolving.value = true

            try {
                const callerInfoResolver = getResolver('callerInfo')

                if (callerInfoResolver) {
                    try {
                        resolvedDisplayInfo.value = await callerInfoResolver(
                            newCallNotRef,
                            {
                                userPhone: callerNumber.value,
                                userName: callerName.value
                            }
                        )
                    } catch (error) {
                        console.warn('[CallerInfo] Failed to resolve caller info:', error)
                    }
                }
            } catch (error) {
                resolvedDisplayInfo.value = {
                    name: '',
                    number: ''
                }
            } finally {
                isResolving.value = false
            }
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
