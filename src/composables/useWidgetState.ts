import { computed, ref } from 'vue'

const isSettingsPageOpened = ref<boolean>(false)
const widgetElement = ref<HTMLElement>()
const dragHandleElement = ref<HTMLElement>()

export function setWidgetElement (element: HTMLElement, dragHandle?: HTMLElement) {
    widgetElement.value = element
    dragHandleElement.value = dragHandle
}

export function useWidgetState () {
    if (!widgetElement.value || !dragHandleElement.value) {
        throw new Error('Widget element is not set, use setWidgetElement() first')
    }

    return {
        widgetElement: widgetElement.value,
        dragHandleElement: dragHandleElement.value,
        openSettingsPage: () => {
            isSettingsPageOpened.value = true
        },
        closeSettingsPage: () => {
            isSettingsPageOpened.value = false
        },
        isSettingsPageOpened: computed(() => isSettingsPageOpened.value),
    }
}
