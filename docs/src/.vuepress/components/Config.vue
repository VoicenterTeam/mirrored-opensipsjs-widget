<template>
    <div>
        <h2
            id="configDemo"
            tabindex="-1"
        >
            <a class="header-anchor" href="#config-demo" aria-hidden="true">#</a>
            Widget Demo
        </h2>

        <Demo @widget-api-init="onWidgetInit" />

        <div class="element-styling">
            <h2
                    id="configTheme"
                    tabindex="-1"
            >
                <a class="header-anchor" href="#config-theme" aria-hidden="true">#</a>
                Theme configuration
            </h2>

            <el-collapse>
                <el-collapse-item title="Colors" name="colors">
                    <el-form label-position="left" label-width="auto" inline>
                        <el-row>
                            <el-col v-for="[name, value] in Object.entries(form.themeSettings.colors)" :key="name" :span="8">
                                <el-form-item :label="name">
                                    <el-color-picker :model-value="value" @change="onColorChange($event, name)" />
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-collapse-item>

                <el-collapse-item title="Layout" name="layout">
                    <el-form label-position="left" label-width="auto" inline>
                        <el-form-item label="Type">
                            <el-select v-model="form.themeSettings.layoutConfig.type">
                                <el-option
                                        key="rounded"
                                        label="Rounded"
                                        value="rounded"
                                />
                                <el-option
                                        key="quickCall"
                                        label="Quick Call"
                                        value="quickCall"
                                />
                            </el-select>
                        </el-form-item>

                        <el-form-item label="Mode">
                            <el-select v-model="form.themeSettings.layoutConfig.mode">
                                <el-option
                                    key="floating"
                                    label="Floating"
                                    value="floating"
                                />
                                <el-option
                                    key="docked"
                                    label="Docked"
                                    value="docked"
                                />
                                <el-option
                                    key="fixed"
                                    label="Fixed"
                                    value="fixed"
                                />
                            </el-select>
                        </el-form-item>

                        <el-form-item label="Anchor">
                            <el-select v-model="form.themeSettings.layoutConfig.position.anchor">
                                <el-option
                                        key="none"
                                        label="None"
                                        :value="null"
                                />
                                <el-option
                                        key="bottom-center"
                                        label="Bottom Center"
                                        value="bottom-center"
                                />
                                <el-option
                                        key="top-center"
                                        label="Top Center"
                                        value="top-center"
                                />
                                <el-option
                                        key="center"
                                        label="Center"
                                        value="center"
                                />
                            </el-select>
                        </el-form-item>

                        <el-form-item label="Logo">
                            <ImageUploader v-model="form.themeSettings.images.backgroundLogo" :max-size="1024 * 1024" />
                        </el-form-item>

                        <p>Position</p>

                        <el-form-item label="Left">
                            <el-input v-model="form.themeSettings.layoutConfig.position.left" />
                        </el-form-item>

                        <el-form-item label="Top">
                            <el-input v-model="form.themeSettings.layoutConfig.position.top" />
                        </el-form-item>

                        <el-form-item label="Right">
                            <el-input v-model="form.themeSettings.layoutConfig.position.right" />
                        </el-form-item>

                        <el-form-item label="Bottom">
                            <el-input v-model="form.themeSettings.layoutConfig.position.bottom" />
                        </el-form-item>
                    </el-form>
                </el-collapse-item>

                <el-collapse-item title="Call Settings" name="callSettings">
                    <el-form label-position="left" label-width="auto">
                        <el-form-item label="Quick Call Number">
                          <el-input v-model="form.callSettings.quickCallNumber" />
                        </el-form-item>

                        <el-form-item label="Allow Transfer">
                            <el-switch v-model="form.callSettings.allowTransfer" />
                        </el-form-item>

                        <el-form-item label="Outgoing Calls">
                            <el-switch v-model="form.callSettings.outgoingCalls" />
                        </el-form-item>

                        <el-form-item label="Shrink on Idle">
                            <el-switch v-model="form.callSettings.shrinkOnIdle" />
                        </el-form-item>

                        <el-form-item label="Display Name">
                            <el-switch v-model="form.callSettings.callerInfo.displayName" />
                        </el-form-item>

                        <el-form-item label="Display Caller ID">
                            <el-switch v-model="form.callSettings.callerInfo.callerId.display" />
                        </el-form-item>

                        <el-form-item label="Mask Caller ID">
                            <el-switch v-model="form.callSettings.callerInfo.callerId.mask" />
                        </el-form-item>

                        <el-form-item label="Allow changing auto-answer option">
                            <el-switch v-model="form.callSettings.autoAnswer.allowChange" />
                        </el-form-item>

                        <el-form-item label="Default auto-answer behaviour">
                            <el-switch v-model="form.callSettings.autoAnswer.defaultBehavior" />
                        </el-form-item>

                        <el-form-item label="Outgoing call placeholder">
                          <el-input v-model="form.callSettings.outgoingCallPlaceHolder" />
                        </el-form-item>

                        <el-form-item label="Outgoing call input regex validator (put regex in square brackets and use coma separator)">
                          <el-input v-model="outgoingInputRegexModel" />
                        </el-form-item>

                        <el-form-item label="Ringing Sound">
                            <AudioUploader v-model="form.callSettings.ringingSound" :max-size="1024 * 1024" />
                        </el-form-item>
                    </el-form>
                </el-collapse-item>
            </el-collapse>

            <br>

            <el-form-item>
                <el-button type="primary" @click="save">Save</el-button>
                <el-button @click="reset">Reset</el-button>
            </el-form-item>
        </div>

        <div class="code-example-wrapper">
            <el-button class="copy-button" @click="copyToClipboard">
                Copy
            </el-button>
            <div ref="widgetCodeExampleRef" v-html="widgetCodeExampleHTML" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import prismjs from 'prismjs'
