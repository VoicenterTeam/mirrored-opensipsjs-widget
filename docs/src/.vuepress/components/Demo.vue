<template>
    <div
        ref="wrapperRef"
    >
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
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { IWidgetExternalAPI, IWidgetInit, IWidgetInitOptions } from '@/types/public-api'
import type { OpenSIPSWidgetElement } from '@/types/opensips-widget'
import '../../../../'

type Credentials = {
    username: string
    password: string
    domain: string
}

let widgetAPI: IWidgetExternalAPI | null = null
const wrapperRef = ref(null)
const credentials = useLocalStorage<Credentials>(
    'credentials',
    {
        username: '',
        password: '',
        domain: ''
    }
)
const loggedIn = useLocalStorage<boolean>('loggedIn', false)

const credentialsValid = computed(() => {
    return credentials.value.username && credentials.value.password && credentials.value.domain
})
function login () {
    if (!credentialsValid.value) {
        alert('Please fill all fields')
        return
    }

    loggedIn.value = true
    init()
}
function logout () {
    loggedIn.value = false
    credentials.value = {
        username: '',
        password: '',
        domain: ''
    }

    const widgetEl = document.querySelector('opensips-widget')

    if (widgetEl) {
        widgetEl.remove()
    }
}
function init () {
    if (!wrapperRef.value) {
        return
    }

    const widgetEl = document.createElement('opensips-widget') as OpenSIPSWidgetElement

    async function onWidgetInitialized ({ detail: initFunction }: { detail: IWidgetInit }) {
        const themeSettings = {
            colors: {
                primary: '#1a202c',
                secondary: '#1a202c',
                accent: '#1a202c',
            },
            layoutConfig: {
                mode: 'floating',
                type: 'rounded'
            }
        }

        const callSettings = {
            allowTransfer: true,
            autoAnswer: {
                allowChange: false,
                defaultBehavior: true
            },
            outgoingCalls: false,
            callerInfo: {
                displayName: true,
                callerId: {
                    display: true,
                    mask: true
                }
            }
        }

        const initOptions: IWidgetInitOptions = {
            credentials: credentials.value,
            config: {
                themeSettings: {},
                callSettings: {}
            }
        }

        widgetAPI = await initFunction(initOptions)

        console.log('widgetAPI', widgetAPI)
    }

    widgetEl.addEventListener('widget:ready', onWidgetInitialized)

    widgetEl.style.zIndex = '99999'

    wrapperRef.value.appendChild(widgetEl)
}

onMounted(async () => {
    if (loggedIn.value) {
        init()
    }
})
</script>
