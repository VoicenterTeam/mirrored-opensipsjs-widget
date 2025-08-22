import { ref } from 'vue'
import type { ICall } from 'opensips-js-vue'
import type { IDisplayResolvers } from '@/types/public-api'

interface ICallerInfo {
    displayName: string
    phoneNumber: string
}

// Generic display resolvers storage
const displayResolvers = ref<Partial<IDisplayResolvers>>({})

/**
 * Composable for managing display resolvers
 * Provides a generic system for customizing widget display elements
 */
export function useDisplayResolvers () {
    function setResolver<K extends keyof IDisplayResolvers> (
        type: K,
        resolver: IDisplayResolvers[K] | null
    ): void {
        console.log('[DisplayResolvers] Setting resolver for type:', type, 'resolver:', !!resolver)
        if (resolver === null) {
            delete displayResolvers.value[type]
            console.log('[DisplayResolvers] Removed resolver for type:', type)
        } else {
            displayResolvers.value[type] = resolver
            console.log('[DisplayResolvers] Set resolver for type:', type, 'current resolvers:', Object.keys(displayResolvers.value))
        }
    }

    function setResolvers (resolvers: Partial<IDisplayResolvers>): void {
        displayResolvers.value = {
            ...displayResolvers.value,
            ...resolvers
        }
    }

    function getResolver<K extends keyof IDisplayResolvers> (type: K): IDisplayResolvers[K] | null {
        const resolver = displayResolvers.value[type] || null
        console.log('[DisplayResolvers] Getting resolver for type:', type, 'found:', !!resolver, 'available resolvers:', Object.keys(displayResolvers.value))
        return resolver
    }

    function hasResolver (type: keyof IDisplayResolvers): boolean {
        return displayResolvers.value[type] !== undefined
    }

    function clearResolver (type: keyof IDisplayResolvers): void {
        delete displayResolvers.value[type]
    }

    function clearAll (): void {
        displayResolvers.value = {}
    }

    return {
        setResolver,
        setResolvers,
        getResolver,
        hasResolver,
        clearResolver,
        clearAll
    }
}

/**
 * Composable for caller information (uses the generic display resolver system)
 */
export function useCallerInfo () {
    const { getResolver } = useDisplayResolvers()

    async function resolveCallerInfo (call: ICall): Promise<ICallerInfo> {
        // Extract default values
        const phoneNumber = call.remote_identity?.uri?.replace(/^sip:/, '').split('@')[0] || 'Unknown'
        let displayName = call.remote_identity?.display_name || phoneNumber

        // Use custom resolver if available - pass the entire call object
        const callerInfoResolver = getResolver('callerInfo')
        if (callerInfoResolver) {
            try {
                console.log('[CallerInfo] Calling resolver with call object:', call)
                const resolved = await callerInfoResolver(call)
                console.log('[CallerInfo] Resolver returned:', resolved)
                if (resolved && resolved.trim()) {
                    displayName = resolved.trim()
                }
            } catch (error) {
                console.warn('[CallerInfo] Failed to resolve caller info:', error)
                // Fall back to default behavior
            }
        }

        return {
            displayName,
            phoneNumber
        }
    }

    async function getCallerDisplayName (call: ICall): Promise<string> {
        const info = await resolveCallerInfo(call)
        return info.displayName
    }

    return {
        resolveCallerInfo,
        getCallerDisplayName
    }
}
