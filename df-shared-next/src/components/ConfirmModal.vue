<template>
  <DsfrModalPatch
    v-model:is-opened="isModalOpened"
    :title="title"
    :actions="modalActions"
    size="lg"
  >
    <slot />
  </DsfrModalPatch>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, useTemplateRef, type ComputedRef } from 'vue'
import DsfrModalPatch from './patches/DsfrModalPatch.vue'
import type { DsfrButtonProps } from 'node_modules/@gouvminint/vue-dsfr/types/components'

const { t } = useI18n()

const emit = defineEmits<{ valid: []; cancel: []; close: [] }>()

const props = defineProps<{
  validateBtnText?: string
  cancelBtnText?: string
  emitClose?: boolean
  title: string
}>()

const isModalOpened = defineModel<boolean>('isOpened', { default: false })

const modalActions: ComputedRef<DsfrButtonProps[]> = computed(() => [
  {
    label: t('validate'),
    onClick() {
      emit('valid')
    },
    secondary: true
  },
  {
    label: t('cancel'),
    onClick() {
      emit('cancel')
      isModalOpened.value = false
    }
  }
])

const validateBtn = useTemplateRef('validate-btn')
defineExpose({ validateBtn })

function validSelect() {
  emit('valid')
}

function undoSelect() {
  emit('cancel')
}

function closeModal() {
  if (props.emitClose) {
    emit('close')
  } else {
    emit('cancel')
  }
}
</script>

<i18n lang="json">
{
  "en": {
    "validate": "Validate",
    "cancel": "Cancel"
  },
  "fr": {
    "validate": "Valider",
    "cancel": "Annuler"
  }
}
</i18n>
