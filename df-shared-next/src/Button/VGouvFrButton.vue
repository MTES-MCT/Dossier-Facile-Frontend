<template>
  <div class="v-gouv-fr-button">
    <button
      ref="btn"
      :class="`fr-btn ` + typeClass + sizeClass + iconClass"
      :disabled="disabled"
      :title="iconOnly ? label : undefined"
      :type="btnType"
      :aria-label="ariaLabel"
      @click="pushClick"
    >
      <template v-if="!$slots.default">
        <span v-if="iconOnly" class="sr-only">{{ label }}</span>
        <template v-else>
          {{ label }}
        </template>
      </template>
      <slot v-if="$slots.default"></slot>
    </button>
  </div>
</template>
<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'

const props = withDefaults(
  defineProps<{
    disabled?: boolean
    icon?: string
    iconPosition?: string
    iconOnly?: boolean
    label?: string
    primary?: boolean
    secondary?: boolean
    small?: boolean
    large?: boolean
    fullWidth?: boolean
    btnType?: 'submit' | 'button' | 'reset' | undefined
    ariaLabel?: string
  }>(),
  {
    disabled: false,
    icon: '',
    iconPosition: 'left',
    iconOnly: false,
    label: 'Bouton',
    primary: false,
    secondary: false,
    small: false,
    large: false,
    fullWidth: false,
    btnType: 'submit',
    ariaLabel: undefined
  }
)
const emit = defineEmits<{ click: [event: MouseEvent] }>()

const button = useTemplateRef('btn')
defineExpose({ button })

//gets type class (primary or secondary)
const typeClass = computed(() => {
  if (props.secondary && !props.primary) {
    return 'fr-btn--secondary ' //trailing space for next classes
  }
  return ''
})
//gets size class (small, medium or large)
const sizeClass = computed(() => {
  if (props.small) return 'fr-btn--sm '
  else if (props.large) return 'fr-btn--lg '
  else if (props.fullWidth) return 'full-width '
  return ''
})
//gets icon class
const iconClass = computed(() => {
  if (props.icon === '' || (props.iconPosition !== 'left' && props.iconPosition !== 'right'))
    return ''

  let computedIconClass = 'fr-fi-' + props.icon
  if (!props.iconOnly) {
    computedIconClass += ' fr-btn--icon-' + props.iconPosition
  }
  return computedIconClass
})

function pushClick(e: MouseEvent) {
  emit('click', e)
}
</script>
