import { ref } from 'vue'
import { IDisplayResolvers } from '@/types/public-api'

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
        if (resolver === null) {
            delete displayResolvers.value[type]
        } else {
            displayResolvers.value[type] = resolver
        }
    }

    function setResolvers (resolvers: Partial<IDisplayResolvers>): void {
        displayResolvers.value = {
            ...displayResolvers.value,
            ...resolvers
        }
    }

    function getResolver<K extends keyof IDisplayResolvers> (type: K): IDisplayResolvers[K] | null {
        return displayResolvers.value[type] || null
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
