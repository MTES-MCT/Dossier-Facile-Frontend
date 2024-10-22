<template>
  <button
    :disabled="props.disabled"
    :class="classes()"
    class="fr-btn"
    :title="props.title"
    @click="onClick"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
const emit = defineEmits<{ 'on-click': [] }>()

const props = withDefaults(
  defineProps<{
    title?: string
    primary?: boolean
    size?: string
    dark?: boolean
    disabled?: boolean
    tertiary?: boolean
    tertiaryNoOutline?: boolean
  }>(),
  {
    primary: false,
    size: 'normal',
    dark: false,
    disabled: false,
    tertiary: false,
    tertiaryNoOutline: false
  }
)

function classes() {
  return {
    'fr-btn--secondary': !props.primary && !props.tertiary && !props.tertiaryNoOutline,
    'fr-btn--lg': props.size === 'large',
    'fr-btn--sm': props.size === 'small',
    'fr-btn--icon': props.size === 'icon',
    'fr-btn--tertiary': props.tertiary,
    'fr-btn--tertiary-no-outline': props.tertiaryNoOutline,
    dark: props.dark
  }
}

function onClick() {
  emit('on-click')
}
</script>

<style lang="scss">
.fr-btn.dark {
  color: rgb(0, 0, 145);
  background-color: rgb(133, 133, 246);

  &:hover {
    --hover-tint: rgb(177, 177, 249);
    background-color: var(--hover-tint);
  }
  &:active {
    --active-tint: rgb(198, 198, 251);
    background-color: var(--active-tint);
  }
}
</style>
