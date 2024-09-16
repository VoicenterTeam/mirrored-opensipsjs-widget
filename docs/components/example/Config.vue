<template>
    <div>
        <div>
            <VcCollapse
                v-model="collapseModel"
            >
                <VcCollapseItem
                    title="Colors"
                    name="colors"
                >
                    <VcForm
                        label-position="left"
                        label-width="auto"
                        inline
                    >
                        <div class="grid grid-rows-4 grid-flow-col gap-4">
                            <VcFormItem
                                v-for="[name, value] in Object.entries(form.themeSettings.colors)"
                                :key="name"
                                :label="name"
                            >
                                <VcColorPicker
                                    :model-value="value"
                                    @change="onColorChange($event, name)"
                                />
                            </VcFormItem>
                        </div>
                    </VcForm>
                </VcCollapseItem>

                <VcCollapseItem
                    title="Layout"
                    name="layout"
                >
                    <VcForm
                        label-position="left"
                        label-width="auto"
                    >
                        <VcFormItem label="Type">
                            <VcSelect
                                v-model="form.themeSettings.layoutConfig.type"
                                :options="layoutConfigTypeOptions"
                                :config="selectConfig"
                            />
                        </VcFormItem>

                        <VcFormItem label="Mode">
                            <VcSelect
                                v-model="form.themeSettings.layoutConfig.mode"
                                :options="layoutConfigModeOptions"
                                :config="selectConfig"
                            />
                        </VcFormItem>

                        <VcFormItem label="Anchor">
                            <VcSelect
                                v-model="form.themeSettings.layoutConfig.position.anchor"
                                :options="layoutConfigAnchorOptions"
                                :config="selectConfig"
                            />
                        </VcFormItem>

                        <VcFormItem label="Logo">
                            <FileUploader
                                v-model="form.themeSettings.images.backgroundLogo"
                                accept="image/*"
                                label="Logo"
                                :file-size-limit="1024 * 1024"
                            />
                        </VcFormItem>

                        <p>Position</p>

                        <VcFormItem label="Left">
                            <VcInput v-model="form.themeSettings.layoutConfig.position.left" />
                        </VcFormItem>

                        <VcFormItem label="Top">
                            <VcInput v-model="form.themeSettings.layoutConfig.position.top" />
                        </VcFormItem>

                        <VcFormItem label="Right">
                            <VcInput v-model="form.themeSettings.layoutConfig.position.right" />
                        </VcFormItem>

                        <VcFormItem label="Bottom">
                            <VcInput v-model="form.themeSettings.layoutConfig.position.bottom" />
                        </VcFormItem>

                        <VcFormItem label="Keypad mode">
                            <VcSelect
                                v-model="form.themeSettings.layoutConfig.keypadMode"
                                :options="layoutConfigKeypadModeOptions"
                                :config="selectConfig"
                            />
                        </VcFormItem>


                        <VcFormItem label="Keypad position">
                            <VcSelect
                                v-model="form.themeSettings.layoutConfig.keypadPosition"
                                :options="layoutConfigKeypadPositionOptions"
                                :config="selectConfig"
                            />
                        </VcFormItem>
                    </VcForm>
                </VcCollapseItem>

                <VcCollapseItem
                    title="Call Settings"
                    name="callSettings"
                >
                    <VcForm
                        label-position="left"
                        label-width="auto"
                    >
                        <VcFormItem label="Quick Call Number">
                            <VcInput v-model="form.callSettings.quickCallNumber" />
                        </VcFormItem>

                        <VcFormItem label="Show Keypad">
                            <VcSwitch v-model="form.callSettings.showKeypad" />
                        </VcFormItem>

                        <VcFormItem label="Allow Transfer">
                            <VcSwitch v-model="form.callSettings.allowTransfer" />
                        </VcFormItem>

                        <VcFormItem label="Outgoing Calls">
                            <VcSwitch v-model="form.callSettings.outgoingCalls" />
                        </VcFormItem>

                        <VcFormItem label="Shrink on Idle">
                            <VcSwitch v-model="form.callSettings.shrinkOnIdle" />
                        </VcFormItem>

                        <VcFormItem label="Display Name">
                            <VcSwitch v-model="form.callSettings.callerInfo.displayName" />
                        </VcFormItem>

                        <VcFormItem label="Display Caller ID">
                            <VcSwitch v-model="form.callSettings.callerInfo.callerId.display" />
                        </VcFormItem>

                        <VcFormItem label="Mask Caller ID">
                            <VcSwitch v-model="form.callSettings.callerInfo.callerId.mask" />
                        </VcFormItem>

                        <VcFormItem label="Allow changing auto-answer option">
                            <VcSwitch v-model="form.callSettings.autoAnswer.allowChange" />
                        </VcFormItem>

                        <VcFormItem label="Default auto-answer behaviour">
                            <VcSwitch v-model="form.callSettings.autoAnswer.defaultBehavior" />
                        </VcFormItem>

                        <VcFormItem label="Outgoing call placeholder">
                            <VcInput v-model="form.callSettings.outgoingCallPlaceHolder" />
                        </VcFormItem>

                        <VcFormItem label="Outgoing call input regex validator (put regex in square brackets and use coma separator)">
                            <VcInput v-model="outgoingInputRegexModel" />
                        </VcFormItem>

                        <VcFormItem label="Ringing Sound">
                            <FileUploader
                                v-model="form.callSettings.ringingSound"
                                accept="audio/*"
                                :file-size-limit="1024 * 1024"
                                label="Ringing Sound"
                            />
                        </VcFormItem>
                    </VcForm>
                </VcCollapseItem>
            </VcCollapse>

            <div>
                <VcButton
                    color="primary"
                    @click="save"
                >
                    Save
                </VcButton>
                <VcButton
                    color="destructive"
                    @click="reset"
                >
                    Reset
                </VcButton>
            </div>
        </div>

        <div class="code-example-wrapper">
            <VcButton
                class="copy-button"
                @click="copyToClipboard"
            >
                Copy
            </VcButton>
            <prism
                :key="codeExampleKey"
                language="html"
            >
                {{ widgetCodeExample }}
            </prism>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { version } from 'root/package.json'
