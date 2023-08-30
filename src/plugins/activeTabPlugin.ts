import type { App, InjectionKey, Ref } from 'vue'
import { computed, inject, watch } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { startOpenSIPS, stopOpenSIPS, unregisterOpenSIPS } from '@/composables/opensipsjs'

interface ActiveTabPluginProvide {
    isActiveTab: Ref<boolean>
    activateTab: () => void
    setTabIDWithActiveCall: (state: boolean) => void
    tabIdWithActiveCall: Ref<string>
}

export const ActiveTabKey: InjectionKey<ActiveTabPluginProvide> = Symbol()

const tabId = Math.random().toString()
const localStorageTabWithActiveCall = useLocalStorage('openSIPSWidgetTabWithActiveCallID', '')
const localStorageActiveTab = useLocalStorage('openSIPSWidgetActiveTabID', '')
const localStorageTabList = useLocalStorage('openSIPSWidgetTabList', new Set<string>())
const isActiveTab = computed(() => localStorageActiveTab.value === tabId)

export const ActiveTabPlugin = {
    install: (app: App) => {
        function activateTab () {
            if (!isActiveTab.value) {
                localStorageActiveTab.value = tabId
            }
        }

        function setTabIDWithActiveCall (state: boolean) {
            localStorageTabWithActiveCall.value = state ? tabId : ''
        }

        localStorageTabList.value.add(tabId)

        if (localStorageActiveTab.value === '') {
            localStorageActiveTab.value = tabId
        }

        window.addEventListener('beforeunload', function (event) {
            if (isActiveTab.value) {
                event.preventDefault()

                // Chrome requires returnValue to be set
                event.returnValue = 'You are currently in an active session. Are you sure you want to leave?'

                // When user chooses to stay on the page
                window.addEventListener('unload', function () {
                    unregisterOpenSIPS({ all: true })
                    localStorageTabList.value.delete(tabId)

                    if (!localStorageTabList.value.size) {
                        localStorageActiveTab.value = ''
                        return
                    }
                    if (isActiveTab.value) {
                        localStorageActiveTab.value = Array.from(localStorageTabList.value).pop() ?? ''
                    }
                })
            } else {
                localStorageTabList.value.delete(tabId)
                if (!localStorageTabList.value.size) {
                    localStorageActiveTab.value = ''
                }
            }
        })


        watch(
            isActiveTab,
            (newVal) => {
                if (!newVal) {
                    stopOpenSIPS()
                } else {
                    startOpenSIPS()
                }
            }
        )

        app.provide(
            ActiveTabKey,
            {
                isActiveTab,
                activateTab,
                setTabIDWithActiveCall,
                tabIdWithActiveCall: localStorageTabWithActiveCall
            }
        )
    },
}

export const useActiveTab = () => {
    const injectData = inject(ActiveTabKey)

    if (!injectData) {
        throw new Error('useActiveTabInject() is called without provider.')
    }

    return injectData
}
