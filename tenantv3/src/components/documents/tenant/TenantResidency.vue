<template>
  <NakedCard class="fr-p-md-5w fr-grid-col">
    <h6>{{ t('residency-situation') }}</h6>
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
    "residency-situation": "Your housing situation",
  },
  "fr": {
    "residency-situation": "Votre situation d'hébergement"
  }
}
</i18n>