import { computed, ref, watch } from 'vue'
import cloneDeep from 'lodash/cloneDeep'
import 'prismjs'
import 'prismjs/themes/prism.css'
import Prism from 'vue-prism-component'
import { useLocalStorage } from '@vueuse/core'
import FileUploader from './FileUploader.vue'
// import ImageUploader from './ImageUploader.vue'
import type { IWidgetConfig } from '@/types/public-api'
import { getDefaultWidgetConfig } from '@/enum/defaultWidgetConfig.enum'
import type { Credentials } from '~/composable/useAuthorisation'
import { VcFormItem, VcInput, VcSwitch, VcSelect } from '@voicenter-team/voicenter-ui-plus'
import { CREDENTIALS_STORAGE_KEY, WIDGET_CONFIG_STORAGE_KEY } from '~/enum/storage.enum'

/* Types */
type OptionType = {
    label: string
    value: string | null
}

/* Emits */
const emit = defineEmits<{
    (e: 'change'): void
}>()

/* Data */
const codeExampleKey = ref(Date.now())
const collapseModel = ref<Array<string>>([])
const finalForm = useLocalStorage<IWidgetConfig>(
    WIDGET_CONFIG_STORAGE_KEY,
    getDefaultWidgetConfig()
)
const form = ref<IWidgetConfig>(cloneDeep(finalForm.value))
const credentials = useLocalStorage<Credentials>(
    CREDENTIALS_STORAGE_KEY,
    {
        username: '',
        password: '',
        authorization_jwt: '',
        domain: ''
    }
)
const values = getDefaultWidgetConfig().callSettings.outgoingInputRegexValidator
const defaultOutgoingInputValidator = values.map((value) => `[${value}]`).join(',')
const outgoingInputRegexModel = ref<string>(defaultOutgoingInputValidator)
const selectConfig = {
    valueKey: 'value',
    labelKey: 'label',
} as const
const layoutConfigTypeOptions: Array<OptionType> = [
    {
        label: 'Rounded',
        value: 'rounded'
    },
    {
        label: 'Quick Call',
        value: 'quickCall'
    }
]
const layoutConfigModeOptions: Array<OptionType> = [
    {
        label: 'Floating',
        value: 'floating'
    },
    {
        label: 'Docked',
        value: 'docked'
    },
    {
        label: 'Fixed',
        value: 'fixed'
    }
]
const layoutConfigAnchorOptions: Array<OptionType> = [
    {
        label: 'None',
        value: null
    },
    {
        label: 'Bottom Center',
        value: 'bottom-center'
    },
    {
        label: 'Top Center',
        value: 'top-center'
    },
    {
        label: 'Center',
        value: 'center'
    }
]
const layoutConfigKeypadModeOptions: Array<OptionType> = [
    {
        label: 'Popover',
        value: 'popover'
    },
    {
        label: 'Static',
        value: 'static'
    },
    {
        label: 'Manual',
        value: 'manual'
    }
]
const layoutConfigKeypadPositionOptions: Array<OptionType> = [
    {
        label: 'Top',
        value: 'top'
    },
    {
        label: 'Bottom',
        value: 'bottom'
    }
]

