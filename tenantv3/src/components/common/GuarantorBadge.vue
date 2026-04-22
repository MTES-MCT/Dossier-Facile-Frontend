<template>
  <DsfrBadge :label="t('guarantor-file')" class="guarantor-badge fr-mb-1w" no-icon />
</template>

<script setup lang="ts">
import { DsfrBadge } from '@gouvminint/vue-dsfr'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped>
.guarantor-badge {
  color: #755348 !important;
  background-color: #fddfd8 !important;
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
