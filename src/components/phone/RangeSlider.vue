<template>
    <div
        :class="{'h-full': vertical}"
        class="vc-range-slider"
    >
        <vue-slider
            v-bind="$attrs"
            :tooltip="tooltip"
            :direction="!vertical ? 'ltr' : 'btt'"
            :style="vertical ? 'height: 100%' : ''"
        />
    </div>
</template>

<script lang="ts" setup>
import VueSlider from 'vue-slider-component'
import { TooltipProp } from 'vue-slider-component/lib/typings'

type NumberOrNumberString = string | number | undefined

/*Props*/
withDefaults(
    defineProps<{
        tooltip?: TooltipProp,
        value?: NumberOrNumberString,
        vertical?: boolean,
    }>(),
    {
        tooltip: 'none',
        value: 0,
        vertical: false,
    }
)

</script>

<style lang="scss">
.vc-range-slider {
  $themeColor: var(--primary-actions);
  $bgColor: var(--inactive-elements);
  $dotShadowFocus: 0.5px 0.5px 2px 1px rgba(0, 0, 0, 0.32);

  height: inherit;

  @import 'vue-slider-component/lib/theme/default.scss';
}
</style>
