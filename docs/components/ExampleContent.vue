<template>
    <div class="example pt-10">
        <Widget
            @widget-api-init="onWidgetInit"
        />

        <div
            class="flex justify-center"
        >
            <div
                class="w-full max-w-screen-2xl bg-gray-100 p-8 rounded"
            >
                <VcButton
                    v-if="isLoggedIn"
                    @click="onLogout"
                >
                    Logout
                </VcButton>

                <LoginComponent
                    v-else
                    @login="onLogin"
                />

                <Config @change="onConfigChange" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Widget from '~/components/example/Widget.vue'
import Config from '~/components/example/Config.vue'
import type {
    IWidgetExternalAPI
} from '@/types/public-api'
import { type Credentials, getCredentials, isLoggedIn, logIn, logOut } from '~/composable/useAuthorisation'
import { useLocalStorage } from '@vueuse/core'
import { WIDGET_CONFIG_STORAGE_KEY } from '~/enum/storage.enum'
import type { IWidgetConfig } from '@/types/public-api'

/* Data */
let widgetAPI: undefined | IWidgetExternalAPI
const widgetConfig = useLocalStorage<IWidgetConfig>(WIDGET_CONFIG_STORAGE_KEY, {} as IWidgetConfig)

/* Methods */
function onLogin (payload: Credentials) {
    logIn(payload)
    widgetLogin()
}
function onLogout () {
    logOut()

    if (widgetAPI) {
        widgetAPI.disconnect()
    }
}
function onWidgetInit (widgetExternalAPI: IWidgetExternalAPI) {
    console.log('onWidgetInit')
    widgetAPI = widgetExternalAPI
}
function widgetLogin () {
    if (!widgetAPI) {
        // Widget API not ready yet, wait for it with interval
        const checkInterval = setInterval(() => {
            if (widgetAPI) {
                clearInterval(checkInterval)
                console.log('getCredentials.value', getCredentials.value)
                widgetAPI.login(getCredentials.value)
            }
        }, 2000)
        return
    }

    console.log('getCredentials.value', getCredentials.value)
    widgetAPI.login(getCredentials.value)
}
function onConfigChange () {
    console.log('Config changed, applying new settings...')
    /* if (widgetAPI) {
        // Apply the new configuration
        widgetAPI.setConfig(widgetConfig.value)
        console.log('New config applied:', widgetConfig.value)
    } */

    if (widgetAPI) {
        widgetAPI.disconnect()
        setTimeout(() => {
            widgetLogin()
        }, 1000)
    }
}

/* Hooks */
onMounted(
    () => {
        console.log('isLoggedIn.value', isLoggedIn.value)
        if (isLoggedIn.value) {
            widgetLogin()
        }
    }
)
</script>

<style lang="scss" scoped></style>
