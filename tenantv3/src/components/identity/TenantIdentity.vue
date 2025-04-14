<template>
  <NakedCard class="fr-p-md-5w fr-grid-col">
    <h1 class="fr-h4">{{ t('title') }}</h1>
    <p>{{ t('description') }}</p>
    <router-view />
  </NakedCard>
</template>

<script setup lang="ts">
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<i18n>
{
  "en": {
    "title": "Identity",
    "description": "Who are you creating this rental file for?"
  },
  "fr": {
    "title": "Identité",
    "description": "Pour qui réalisez-vous ce dossier de location ?"
  }
}
</i18n>
