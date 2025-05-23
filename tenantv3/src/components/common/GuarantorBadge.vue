<template>
  <p class="fr-badge fr-badge--sm fr-mb-1w">{{ t('guarantor-file') }}</p>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped>
.fr-badge {
  color: #755348;
  background: #fddfd8;
}
</style>

<i18n>
{
  "en": {
    "guarantor-file": "Guarantor file",
  },
  "fr": {
    "guarantor-file": "Dossier garant"
  }
}
</i18n>
