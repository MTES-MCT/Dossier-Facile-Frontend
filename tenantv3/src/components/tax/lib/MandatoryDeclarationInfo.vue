<template>
  <DsfrAlert type="info" small>
    <p class="fr-mb-0 text-bold">{{ t('mandatory-declaration') }}</p>
    <p>{{ t(textKey + '.declaration-text') }}</p>
  </DsfrAlert>
</template>

<script setup lang="ts">
import { DsfrAlert } from '@gouvminint/vue-dsfr'
import { useI18n } from 'vue-i18n'
import { useTaxState } from './taxState'
const { t } = useI18n()

const { textKey } = useTaxState()
</script>

<i18n>
{
  "en": {
    "mandatory-declaration": "Mandatory declaration from 18 years old",
    "tenant": {
      "declaration-text": "The declaration is mandatory from 18 years old if you have income (salaries, internships, allowances...) and you are no longer attached to your parents' tax household.",
    },
    "guarantor": {
      "declaration-text": "The declaration is mandatory from 18 years old if your guarantor has income (salaries, internships, allowances...) and they are no longer attached to their parents' tax household.",
    }
  },
  "fr": {
    "mandatory-declaration": "Déclaration obligatoire dès 18 ans",
    "tenant": {
      "declaration-text": "La déclaration est obligatoire dès 18 ans si vous avez des revenus (salaires, stages, allocations...) et que vous n’êtes plus rattaché au foyer fiscal de vos parents.",
    },
    "guarantor": {
      "declaration-text": "La déclaration est obligatoire dès 18 ans si votre garant a des revenus (salaires, stages, allocations...) et qu’il n’est plus rattaché au foyer fiscal de ses parents.",
    }
  }
}
</i18n>
