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

                <Config />
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

/* Data */
let widgetAPI: undefined | IWidgetExternalAPI

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
    widgetAPI = widgetExternalAPI
}
function widgetLogin () {
    if (!widgetAPI) {
        return
    }

    widgetAPI.login(getCredentials.value)
}

/* Hooks */
onMounted(
    () => {
        if (isLoggedIn.value) {
            widgetLogin()
        }
    }
)
</script>

<style lang="scss" scoped></style>
