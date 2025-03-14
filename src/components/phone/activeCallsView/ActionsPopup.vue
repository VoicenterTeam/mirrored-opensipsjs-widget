<template>
    <div class="actions-popup-wrapper absolute w-full">
        <PopupHeader :action="closeActionsPopup">
            <div
                :class="{ caller }"
                class="truncate"
            >
                <div
                    v-if="caller"
                    class="title font-bold text-base truncate"
                >
                    {{ caller }}
                </div>
                <div
                    :class="{'subheader': caller }"
                    class="title font-bold text-base"
                >
                    Actions
                </div>
            </div>
        </PopupHeader>
        <div class="main-block pt-4 pr-4 pl-4 pb-6">
            <div
                v-for="(actionGroup, actionGroupIndex) in actionGroupList"
                :key="actionGroupIndex"
            >
                <ActionRow
                    v-for="(action, index) in actionGroup"
                    :key="index"
                    :title="action.title"
                    :icon="action.icon"
                    :color="action.color"
                    class="action cursor-pointer"
                    @click="action.action"
                />
                <div
                    v-if="actionGroupIndex !== (actionGroup.length -1) && actionGroupList.length > 1"
                    class="divider mt-4 mb-4"
                />
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { onBeforeUnmount } from 'vue'
import ActionRow from './ActionRow.vue'
import PopupHeader from '@/components/phone/common/PopupHeader.vue'
import { ActionsObjectType } from '@/types/phone'
import useCallActions from '@/composables/phone/useCallActions.ts'
const {  onActionsToggle } = useCallActions()

/* Props */
interface Props {
    actionGroupList: Array<Array<ActionsObjectType>>,
    caller?: string
}
withDefaults(
    defineProps<Props>(),
    {
        actionGroupList: () => [],
        caller: ''

    }
)

/* Methods */
const closeActionsPopup = () => {
    onActionsToggle(null)
}

onBeforeUnmount(() => {
    closeActionsPopup()
})

</script>
<style lang="scss" scoped>
.actions-popup-wrapper {
  bottom: 0;
  border-radius: 22px 22px 0px 0px;
  box-shadow: 0px -2px 20px 0px var(--card-shadow-color);
  background-color: var(--light-bg);

  .title.subheader {
    @apply mt-1.5;
    color: var(--secondary);
    font-size: 11px;
    line-height: 16px;
    font-weight: 600;
    letter-spacing: 0.77px;
    text-transform: uppercase;
  }
  .title {
    line-height: normal;
    color: var(--default-text);
  }


  .main-block {
    .action:not(:last-child) {
      @apply mb-2;
    }

    .divider {
      height: 1px;
      background-color: var(--ui-lines);
    }
  }
}
</style>
