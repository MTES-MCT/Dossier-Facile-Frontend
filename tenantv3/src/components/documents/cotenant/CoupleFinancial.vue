<template>
  <NakedCard class="fr-p-md-5w fr-m-3v fr-grid-col">
    <TenantBadge />
    <h1 class="fr-h4">{{ t('income') }}</h1>
    <RouterView />
  </NakedCard>
</template>

<script setup lang="ts">
import TenantBadge from '@/components/common/TenantBadge.vue'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<i18n>
{
  "en": {
    "income": "Your spouse's income",
  },
  "fr": {
    "income": "Revenus de votre conjoint"
  }
}
</i18n>
