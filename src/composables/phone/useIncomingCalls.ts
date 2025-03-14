import { ref, watch, computed } from 'vue'
import type { ICall } from '@voicenter-team/opensips-js/src/types/rtc'
import { activeCalls } from '@/composables/opensipsjs'

/* Data */
const hiddenIncomingCallIds = ref<Array<string>>([])
const isIncomingCallsPopupVisible = ref(false)
const incomingCallActions = ref<{ call: ICall, caller: string} | null>(null)

export const useIncomingCalls = () => {
// Function to hide a call
    const hideIncomingCall = (callId: string) => {
        if (!hiddenIncomingCallIds.value.includes(callId)) {
            hiddenIncomingCallIds.value.push(callId)
        }
    }

    const incomingCalls = computed(() => {
        return Object.values(activeCalls.value).filter(call => {
            return call.direction === 'incoming' && !call._is_confirmed
        })
    })

    // Watch incomingCalls for changes
    watch(incomingCalls, (newCalls) => {

        // Create a Set of IDs from the new incomingCalls array
        const incomingCallIds = new Set(newCalls.map(call => call._id))

        hiddenIncomingCallIds.value = hiddenIncomingCallIds.value.filter(id => incomingCallIds.has(id))


        const isActionsSelectedCallStillPresent = newCalls.some(call => call._id === incomingCallActions.value?.call._id)

        // If incomingCallActions is not present, set it to null
        if (!isActionsSelectedCallStillPresent) {
            onActionsCallChange(null)
        }


    }, { deep: true })


    const visibleCalls = computed(() => {
        return incomingCalls.value.filter(call => !hiddenIncomingCallIds.value.includes(call._id))
    })

    const hiddenCalls = computed(() => {
        return incomingCalls.value.filter(call => hiddenIncomingCallIds.value.includes(call._id))
    })

    watch(hiddenCalls, (newCalls) => {
        if(!newCalls || !newCalls.length) {
            onIncomingCallsPopupToggle(false)
        }
    }, { deep: true })

    /* Methods */
    const onIncomingCallsPopupToggle =  (state: boolean) => {
        isIncomingCallsPopupVisible.value = state
    }

    const onActionsCallChange =  (call: { call: ICall, caller: string} | null) => {
        incomingCallActions.value = call
    }

    return {
        hiddenIncomingCallIds,
        isIncomingCallsPopupVisible,
        incomingCallActions,
        visibleCalls,
        hiddenCalls,
        hideIncomingCall,
        onActionsCallChange,
        onIncomingCallsPopupToggle
    }
}
