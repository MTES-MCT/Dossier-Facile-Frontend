<template>
  <NakedCard class="fr-p-md-5w fr-m-3v fr-grid-col">
    <h6>{{ t('income') }}</h6>
    <router-view />
  </NakedCard>
</template>

<script setup lang="ts">
import { financialKey } from '@/components/financial/financialState'
import { useTenantStore } from '@/stores/tenant-store'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { computed, provide } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useTenantStore()

provide(financialKey, {
  category: 'financial',
  textKey: 'tenant',
  previousStep: '/documents-locataire/3',
  nextStep: { name: 'TenantTax' },
  recap: { name: 'TenantFinancial' },
  documents: computed(() => store.financialDocuments),
  userId: undefined,
  action: 'saveTenantFinancial'
})
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