import { useLocalStorage } from '@vueuse/core'
import Demo from './Demo.vue'
import AudioUploader from './AudioUploader.vue'
import ImageUploader from './ImageUploader.vue'
import type { TWidgetConfigOptions, IWidgetExternalAPI } from '@/types/public-api'
import { getDefaultWidgetConfig } from '@/enum/defaultWidgetConfig.enum'

type Credentials = {
    username: string
    password: string
    domain: string
}

const widgetCodeExampleRef = ref()
const finalForm = useLocalStorage<TWidgetConfigOptions>(
    'finalForm',
    getDefaultWidgetConfig()
)
const form = ref<TWidgetConfigOptions>(JSON.parse(JSON.stringify(finalForm.value)) as TWidgetConfigOptions)
const widgetAPI = ref<IWidgetExternalAPI>()
const credentials = useLocalStorage<Credentials>(
    'credentials',
    {
        username: '',
        password: '',
        domain: ''
    }
)

const values = getDefaultWidgetConfig().callSettings.outgoingInputRegexValidator
const defaultOutgoingInputValidator = values.map((value) => `[${value}]`).join(',')
const outgoingInputRegexModel = ref<string>(defaultOutgoingInputValidator)

/* Computed */
const widgetCodeExample = computed(() => {
    const themeSettingsJSON = indentJSON(JSON.stringify(finalForm.value.themeSettings, null, 4))
    const callSettingsJSON = indentJSON(JSON.stringify(finalForm.value.callSettings, null, 4))
    const credentialsJSON = indentJSON(JSON.stringify(credentials.value, null, 4))

    const code = `
<script type="module" src="${__OPENSIPS_WIDGET_CDN__}"><\/script>

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

    return code
})
const widgetCodeExampleHTML = computed(() => {
    const code = `​${widgetCodeExample.value}`

    const sanitizedCode = code
        .trim()
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\//g, '&#47;')
        .replace(/\\/g, '&#92;')

    return `
        <pre>
            <code class="language-markup">
                ${sanitizedCode}
            </code>
        </pre>
    `
})

function indentJSON (jsonString: string) {
    const lines = jsonString.split('\n')

    if (lines.length > 1) {
        // The first line remains unchanged, but the subsequent lines are indented.
        return lines[0] + '\n' + lines.slice(1).map(line => '        ' + line).join('\n')
    }

    return jsonString
}
function onWidgetInit (widgetExternalAPI: IWidgetExternalAPI) {
    widgetAPI.value = widgetExternalAPI.setConfig(finalForm.value)

    finalForm.value = widgetExternalAPI.getConfig()
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
    if (widgetAPI.value) {
        widgetAPI.value.setConfig(getDefaultWidgetConfig())

        form.value = widgetAPI.value.getConfig()
        finalForm.value = widgetAPI.value.getConfig()
    }
}
function extractValuesFromBrackets (inputString: string): string[] {
  const regex = /\[([^\]]+)\]/g;

  const matches: string[] = [];
  let match;

  while ((match = regex.exec(inputString)) !== null) {
    matches.push(match[1]);
  }

  return matches;
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

    if (widgetAPI.value) {
        widgetAPI.value.setConfig(form.value)

        form.value = widgetAPI.value.getConfig()
        finalForm.value = widgetAPI.value.getConfig()
    }
}
function printCodeExample () {
    if (widgetCodeExampleRef.value) {
        widgetCodeExampleRef.value.innerHTML = widgetCodeExampleHTML.value

        nextTick(() => {
            prismjs.highlightAll()
        })
    }
}
const copyToClipboard = async () => {
    try {
        await navigator.clipboard.writeText(widgetCodeExample.value)
    } catch (err) {
        console.error('Failed to copy text: ', err)
    }
}

watch(
    widgetCodeExampleHTML,
    () => {
        printCodeExample()
    },
    {
        immediate: true
    }
)

onMounted(() => {
    printCodeExample()
})
</script>

<style lang="scss" scoped>
.code-example-wrapper {
  position: relative;

  .copy-button {
    position: absolute;
    left: 5px;
    top: 5px;
  }
}
</style>
