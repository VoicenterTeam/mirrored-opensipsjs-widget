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
                                <template
                                    v-if="name in CONFIG_DESCRIPTION.themeSettings.colors"
                                    #info-text
                                >
                                    <p v-html="CONFIG_DESCRIPTION.themeSettings.colors[name]" />
                                </template>
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
                        <VcFormItem
                            label="Type"
                        >
                            <template #info-text>
                                <p v-html="CONFIG_DESCRIPTION.themeSettings.audioConfig.layoutConfig.type" />
                            </template>
                            <VcSelect
                                v-model="form.themeSettings.audioConfig.layoutConfig.type"
                                :options="layoutConfigTypeOptions"
                                :config="selectConfig"
                            />
                        </VcFormItem>

                        <VcFormItem
                            label="Mode"
                        >
                            <template #info-text>
                                <p v-html="CONFIG_DESCRIPTION.themeSettings.audioConfig.layoutConfig.mode" />
                            </template>
                            <VcSelect
                                v-model="form.themeSettings.audioConfig.layoutConfig.mode"
                                :options="layoutConfigModeOptions"
                                :config="selectConfig"
                            />
                        </VcFormItem>

                        <VcFormItem
                            label="Anchor"
                        >
                            <template #info-text>
                                <p v-html="CONFIG_DESCRIPTION.themeSettings.audioConfig.layoutConfig.position.anchor" />
                            </template>
                            <VcSelect
                                v-model="form.themeSettings.audioConfig.layoutConfig.position.anchor"
                                :options="layoutConfigAnchorOptions"
                                :config="selectConfig"
                            />
                        </VcFormItem>

                        <VcFormItem
                            label="Logo"
                        >
                            <template #info-text>
                                <p v-html="CONFIG_DESCRIPTION.themeSettings.images.backgroundLogo" />
                            </template>
                            <FileUploader
                                v-model="form.themeSettings.images.backgroundLogo"
                                accept="image/*"
                                label="Logo"
                                :file-size-limit="1024 * 1024"
                            />
                        </VcFormItem>

                        <p>Position</p>

                        <VcFormItem
                            label="Left"
                        >
                            <template #info-text>
                                <p v-html="CONFIG_DESCRIPTION.themeSettings.audioConfig.layoutConfig.position.left" />
                            </template>
                            <VcInput v-model="form.themeSettings.audioConfig.layoutConfig.position.left" />
                        </VcFormItem>

                        <VcFormItem
                            label="Top"
                        >
                            <template #info-text>
                                <p v-html="CONFIG_DESCRIPTION.themeSettings.audioConfig.layoutConfig.position.top" />
                            </template>
                            <VcInput v-model="form.themeSettings.audioConfig.layoutConfig.position.top" />
                        </VcFormItem>

                        <VcFormItem
                            label="Right"
                        >
                            <template #info-text>
                                <p v-html="CONFIG_DESCRIPTION.themeSettings.audioConfig.layoutConfig.position.right" />
                            </template>
                            <VcInput v-model="form.themeSettings.audioConfig.layoutConfig.position.right" />
                        </VcFormItem>

                        <VcFormItem
                            label="Bottom"
                        >
                            <template #info-text>
                                <p v-html="CONFIG_DESCRIPTION.themeSettings.audioConfig.layoutConfig.position.bottom" />
                            </template>
                            <VcInput v-model="form.themeSettings.audioConfig.layoutConfig.position.bottom" />
                        </VcFormItem>

                        <VcFormItem
                            label="Keypad mode"
                        >
                            <template #info-text>
                                <p v-html="CONFIG_DESCRIPTION.themeSettings.audioConfig.layoutConfig.keypadMode" />
                            </template>
                            <VcSelect
                                v-model="form.themeSettings.audioConfig.layoutConfig.keypadMode"
                                :options="layoutConfigKeypadModeOptions"
                                :config="selectConfig"
                            />
                        </VcFormItem>


                        <VcFormItem
                            label="Keypad position"
                        >
                            <template #info-text>
                                <p v-html="CONFIG_DESCRIPTION.themeSettings.audioConfig.layoutConfig.keypadPosition" />
                            </template>
                            <VcSelect
                                v-model="form.themeSettings.audioConfig.layoutConfig.keypadPosition"
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
                        <VcFormItem
                            label="Quick Call Number"
                        >
                            <template #info-text>
                                <p v-html="CONFIG_DESCRIPTION.callSettings.quickCallNumber" />
                            </template>
                            <VcInput v-model="form.callSettings.quickCallNumber" />
                        </VcFormItem>

                        <VcFormItem
                            label="Show Keypad"
                            :info-text="CONFIG_DESCRIPTION.callSettings.showKeypad"
                        >
                            <template #info-text>
                                <p v-html="CONFIG_DESCRIPTION.callSettings.showKeypad" />
                            </template>
                            <VcSwitch v-model="form.callSettings.showKeypad" />
                        </VcFormItem>

                        <VcFormItem
                            label="Allow Transfer"
                        >
                            <template #info-text>
                                <p v-html="CONFIG_DESCRIPTION.callSettings.allowTransfer" />
                            </template>
                            <VcSwitch v-model="form.callSettings.allowTransfer" />
                        </VcFormItem>

                        <VcFormItem
                            label="Outgoing Calls"
                        >
                            <template #info-text>
                                <p v-html="CONFIG_DESCRIPTION.callSettings.outgoingCalls" />
                            </template>
                            <VcSwitch v-model="form.callSettings.outgoingCalls" />
                        </VcFormItem>

                        <VcFormItem
                            label="Shrink on Idle"
                        >
                            <template #info-text>
                                <p v-html="CONFIG_DESCRIPTION.callSettings.shrinkOnIdle" />
                            </template>
                            <VcSwitch v-model="form.callSettings.shrinkOnIdle" />
                        </VcFormItem>

                        <VcFormItem
                            label="Display Name"
                        >
                            <template #info-text>
                                <p v-html="CONFIG_DESCRIPTION.callSettings.callerInfo.displayName" />
                            </template>
                            <VcSwitch v-model="form.callSettings.callerInfo.displayName" />
                        </VcFormItem>

                        <VcFormItem
                            label="Display Caller ID"
                        >
                            <template #info-text>
                                <p v-html="CONFIG_DESCRIPTION.callSettings.callerInfo.callerId.display" />
                            </template>
                            <VcSwitch v-model="form.callSettings.callerInfo.callerId.display" />
                        </VcFormItem>

                        <VcFormItem
                            label="Mask Caller ID"
                        >
                            <template #info-text>
                                <p v-html="CONFIG_DESCRIPTION.callSettings.callerInfo.callerId.mask" />
                            </template>
                            <VcSwitch v-model="form.callSettings.callerInfo.callerId.mask" />
                        </VcFormItem>

                        <VcFormItem
                            label="Allow changing auto-answer option"
                        >
                            <template #info-text>
                                <p v-html="CONFIG_DESCRIPTION.callSettings.autoAnswer.allowChange" />
                            </template>
                            <VcSwitch v-model="form.callSettings.autoAnswer.allowChange" />
                        </VcFormItem>

                        <VcFormItem
                            label="Default auto-answer behaviour"
                        >
                            <template #info-text>
                                <p v-html="CONFIG_DESCRIPTION.callSettings.autoAnswer.defaultBehavior" />
                            </template>
                            <VcSwitch v-model="form.callSettings.autoAnswer.defaultBehavior" />
                        </VcFormItem>

                        <VcFormItem
                            label="Outgoing call placeholder"
                        >
                            <template #info-text>
                                <p v-html="CONFIG_DESCRIPTION.callSettings.outgoingCallPlaceHolder" />
                            </template>
                            <VcInput v-model="form.callSettings.outgoingCallPlaceHolder" />
                        </VcFormItem>

                        <VcFormItem
                            label="Outgoing call input regex validator (put regex in square brackets and use coma separator)"
                        >
                            <template #info-text>
                                <p v-html="CONFIG_DESCRIPTION.callSettings.outgoingInputRegexValidator" />
                            </template>
                            <VcInput v-model="outgoingInputRegexModel" />
                        </VcFormItem>

                        <VcFormItem
                            label="Ringing Sound"
                        >
                            <template #info-text>
                                <p v-html="CONFIG_DESCRIPTION.callSettings.ringingSound" />
                            </template>
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
import type { IWidgetConfig } from '@/types/public-api'
import { getDefaultWidgetConfig } from '@/enum/defaultWidgetConfig.enum'
import type { Credentials } from '~/composable/useAuthorisation'
import { VcFormItem, VcInput, VcSwitch, VcSelect } from '@voicenter-team/voicenter-ui-plus'
import { CREDENTIALS_STORAGE_KEY, WIDGET_CONFIG_STORAGE_KEY } from '~/enum/storage.enum'
import { CONFIG_DESCRIPTION } from '~/enum/fields-description.enum'

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
    },
    {
        label: 'Phone',
        value: 'phoneView'
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
