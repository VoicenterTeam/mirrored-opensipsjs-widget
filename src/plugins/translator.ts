import { ref } from 'vue'
import { default as enLanguage } from '@/locales/en.json'
import { default as heLanguage } from '@/locales/he.json'
import { LangType } from '@/types/public-api'

interface LanguageData {
    [key: string]: string | LanguageData
}

const ENG_LANG = 'en' as const
const HEB_LANG = 'he' as const

const DEFAULT_LANG = ENG_LANG

const translations = ref<Record<string, string>>({})

function flattenObject (obj: LanguageData, parentKey = '', result: Record<string, string> = {}) {
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
            translations.value = flattenObject(heLanguage)
            break
        default:
            translations.value = flattenObject(enLanguage)
    }
}

export function getTranslation (key: string) {
    return translations.value[key]
}