/* Computed */
const widgetCodeExample = computed(() => {
    const themeSettingsJSON = indentJSON(JSON.stringify(finalForm.value.themeSettings, null, 4))
    const callSettingsJSON = indentJSON(JSON.stringify(finalForm.value.callSettings, null, 4))
    const credentialsJSON = indentJSON(JSON.stringify(credentials.value, null, 4))

    return `
<script type="module" src="https://cdn.opensipsjs.org/opensipsjs-widget/v${version}/opensipsjs-widget.es.js"><\/script>

<opensips-widget id="openSIPSWidget"><\/opensips-widget>

<script>
    const widget = document.getElementById('openSIPSWidget')

    async function onWidgetInitialized ({ detail: OpenSIPSWidget }) {
        const credentials = ${credentialsJSON}

        const themeSettings = ${themeSettingsJSON}

        const callSettings = ${callSettingsJSON}

        const widgetAPI = new OpenSIPSWidget({
            themeSettings,
            callSettings
        })

        await widgetAPI.login(credentials)

        widgetAPI.on('callIncoming', (call) => {
            console.log('incoming call:', call)
        })
    }

    widget.addEventListener('widget:ready', onWidgetInitialized)
<\/script>`
})

/* Mounted */
function indentJSON (jsonString: string) {
    const lines = jsonString.split('\n')

    if (lines.length > 1) {
        // The first line remains unchanged, but the subsequent lines are indented.
        return lines[0] + '\n' + lines.slice(1).map(line => '        ' + line).join('\n')
    }

    return jsonString
}
function onColorChange (value: string | null, name: string) {
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
    finalForm.value = getDefaultWidgetConfig()
}
function extractValuesFromBrackets (inputString: string): string[] {
    const regex = /\[([^\]]+)\]/g

    const matches: string[] = []
    let match

    while ((match = regex.exec(inputString)) !== null) {
        matches.push(match[1])
    }

    return matches
}
function saveRegexValidators () {
    const regexes = extractValuesFromBrackets(outgoingInputRegexModel.value)
    form.value.callSettings.outgoingInputRegexValidator = []
    regexes.forEach((value) => {
        form.value.callSettings.outgoingInputRegexValidator.push(value)
    })
}
function save () {
    saveRegexValidators()

    finalForm.value = cloneDeep(form.value)

    codeExampleKey.value = Date.now()

    emit('change')
}
async function copyToClipboard () {
    try {
        await navigator.clipboard.writeText(widgetCodeExample.value)
    } catch (err) {
        console.error('Failed to copy text: ', err)
    }
}

/* Watcher */
watch(
    finalForm,
    (newValue) => {
        if (JSON.stringify(newValue) !== JSON.stringify(form.value)) {
            form.value = cloneDeep(newValue)
        }
    },
    {
        deep: true,
        immediate: true
    }
)
</script>

<style lang="scss" scoped>
.code-example-wrapper {
    position: relative;
    max-width: 100%;
    overflow: auto;

    .copy-button {
        position: absolute;
        left: 5px;
        top: 5px;
    }
}
</style>
