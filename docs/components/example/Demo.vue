<template>
    <div>
        <VcForm
            ref="formRef"
            :model="credentials"
        >
            <VcFormItem
                label="Username"
                prop="username"
                icon="vc-lc-user-round"
                :rules="[
                    { required: true, message: 'Username is required' }
                ]"
            >
                <VcInput
                    v-model="credentials.username"
                />
            </VcFormItem>
        </VcForm>

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
                JWT Token:
                <input v-model="credentials.authorization_jwt">
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
import { useLocalStorage } from '@vueuse/core'
import Widget from './Widget.vue'
import type {
    IWidgetExternalAPI
} from '@/types/public-api'

type Credentials = {
    username: string
    password: string
    authorization_jwt: string
    domain: string
}

const widgetAPI = ref<null | IWidgetExternalAPI>()
const credentials = useLocalStorage<Credentials>(
    'credentials',
    {
        username: '',
        password: '',
        authorization_jwt: '',
        domain: ''
    }
)
const loggedIn = useLocalStorage<boolean>('loggedIn', false)

const emit = defineEmits([ 'widget-api-init' ])

const credentialsValid = computed(() => {
    return credentials.value.username &&
        (credentials.value.password || credentials.value.authorization_jwt) &&
        credentials.value.domain
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
        authorization_jwt: '',
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
        const credentialsFinal = {
            username: credentials.value.username,
            domain: credentials.value.domain,
            password: undefined,
            authorization_jwt: undefined
        }

        if (credentials.value.password) {
            credentialsFinal.password = credentials.value.password
        }

        if (credentials.value.authorization_jwt) {
            credentialsFinal.authorization_jwt = credentials.value.authorization_jwt
        }

        widgetAPI.value.login(credentialsFinal)
    }
}

onMounted(() => {
    if (loggedIn.value) {
        widgetLogin()
    }
})
</script>
