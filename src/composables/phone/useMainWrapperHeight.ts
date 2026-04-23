import { computed, onMounted, ref, type Ref } from 'vue'
import { useElementSize } from '@vueuse/core'

const MAIN_WRAPPER_SELECTOR = '.main-wrapper'
const COMPACT_THRESHOLD_HEIGHT = 500
const XS_THRESHOLD_HEIGHT = 400

export function useMainWrapperHeight (elementRef: Ref<HTMLElement | null>) {
    const mainWrapperEl = ref<HTMLElement | null>(null)
    const { height: mainWrapperHeight } = useElementSize(mainWrapperEl)

    onMounted(() => {
        mainWrapperEl.value =
            elementRef.value?.closest<HTMLElement>(MAIN_WRAPPER_SELECTOR) ?? null
    })

    const isCompactLayout = computed(() => {
        const currentHeight = mainWrapperHeight.value
        return !!currentHeight && currentHeight < COMPACT_THRESHOLD_HEIGHT
    })

    const isXsLayout = computed(() => {
        const currentHeight = mainWrapperHeight.value
        return !!currentHeight && currentHeight < XS_THRESHOLD_HEIGHT
    })

    return {
        mainWrapperEl,
        mainWrapperHeight,
        isCompactLayout,
        isXsLayout,
    }
}
