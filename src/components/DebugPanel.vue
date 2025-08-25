<template>
    <div
        v-if="isVisible"
        ref="debugPanel"
        :style="{
            position: 'fixed',
            pointerEvents: 'auto',
            top: position.y + 'px',
            left: position.x + 'px',
            background: 'rgba(0,0,0,0.9)',
            color: 'white',
            padding: '12px',
            fontSize: '11px',
            zIndex: 9999,
            borderRadius: '8px',
            maxWidth: '450px',
            fontFamily: `'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace`,
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
            border: '1px solid #374151'
        }"
        @mousedown="startDrag"
    >
        <div
            style="font-weight: bold; color: #4ade80; margin-bottom: 10px; font-size: 13px; display: flex; justify-content: space-between; align-items: center;"
        >
            <span>🔧 Multi-Tab Debug Panel</span>
            <span style="color: #6b7280; font-size: 10px; font-weight: normal;">Ctrl+Shift+D to toggle</span>
        </div>

        <!-- Current Tab Info -->
        <div style="background: rgba(255,255,255,0.1); padding: 8px; border-radius: 4px; margin-bottom: 10px;">
            <div style="color: #fbbf24; font-weight: bold; margin-bottom: 6px;">
                📍 Current Tab
            </div>

            <div style="margin-bottom: 3px;">
                <span style="color: #94a3b8;">ID:</span>
                <span style="color: #e2e8f0; font-weight: bold;">{{ shortTabId }}</span>
            </div>

            <div style="margin-bottom: 3px;">
                <span style="color: #94a3b8;">Status:</span>
                <span :style="{ color: isActiveTab ? '#10b981' : '#ef4444', fontWeight: 'bold' }">
                    {{ isActiveTab ? '👑 LEADER' : '👥 FOLLOWER' }}
                </span>
            </div>

            <div style="margin-bottom: 3px;">
                <span style="color: #94a3b8;">Active Calls:</span>
                <span :style="{ color: activeCalls.length > 0 ? '#ef4444' : '#6b7280', fontWeight: 'bold' }">
                    {{ activeCalls.length }}
                </span>
            </div>

            <div style="margin-bottom: 3px;">
                <span style="color: #94a3b8;">Can Switch:</span>
                <span :style="{ color: canActivateTab ? '#10b981' : '#ef4444', fontWeight: 'bold' }">
                    {{ canActivateTab ? 'YES' : 'NO' }}
                </span>
            </div>
        </div>

        <!-- Simplified System Status -->
        <div style="margin-bottom: 10px;">
            <div style="color: #fbbf24; font-weight: bold; margin-bottom: 6px;">
                🚀 Simplified Tab System
            </div>
            <div style="color: #6b7280; font-size: 10px; padding: 6px;">
                Focus = Active (unless another tab has calls)
            </div>
        </div>

        <!-- Global State -->
        <div style="background: rgba(255,255,255,0.1); padding: 8px; border-radius: 4px; margin-bottom: 10px;">
            <div style="color: #fbbf24; font-weight: bold; margin-bottom: 6px;">
                🌐 Global State
            </div>

            <div style="margin-bottom: 3px;">
                <span style="color: #94a3b8;">Tab with Calls:</span>
                <span :style="{ color: tabWithActiveCalls ? '#ef4444' : '#6b7280', fontWeight: 'bold' }">
                    {{ tabWithActiveCalls ? tabWithActiveCalls.slice(-8) : 'None' }}
                </span>
            </div>

            <div style="margin-bottom: 3px;">
                <span style="color: #94a3b8;">Blocked Switching:</span>
                <span :style="{ color: isBlocked ? '#ef4444' : '#10b981', fontWeight: 'bold' }">
                    {{ isBlocked ? 'YES' : 'NO' }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { allActiveCalls } from '@/composables/opensipsjs'
import { useActiveTab } from '@/composables/useActiveTab'

const {
    isActiveTab,
    tabWithActiveCalls,
    tabId,
} = useActiveTab()

// Visibility and dragging state
const isVisible = ref(false)
const isDragging = ref(false)
const position = ref({
    x: 20,
    y: 20
})
const dragOffset = ref({
    x: 0,
    y: 0
})
const debugPanel = ref<HTMLElement>()

// Computed properties
const activeCalls = computed(() => Object.values(allActiveCalls.value))

const shortTabId = computed(() => tabId.slice(-8))

const canActivateTab = computed(() => {
    return !isActiveTab.value && !tabWithActiveCalls.value
})

const isBlocked = computed(() => {
    return tabWithActiveCalls.value && tabWithActiveCalls.value !== tabId
})

// Keyboard toggle functionality
function handleKeydown (event: KeyboardEvent) {
    if (event.ctrlKey && event.shiftKey && event.key === 'D') {
        event.preventDefault()
        isVisible.value = !isVisible.value
    }
}

// Dragging functionality
function startDrag (event: MouseEvent) {
    if (!debugPanel.value) return

    isDragging.value = true
    const rect = debugPanel.value.getBoundingClientRect()
    dragOffset.value = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    }

    document.addEventListener('mousemove', handleDrag)
    document.addEventListener('mouseup', stopDrag)
    event.preventDefault()
}

function handleDrag (event: MouseEvent) {
    if (!isDragging.value) return

    const newX = event.clientX - dragOffset.value.x
    const newY = event.clientY - dragOffset.value.y

    // Keep panel within viewport bounds
    const maxX = window.innerWidth - (debugPanel.value?.offsetWidth || 450)
    const maxY = window.innerHeight - (debugPanel.value?.offsetHeight || 400)

    position.value = {
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
    }
}

function stopDrag () {
    isDragging.value = false
    document.removeEventListener('mousemove', handleDrag)
    document.removeEventListener('mouseup', stopDrag)
}

// Lifecycle
onMounted(() => {
    document.addEventListener('keydown', handleKeydown)

    // Set initial position to top-right corner
    position.value = {
        x: window.innerWidth - 470,
        y: 20
    }
})

onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
    document.removeEventListener('mousemove', handleDrag)
    document.removeEventListener('mouseup', stopDrag)
})
</script>

<style scoped lang="scss">

</style>
