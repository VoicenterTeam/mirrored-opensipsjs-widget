import { ref } from 'vue'
import { default as enLanguage } from '@/locales/en.json'
import { LangType } from '@/types/public-api'

const ENG_LANG = 'en'
const HEB_LANG = 'he'

const DEFAULT_LANG = ENG_LANG

const translations = ref({})

function flattenObject (obj: object, parentKey = '', result: object = {}) {
    for (const key in obj) {
        const propName = parentKey ? `${parentKey}.${key}` : key
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            flattenObject(obj[key], propName, result)
        } else {
            result[propName] = obj[key]
        }
    }
    return result
}

export function setLanguage (lang: LangType = DEFAULT_LANG) {
    switch (lang) {
        case ENG_LANG:
            translations.value = flattenObject(enLanguage)
            break
        case HEB_LANG:
            // TODO: Change to Hebrew
            translations.value = flattenObject(enLanguage)
            break
        default:
            translations.value = flattenObject(enLanguage)
    }
}

export function getTranslation (key) {
    return translations.value[key]
}
