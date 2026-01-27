<template>
  <DsfrAlert type="info" small :description="t('warning-update')" />
</template>

<script setup lang="ts">
import { DsfrAlert } from '@gouvminint/vue-dsfr'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<i18n>
{
  "en": {
    "warning-update": "Due to changes in the income stage, some categories have been modified, preventing your document from being correctly categorized. Please feel free to reorganize it to place it in the appropriate category.",
  },
  "fr": {
    "warning-update": "En raison de l’évolution de l’étape des revenus, certaines catégories ont été modifiées, ce qui a empêché la bonne catégorisation de votre document. N’hésitez pas à le réorganiser pour le placer dans la catégorie appropriée.",
  }
}
</i18n>
