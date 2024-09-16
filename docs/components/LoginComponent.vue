<template>
    <VcForm
        ref="loginFormRef"
        :model="loginData"
        :rules="rules"
        @submit="onLogin"
    >
        <div class="w-full">
            <VcFormItem
                prop="username"
                required
                :error="message"
            >
                <VcInput
                    v-model="loginData.username"
                    name="username"
                    type="text"
                    prefix-icon="vc-icon-users text-primary-actions"
                    placeholder="Username"
                />
            </VcFormItem>
            <VcFormItem
                prop="password"
                required
                :error="message"
            >
                <VcInput
                    v-model="loginData.password"
                    name="password"
                    type="text"
                    prefix-icon="vc-icon-extensions text-primary-actions"
                    placeholder="Password"
                />
            </VcFormItem>
            <VcFormItem
                prop="authorization_jwt"
                required
                :error="message"
            >
                <VcInput
                    v-model.trim="loginData.authorization_jwt"
                    name="authorization_jwt"
                    type="text"
                    prefix-icon="vc-icon-password text-primary-actions"
                    placeholder="Authorization JWT"
                />
            </VcFormItem>
            <VcFormItem
                prop="domain"
                required
                :error="message"
            >
                <VcInput
                    v-model="loginData.domain"
                    name="domain"
                    type="text"
                    autocomplete="on"
                    prefix-icon="vc-icon-server text-primary-actions"
                    placeholder="Domain"
                />
            </VcFormItem>
        </div>

        <VcButton
            color="primary"
            button-type="submit"
            class="mt-2"
        >
            Submit
        </VcButton>
    </VcForm>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { VcForm, VcFormItem, VcButton, VcInput } from '@voicenter-team/voicenter-ui-plus'
import type { FormItemRule } from 'element-plus'
import type { Credentials } from '~/composable/useAuthorisation'

/* Types */
type ValidationRules = {
    [key in keyof Credentials]: Array<FormItemRule>
}

/* Data */
const loginFormRef = ref<typeof VcForm>()
const loginData = ref<Credentials>(
    {
        username: '',
        password: '',
        authorization_jwt: '',
        domain: ''
    }
)
const rules: ValidationRules = {
    username: [
        {
            required: true,
            message: 'Username is required'
        }
    ],
    password: [
        {
            validator: (_, value, callback) => {
                if (!value) {
                    if (!loginData.value.authorization_jwt) {
                        callback(new Error('Password or JWT is required'))
                    } else {
                        callback()
                    }
                } else {
                    callback()
                }
            }
        }
    ],
    authorization_jwt: [
        {
            validator: (_, value, callback) => {
                if (!value) {
                    if (!loginData.value.password) {
                        callback(new Error('Password or JWT is required'))
                    } else {
                        callback()
                    }
                } else {
                    callback()
                }
            }
        }
    ],
    domain: [
        {
            required: true,
            message: 'Domain is required'
        }
    ]
}
const message = ref<string>('')

/* Emit */
const emit = defineEmits<{
    (e: 'login', payload: Credentials): void
}>()

/* Methods */
async function onLogin (event: Event) {
    event.preventDefault()

    const resValid = await loginFormRef.value?.validate()

    if (!resValid?.isValid) {
        return
    }

    emit('login', loginData.value)
}
</script>
