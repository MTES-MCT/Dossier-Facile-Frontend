<template>
  <DsfrAlert type="info" small>
    <p class="fr-mb-0 text-bold">{{ t('mandatory-declaration') }}</p>
    <p>{{ t('declaration-text') }}</p>
  </DsfrAlert>
</template>

<script setup lang="ts">
import { DsfrAlert } from '@gouvminint/vue-dsfr'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<i18n>
{
  "en": {
    "mandatory-declaration": "Mandatory declaration from 18 years old",
    "declaration-text": "The declaration is mandatory from 18 years old if you have income (salaries, internships, allowances...) and you are no longer attached to your parents' tax household.",
  },
  "fr": {
    "mandatory-declaration": "Déclaration obligatoire dès 18 ans",
    "declaration-text": "La déclaration est obligatoire dès 18 ans si vous avez des revenus (salaires, stages, allocations...) et que vous n’êtes plus rattaché au foyer fiscal de vos parents.",
  }
}
</i18n>
