<template>
  <fieldset :id="name" class="fr-fieldset">
    <legend class="fr-fieldset__legend"><slot></slot></legend>
    <div v-for="element in elements" :key="element.id" class="fr-fieldset__element">
      <div class="fr-radio-group">
        <input
          :id="element.id"
          type="radio"
          :name="name"
          :checked="JSON.stringify(value) === JSON.stringify(element.value)"
          @click="onSelect(element.value)"
        />
        <label class="fr-label" :for="element.id">
          {{ t(element.labelKey) }}
          <span v-if="element.description" class="fr-hint-text">
            {{ t(element.description) }}
          </span>
        </label>
      </div>
    </div>
  </fieldset>
</template>

<script setup lang="ts">
import { DocumentType } from '../models/Document'
import { useI18n } from 'vue-i18n'

type RadioElement = {
  id: string
  labelKey: string
  description?: string
  value: DocumentType
}

const emit = defineEmits<{ input: [value: DocumentType] }>()
const { t } = useI18n()

defineProps<{
  name: string
  elements: RadioElement[]
  value: DocumentType
}>()

function onSelect(applicationType: DocumentType) {
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
