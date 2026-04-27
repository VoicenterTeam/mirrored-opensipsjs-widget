import { computed, type Ref } from 'vue'
import { useElementSize } from '@vueuse/core'

const MAIN_WRAPPER_SELECTOR = '.main-wrapper'
const COMPACT_THRESHOLD_HEIGHT = 500
const XS_THRESHOLD_HEIGHT = 400

export function useMainWrapperHeight (elementRef: Ref<HTMLElement | null>) {
    const mainWrapperTarget = (): HTMLElement | null =>
        elementRef.value?.closest<HTMLElement>(MAIN_WRAPPER_SELECTOR) ?? null

    const { height: mainWrapperHeight } = useElementSize(mainWrapperTarget)

    const isCompactLayout = computed(
        () => mainWrapperHeight.value > 0 && mainWrapperHeight.value < COMPACT_THRESHOLD_HEIGHT
    )

    const isXsLayout = computed(
        () => mainWrapperHeight.value > 0 && mainWrapperHeight.value < XS_THRESHOLD_HEIGHT
    )

    return {
        mainWrapperHeight,
        isCompactLayout,
        isXsLayout,
    }
}
