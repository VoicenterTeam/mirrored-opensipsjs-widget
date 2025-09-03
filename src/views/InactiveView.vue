<template>
    <div class="flex bg-primary-actions-bg--focus h-[60px] flex-row p-1">
        <div :class="activateButtonClasses">
            <div
                class="activate-button"
                :class="{'enabled-activate-tab': !isButtonDisabled, 'disabled-activate-tab': isButtonDisabled}"
                @click="handleButtonClick"
            >
                <i
                    class="text-primary-actions"
                    :class="{
                        'hover:text-primary-actions-bg--focus': !isButtonDisabled,
                        'vc-lc-square-arrow-up-right': isSwitchToActiveTabButton,
                        'vc-lc-circle-power': !isSwitchToActiveTabButton
                    }"
                />
            </div>
        </div>
        <div
            v-if="!allowShrinkOnIdle"
            class="flex items-center pr-2 justify-start"
        >
            <span class="text-center font-semibold text-primary-actions">
                {{ buttonText }}
            </span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { allowShrinkOnIdle } from '@/composables/useWidgetConfig'
import { useActiveTab } from '@/composables/useActiveTab'
import { getTranslation } from '@/plugins/translator'

const { canActivate, activateTab, focusTabWithCalls } = useActiveTab()

const hasNotificationPermission = ref(false)

const activateButtonClasses = computed(() => {
    let classes = 'text-primary p-1 '
    if (allowShrinkOnIdle.value) {
        classes += 'px-8'
    } else {
        classes += 'px-2'
    }

    return classes
})

const isButtonDisabled = computed(() => {
    if (canActivate.value) return false
    if (hasNotificationPermission.value) return false
    return true
})

const isSwitchToActiveTabButton = computed(() => {
    return !canActivate.value && hasNotificationPermission.value
})

const  buttonText = computed(() => {
    if (canActivate.value) {
        return getTranslation('tab.activate')
    }

    if (hasNotificationPermission.value) {
        return getTranslation('tab.notify.other.tab')
    }

    return getTranslation('tab.cannot.activate')
})

function handleButtonClick () {
    if (canActivate.value) {
        activateTab()
        return
    }

    if (hasNotificationPermission.value) {
        focusTabWithCalls()
        return
    }
}

function checkNotificationPermission () {
    if (!('Notification' in window)) {
        hasNotificationPermission.value = false
        return
    }

    hasNotificationPermission.value = Notification.permission === 'granted'
}

onMounted(() => {
    checkNotificationPermission()
})
</script>

<style scoped>
.activate-button {
  display: flex;
  align-items: center;
  height: 100%;
}
.activate-button i {
  font-size: 40px;
  margin: auto 0;
  align-self: center;
}
.enabled-activate-tab i {
  cursor: pointer;
}
.disabled-activate-tab i {
  cursor: not-allowed;
}
</style>
