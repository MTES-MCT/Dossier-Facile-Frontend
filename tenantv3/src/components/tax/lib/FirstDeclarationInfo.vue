<template>
  <div class="fr-highlight fr-ml-0 fr-my-3w">
    <i18n-t tag="p" keypath="first-declaration-info" class="fr-mb-0">
      <a
        href="https://www.impots.gouv.fr/particulier/je-declare-pour-la-premiere-fois-je-declare-chaque-annee"
        target="_blank"
        >impots.gouv.fr - {{ t('i-declare-first') }}</a
      >
    </i18n-t>
  </div>
</template>

<script setup lang="ts">
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
