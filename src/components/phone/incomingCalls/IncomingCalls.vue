<template>
    <div
        :class="{'hidden-calls-available': hiddenIncomingCallIds.length}"
        class="incoming-calls-wrapper absolute z-5"
    >
        <IncomingCallRow
            v-for="call in visibleCalls"
            :key="call._id"
            :call="call"
        />
        <!--        <HideAllButton-->
        <!--            v-if="visibleCalls.length"-->
        <!--        />-->
    </div>
</template>

<script lang="ts" setup>
//import HideAllButton from '@/components/phone/common/HideAllButton.vue'
import { useIncomingCalls } from '@/composables/phone/useIncomingCalls.ts'
import IncomingCallRow from '@/components/phone/incomingCalls/IncomingCallRow.vue'
/* Data */
const {  hiddenIncomingCallIds, visibleCalls } = useIncomingCalls()

</script>
<style scoped lang="scss">
.incoming-calls-wrapper {
  width: calc(100% - 24px);
  top: 0px;

  &.hidden-calls-available {
    top: 48px;
  }
}
</style>
