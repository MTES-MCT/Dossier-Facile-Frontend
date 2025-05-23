<template>
  <p class="fr-badge fr-badge--sm fr-mb-1w">{{ t('tenant-file') }}</p>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped>
.fr-badge {
  color: var(--light-options-illustration-color-sun-default-yellow-tournesol-sun-407, #716043);
  background: var(--light-options-illustration-color-950-default-yellow-tournesol-950, #feecc2);
}
</style>

<i18n>
{
  "en": {
    "tenant-file": "Tenant file",
  },
  "fr": {
    "tenant-file": "Dossier locataire"
  }
}
</i18n>
