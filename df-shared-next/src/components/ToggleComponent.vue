<template>
  <div class="fr-toggle">
    <input
      :id="inputId"
      type="checkbox"
      :checked="value"
      class="fr-toggle__input"
      :aria-describedby="hintId"
      @input="updateValue($event)"
    />
    <label
      class="fr-toggle__label"
      :for="inputId"
      :data-fr-checked-label="checkedLabel"
      :data-fr-unchecked-label="uncheckedLabel"
    >
      {{ label }}
    </label>
    <p v-if="hint" :id="hintId" class="fr-hint-text">
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    id: number | string
    value: boolean
    label?: string
    hint?: string
    checkedLabel?: string
    uncheckedLabel?: string
  }>(),
  {
    label: '',
    hint: '',
    checkedLabel: '',
    uncheckedLabel: ''
  }
)
const emit = defineEmits<{ update: [checked: boolean] }>()

const inputId = computed(() => {
  return `toggle-${props.id}`
})

const hintId = computed(() => {
  return `${inputId.value}-hint-text`
})

function updateValue(event: Event) {
  emit('update', (event.target as HTMLInputElement).checked)
}
</script>
