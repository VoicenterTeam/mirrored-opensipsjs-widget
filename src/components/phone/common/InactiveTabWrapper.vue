<template>
    <div
        v-if="shouldShowInactiveWrapper"
        class="inactive-wrapper"
    >
        <div class="inactive-wrapper-content">
            <div class="inactive-icon flex items-center justify-center mb-8">
                <i class="vc-lc-app-window text-3xl" />
            </div>
            <div class="text-2xl font-semibold text-center mb-5">
                <span>{{ getTranslation('tab.not.active') }}</span>
            </div>
            <div class="text-lg text-center mb-8">
                <p class="mb-4">
                    {{ getTranslation('tab.inactive.description') }}
                </p>
                <VcButton
                    :color="getButtonColor()"
                    :disabled="getButtonDisabled()"
                    @click="handleButtonClick"
                >
                    {{ getButtonText() }}
                </VcButton>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useTimeoutFn } from '@vueuse/core'
import { getTranslation } from '@/plugins/translator'
import { useActiveTab } from '@/composables/useActiveTab'
import { isOpenSIPSReady } from '@/composables/opensipsjs'

const { isActiveTab, canActivate, activateTab, focusTabWithCalls } = useActiveTab()

const hasNotificationPermission = ref(false)

onMounted(() => {
    checkNotificationPermission()
})

function checkNotificationPermission() {
    if (!('Notification' in window)) {
        hasNotificationPermission.value = false
        return
    }
    
    hasNotificationPermission.value = Notification.permission === 'granted'
}

const shouldShow = ref(false)
const { start, stop } = useTimeoutFn(() => {
    shouldShow.value = true
}, 2000)

watch(isActiveTab, (newValue) => {
    if (newValue) {
        // Tab became active - hide immediately and cancel any pending show
        shouldShow.value = false
        stop()
    } else {
        // Tab became inactive - start timer to show after delay
        start()
    }
}, { immediate: true })

const shouldShowInactiveWrapper = computed(() => {
    return isOpenSIPSReady.value && !isActiveTab.value && shouldShow.value
})

function getButtonColor() {
    if (canActivate.value) return 'primary'
    if (hasNotificationPermission.value) return 'primary'
    return 'secondary'
}

function getButtonDisabled() {
    if (canActivate.value) return false
    if (hasNotificationPermission.value) return false
    return true
}

function getButtonText() {
    if (canActivate.value) {
        return getTranslation('tab.activate')
    }
    
    if (hasNotificationPermission.value) {
        return getTranslation('tab.notify.other.tab')
    }
    
    return getTranslation('tab.cannot.activate')
}

function handleButtonClick() {
    if (canActivate.value) {
        activateTab()
        return
    }
    
    if (hasNotificationPermission.value) {
        focusTabWithCalls()
        return
    }
    
    // If no permission, button should be disabled anyway
}
</script>

<style lang="scss" scoped>
.inactive-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(97, 97, 97, 0.9);
  transition: 0.3s ease;
  z-index: 999999;
}
.inactive-wrapper-content {
  @apply flex flex-col items-center;
  color: #fff;
  padding: 40px;

  p {
    color: #fff;

    & + p {
      margin-top: 0.33em;
    }
  }
}
.inactive-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.1);
}

</style>
