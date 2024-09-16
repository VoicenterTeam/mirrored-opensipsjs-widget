<template>
    <div class="example pt-10">
        <Widget
            @widget-api-init="onWidgetInit"
        />

        <div
            class="flex justify-center"
        >
            <div
                v-if="isLoggedIn"
                class="w-full max-w-screen-2xl bg-gray-100 p-8 rounded"
            >
                <VcButton @click="onLogout">
                    Logout
                </VcButton>

                <Config />
            </div>

            <div
                v-else
                class="w-full max-w-lg bg-gray-100 p-8 rounded"
            >
                <LoginComponent @login="onLogin" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import 'root'
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
