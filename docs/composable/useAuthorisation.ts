import { useLocalStorage } from '@vueuse/core'
import { CREDENTIALS_STORAGE_KEY } from '~/enum/storage.enum'

/* Types */
export type Credentials = {
    username: string
    password: string
    authorization_jwt: string
    domain: string
}

/* Data */
const credentials = useLocalStorage<Credentials>(
    CREDENTIALS_STORAGE_KEY,
    {
        username: '',
        password: '',
        authorization_jwt: '',
        domain: ''
    }
)

/* Computed */
export const isLoggedIn = computed(() => {
    return credentials.value.username && credentials.value.domain && (credentials.value.password || credentials.value.authorization_jwt)
})
export const getCredentials = computed(() => {
    return credentials.value
})

/* Methods */
export function logIn (data: Credentials) {
    credentials.value = data
}
export function logOut () {
    credentials.value = {
        username: '',
        password: '',
        authorization_jwt: '',
        domain: ''
    }
}
