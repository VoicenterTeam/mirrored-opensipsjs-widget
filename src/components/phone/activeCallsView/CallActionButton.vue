<template>
    <div
        :class="[type, {'disabled': disabled }]"
        class="call-control-button-container flex flex-col items-center"
    >
        <button
            class="control-button mb-1"
            :disabled="disabled"
            @click="onClick"
        >
            <div class="flex h-full icon-wrapper items-center justify-center">
                <i :class="[src, 'icon-base']" />
            </div>
        </button>
        <div
            class="button-name"
            :class="{'uppercase': upperCase}"
        >
            {{ name }}
        </div>
    </div>
</template>
<script setup lang="ts">

/* Props */
interface Props {
    name: string,
    src: string,
    type?: string,
    disabled?: boolean,
    upperCase?: boolean,
}

defineProps<Props>()

/* Emits */
const emit = defineEmits<{
    (event: 'click'): void,
}>()

/* Methods */
const onClick = () => {
    emit('click')
}
</script>
<style lang="scss">
.call-control-button-container {
  .control-button {
    width: 52px;
    height: 52px;
    border-radius: 100px;
  }

  .button-name {
    font-size: 12px;
    font-weight: 550;
    line-height: 150%;
    letter-spacing: 1px;
    color: var(--default-text);

    &.uppercase {
      text-transform: uppercase;
      font-size: 10px;
      font-weight: 680;
    }
  }

  &.blueButton {
    .control-button {
      background-color: var(--active-elements);

      &:hover, &:focus {
        background: linear-gradient(0deg, rgba(0, 0, 0, 0.12) 0%, rgba(0, 0, 0, 0.12) 100%), var(--active-elements);
      }
      &:active {
        background: linear-gradient(0deg, rgba(0, 0, 0, 0.12) 0%, rgba(0, 0, 0, 0.12) 100%),  var(--active-elements);
      }

      i {
        color: var(--btn-filled-text);
      }
    }
  }
  &.whiteButton {
    .control-button {
      background-color:
          color-mix(in srgb, var(--secondary) var(--dynamic-percentage-5), transparent);

      i {
        color: var(--active-elements);
      }

      &:hover:not(:disabled) {
        background-color:
            color-mix(in srgb, var(--secondary-actions) var(--dynamic-percentage-5-hover), transparent);
      }

    }
    &.disabled {
      .control-button {
        background-color: #F8F9FB; //disable state TODO replace with library colors
        i {
          color: #A6B0C0; //disable state TODO replace with library colors
        }
      }
      .button-name {
        color: #92A5B9;
      }
    }
  }
  &.whiteButton-active {
    .control-button {
      background-color: color-mix(in srgb, var(--inactive-text) 90%, transparent);

      i {
        color: var(--btn-filled-text)
      }

      &:hover {
        background-color: var(--inactive-text);
      }
    }
  }
  &.redButton {
    .control-button {

      background-color:
          color-mix(in srgb, var(--secondary) var(----dynamic-percentage-5), transparent);

      i {
        color: var(--destructive-actions);
      }
      &:hover {
        background-color:
            color-mix(in srgb, var(--secondary-actions) var(--dynamic-percentage-5-hover), transparent);
      }
    }
    .button-name {
      color: var(--destructive-actions);
    }
  }
  &.redButton-with-bg {
    .control-button {
      background-color:
          color-mix(in srgb, var(--destructive-actions) var(--dynamic-percentage-5), transparent);

      i {
        color: var(--destructive-actions);
      }
      &:hover, &:focus {
        background-color:
            color-mix(in srgb, var(--destructive-actions--focus) var(--dynamic-percentage-5-hover), transparent);
      }
    }
    .button-name {
      color: var(--destructive-actions);
    }

  }
}

</style>
