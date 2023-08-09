<template>
    <div>
        <form v-if="!loggedIn" @submit.prevent="login">
            <label>
                Username:
                <input v-model="credentials.username">
            </label>
            <label>
                Password:
                <input v-model="credentials.password">
            </label>
            <label>
                Domain:
                <input v-model="credentials.domain">
            </label>

            <button type="submit" :disabled="!credentialsValid">
                Login
            </button>
        </form>
        <button v-else @click.prevent="logout">
            Logout
        </button>

        <Widget @widget-api-init="onWidgetInit" />
    </div>
</template>

<script lang="ts" setup>
import 'root'
import { ref, onMounted, computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import Widget from './Widget.vue'
import {
    IWidgetExternalAPI
} from '@/types/public-api'

type Credentials = {
    username: string
    password: string
    domain: string
}

const widgetAPI = ref<null | IWidgetExternalAPI>()
const credentials = useLocalStorage<Credentials>(
    'credentials',
    {
        username: '',
        password: '',
        domain: ''
    }
)
const loggedIn = useLocalStorage<boolean>('loggedIn', false)

const emit = defineEmits(['widget-api-init'])

const credentialsValid = computed(() => {
    return credentials.value.username && credentials.value.password && credentials.value.domain
})

function login () {
    if (!credentialsValid.value) {
        alert('Please fill all fields')
        return
    }

    loggedIn.value = true
    widgetLogin()
}
function logout () {
    loggedIn.value = false
    credentials.value = {
        username: '',
        password: '',
        domain: ''
    }

    window.location.reload()
}
function onWidgetInit (widgetExternalAPI: IWidgetExternalAPI) {
    widgetAPI.value = widgetExternalAPI

    emit('widget-api-init', widgetExternalAPI)
}
function widgetLogin () {
    if (widgetAPI.value) {
        widgetAPI.value.login(credentials.value)
    }
}

onMounted(() => {
    if (loggedIn.value) {
        widgetLogin()
    }
})
</script>
