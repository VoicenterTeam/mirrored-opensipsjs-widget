<template>
    <div class="transfer-popup-wrapper absolute w-full flex flex-col">
        <PopupHeader :action="closeTransferPopup">
            <div class="truncate">
                <div class="truncate title font-bold text-xl mb-1.5">
                    {{ caller }}
                </div>
                <div class="subheader font-bold text-xl">
                    transfer call
                </div>
            </div>
        </PopupHeader>
        <div class="px-2 py-4">
            <div class="search-wrapper flex items-center gap-x-2">
                <VcInput
                    :model-value="searchQuery"
                    class="input-wrapper h-10"
                    placeholder="type number"
                    @update:modelValue="onInput"
                    @keyup.enter="handleTransfer"
                />
                <TransferButton
                    :active-bg="!!searchQuery.length"
                    :number="searchQuery"
                />
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { computed,  onUnmounted, ref } from 'vue'
import PopupHeader from '@/components/phone/common/PopupHeader.vue'
import { useVsipInject } from '@/composables/phone/useVsipProvideInject'
import TransferButton from '@/components/phone/activeCallsView/TransferButton.vue'
import useCallActions from '@/composables/phone/useCallActions.ts'



const {
    callToTransfer,
    onCallToTransferChange,
    onCallTransfer,
} = useCallActions()
const { callersData  } = useVsipInject()

/* Data */
const searchQuery = ref('')

/* Methods */

const handleTransfer = () => {
    if(!searchQuery.value) {
        return
    }

    onCallTransfer(`${searchQuery.value}`)
}

const closeTransferPopup = () => {
    onCallToTransferChange(undefined)
}

/* Methods */
const onInput = (value: string| number ) => {
    value = `${value}`
    searchQuery.value = value.trim().replace(/[^0-9]/g, '')
}

const caller = computed(() => {
    const id = callToTransfer.value
    const user = id ? callersData.value[id] : null
    return user?.userName || user?.userPhone || ''
})

/* onUnmounted */
onUnmounted(() => {
    searchQuery.value = ''
    onCallToTransferChange(undefined)
})
</script>
<style lang="scss" scoped>
.transfer-popup-wrapper {
  bottom: 0;
  border-radius: 22px 22px 0px 0px;
  box-shadow: 0px -2px 20px 0px var(--card-shadow-color);
  background-color: var(--light-bg);
  z-index: 6;

  .subheader {
    color: var(--secondary);
    font-size: 11px;
    line-height: 16px;
    font-weight: 600;
    letter-spacing: 0.77px;
    text-transform: uppercase;
  }
  .title {
    color: var(--default-text);
    line-height: normal;
  }


  .main-block {
    .action:not(:last-child) {
      @apply mb-2;
    }

  }

  .tabs-body {
    box-shadow: 0px 10px 20px -13px var(--card-shadow-color);
    .tabs-wrapper {

      .tabs {
        border: 1px solid var(--ui-lines);
        border-radius: 6px;

        .tab {
          flex: 1;
          color: var(--inactive-text);
          leading-trim: both;
          font-size: 11px;
          font-weight: 680;
          border-right: 1px solid var(--ui-lines);
          letter-spacing: 0.88px;
          text-transform: uppercase;
          background-color: color-mix(in srgb, var(--secondary) var(--dynamic-percentage-10), transparent);

          &.active {
            color: var(--active-elements);
            background-color: var(--light-bg);
          }
        }

        .tab:last-child {
          border-right: none;
        }
      }
    }
  }
}
.highlight {
  @apply text-active-elements;
  font-weight: bold;
}
</style>
