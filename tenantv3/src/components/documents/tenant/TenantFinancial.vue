<template>
  <NakedCard class="fr-p-md-5w fr-m-3v fr-grid-col">
    <h6>{{ t('income') }}</h6>
    <RouterView />
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
    "income": "Your income",
  },
  "fr": {
    "income": "Vos revenus"
  }
}
</i18n>
