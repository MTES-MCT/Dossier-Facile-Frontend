<template>
  <DsfrModalPatch
    v-model:is-opened="isModalOpened"
    :title="t('delete-docs')"
    :actions="modalActions"
    size="lg"
  >
    <DsfrAlert small type="warning">
      <i18n-t keypath="will-delete" tag="p">
        <strong>{{ t('warning') }}</strong>
        <span>{{ t(`category.${documentCategory}`) }}</span>
      </i18n-t>
    </DsfrAlert>
    <p class="fr-mt-1w">{{ t('will-have-to-add') }}</p>
  </DsfrModalPatch>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import DsfrModalPatch from './patches/DsfrModalPatch.vue'
import { DsfrAlert } from '@gouvminint/vue-dsfr'
import type { DsfrButtonProps } from '@gouvminint/vue-dsfr'
import { computed } from 'vue'
import type { ComputedRef } from 'vue'

const { t } = useI18n()

interface Props {
  documentCategory: 'financial' | 'identity' | 'professional' | 'residency' | 'tax'
}

defineProps<Props>()
const emit = defineEmits(['confirm'])

const isModalOpened = defineModel<boolean>('isOpened', { default: false })

const modalActions: ComputedRef<DsfrButtonProps[]> = computed(() => [
  {
    label: t('delete-docs'),
    onClick() {
      emit('confirm')
    },
    secondary: true
  },
  {
    label: t('cancel'),
    onClick() {
      isModalOpened.value = false
    }
  }
])
</script>

<i18n lang="json">
{
  "en": {
    "category": {
      "identity": "your identification",
      "financial": "your proof of income",
      "professional": "your documents",
      "residency": "your documents",
      "tax": "your documents"
    },
    "cancel": "Cancel",
    "delete-docs": "Delete my documents",
    "warning": "Please note",
    "will-delete": "{0} that any change in your situation will remove {1}.",
    "will-have-to-add": "You will need to add the documents corresponding to your new situation."
  },
  "fr": {
    "category": {
      "identity": "vos pièces d’identité",
      "financial": "vos justificatifs de revenus",
      "professional": "vos justificatifs",
      "residency": "vos justificatifs",
      "tax": "vos justificatifs"
    },

    "cancel": "Annuler",
    "delete-docs": "Supprimer mes documents",
    "warning": "Attention",
    "will-delete": "{0}, toute modification de votre situation supprimera {1}.",
    "will-have-to-add": "Vous devrez ajouter les documents correspondant à votre nouvelle situation."
  }
}
</i18n>
