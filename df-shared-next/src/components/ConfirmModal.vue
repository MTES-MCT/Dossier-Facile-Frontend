<template>
  <DsfrModalPatch
    v-model:is-opened="isModalOpened"
    ref="modal"
    :title="title"
    :actions="modalActions"
    size="lg"
    :can-close
  >
    <slot />
  </DsfrModalPatch>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, useTemplateRef, type ComputedRef } from 'vue'
import DsfrModalPatch from './patches/DsfrModalPatch.vue'
import type { DsfrButtonProps } from '@gouvminint/vue-dsfr'

const { t } = useI18n()

const emit = defineEmits<{ valid: []; cancel: []; close: [] }>()

interface Props {
  title: string
  canClose?: boolean
}

const { title, canClose = true } = defineProps<Props>()

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

const modal = useTemplateRef('modal')
defineExpose({ modal })
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
