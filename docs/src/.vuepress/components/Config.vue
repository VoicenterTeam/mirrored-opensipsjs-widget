<template>
    <div class="element-styling">
        <el-form :model="form" label-position="left">
            <el-collapse>
                <el-collapse-item title="Colors" name="colors">
                    <el-form-item v-for="[name, value] in Object.entries(form.themeSettings.colors)" :label="name">
                        <el-color-picker :model-value="value" @change="onColorChange($event, name)" />
                    </el-form-item>
                </el-collapse-item>
            </el-collapse>

            <el-form-item>
                <el-button type="primary" @click="save">Save</el-button>
                <el-button @click="reset">Reset</el-button>
            </el-form-item>
        </el-form>

        <Demo @widget-api-init="onWidgetApiInit" />

        <pre>

        </pre>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Demo from './Demo.vue'
import { defaultTheme } from '@/enum/defaultTheme.enum'
import type {IWidgetConfigOptions, IWidgetExternalAPI} from '@/types/public-api'
import { defaultCallSettings } from '@/composables/useCallSettingsPermissions'

const defaultForm: IWidgetConfigOptions = {
    themeSettings: JSON.parse(JSON.stringify(defaultTheme)),
    callSettings: JSON.parse(JSON.stringify(defaultCallSettings))
}

const form = ref<IWidgetConfigOptions>({ ...defaultForm })
const widgetApi = ref<IWidgetExternalAPI>()

function onWidgetApiInit (wapi: IWidgetExternalAPI) {
    console.log('on emit', wapi)
    widgetApi.value = wapi
}
function onColorChange (value, name) {
    form.value = {
        ...form.value,
        themeSettings: {
            ...form.value.themeSettings,
            colors: {
                ...form.value.themeSettings.colors,
                [name]: value
            }
        }
    }
}
function reset () {
    form.value = { ...defaultForm }

    if (widgetApi.value) {
        widgetApi.value.setConfig(form.value)
    }
}
function save () {
    if (widgetApi.value) {
        widgetApi.value.setConfig(form.value)
    }
}
</script>
