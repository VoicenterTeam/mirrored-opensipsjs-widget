import { onMounted, ref, type Ref } from 'vue'
import { useElementSize } from '@vueuse/core'

const MAIN_WRAPPER_SELECTOR = '.main-wrapper'

export function useMainWrapperHeight (elementRef: Ref<HTMLElement | null>) {
    const mainWrapperEl = ref<HTMLElement | null>(null)
    const { height: mainWrapperHeight } = useElementSize(mainWrapperEl)

    onMounted(() => {
        mainWrapperEl.value =
            elementRef.value?.closest<HTMLElement>(MAIN_WRAPPER_SELECTOR) ?? null
    })

    return {
        mainWrapperEl,
        mainWrapperHeight,
    }
}
