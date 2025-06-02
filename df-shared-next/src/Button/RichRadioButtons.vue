<template>
  <fieldset :id="name" class="fr-fieldset">
    <legend class="fr-fieldset__legend">
      <slot></slot>
    </legend>
    <div v-for="element in elements" :key="element.id" class="fr-fieldset__element">
      <div class="fr-radio-group fr-radio-rich">
        <input
          :id="element.id"
          type="radio"
          :name="name"
          :checked="modelValue === element.optionName"
          @click="onSelect(element.optionName)"
        />
        <label class="fr-label" :for="element.id">
          {{ t(element.labelKey) }}
          <span v-if="element.description" class="fr-hint-text">
            {{ t(element.description) }}
          </span>
        </label>
        <div v-if="getIconCount(element) > 0" class="fr-radio-rich__img">
          <div class="icon-container">
            <span
              v-for="i in getIconCount(element)"
              :key="i"
              :class="element.iconClass + ' fr-icon--lg'"
              aria-hidden="true"
            ></span>
          </div>
        </div>
      </div>
    </div>
  </fieldset>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

export interface RadioElement {
  id: string
  labelKey: string
  description?: string
  iconClass: string
  iconCount?: number
  optionName: string
}

const { t } = useI18n()
const emit = defineEmits<{ input: [value: string] }>()

defineProps<{
  name: string
  elements: RadioElement[]
  modelValue: string
}>()

function getIconCount(element: RadioElement) {
  return element.iconCount === undefined ? 1 : element.iconCount
}

function onSelect(applicationType: string) {
  emit('input', applicationType)
}
</script>

<style lang="scss">
.icon-container {
  height: 5rem;
  width: 6rem;
  color: var(--primary);
  background-color: var(--white);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
