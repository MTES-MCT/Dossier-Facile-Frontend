<template>
  <DsfrAlert type="info" small>
    <i18n-t tag="p" keypath="first-declaration-info">
      <a
        href="https://www.impots.gouv.fr/particulier/je-declare-pour-la-premiere-fois-je-declare-chaque-annee"
        :title="`impots.gouv.fr - ${t('i-declare-first')} - ${t('new-window')}`"
        target="_blank"
        >impots.gouv.fr - {{ t('i-declare-first') }}</a
      >
    </i18n-t>
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
    "first-declaration-info": "More info about the first declaration: {0}",
    "i-declare-first": "I declare for the first time"
  },
  "fr": {
    "first-declaration-info": "Plus d’info sur la première déclaration : {0}",
    "i-declare-first": "Je déclare pour la première fois"
  }
}
</i18n>
