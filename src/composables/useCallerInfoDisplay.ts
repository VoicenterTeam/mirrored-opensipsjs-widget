import { computed, ref, watch } from 'vue'
import type { ICall } from 'opensips-js-vue'
import { useCallerInfo } from '@/composables/useCallerInfo'

/**
 * Composable for reactive caller info display in components
 * Provides computed properties that automatically resolve using custom resolver
 */
export function useCallerInfoDisplay (call: ICall | null) {
    const { getCallerDisplayName } = useCallerInfo()

    const resolvedDisplayName = ref<string>('')
    const isResolving = ref(false)

    // Extract phone number from call
    const phoneNumber = computed(() => {
        if (!call) return ''
        return call.remote_identity?.uri?.replace(/^sip:/, '').split('@')[0] || 'Unknown'
    })

    // Default display name from call object
    const defaultDisplayName = computed(() => {
        if (!call) return 'Unknown Caller'
        return call.remote_identity?.display_name || phoneNumber.value
    })

    // Resolved display name using custom resolver
    const displayName = computed(() => {
        return resolvedDisplayName.value || defaultDisplayName.value
    })

    // Watch for call changes and resolve caller info
    watch(
        () => call,
        async (newCall) => {
            console.log('[CallerInfoDisplay] Call changed:', newCall)
            if (!newCall) {
                resolvedDisplayName.value = ''
                return
            }

            isResolving.value = true
            try {
                console.log('[CallerInfoDisplay] Resolving display name for call:', newCall)
                const resolved = await getCallerDisplayName(newCall)
                console.log('[CallerInfoDisplay] Resolved display name:', resolved)
                resolvedDisplayName.value = resolved
            } catch (error) {
                console.warn('[CallerInfoDisplay] Failed to resolve caller info:', error)
                resolvedDisplayName.value = ''
            } finally {
                isResolving.value = false
            }
        },
        { immediate: true }
    )

    return {
        displayName,
        phoneNumber,
        defaultDisplayName,
        isResolving
    }
}

