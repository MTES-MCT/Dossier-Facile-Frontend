<template>
  <DsfrBadge :label="t('guarantor-file')" class="guarantor-badge fr-mb-1w" no-icon small />
</template>

<script setup lang="ts">
import { DsfrBadge } from '@gouvminint/vue-dsfr'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped>
.guarantor-badge {
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
