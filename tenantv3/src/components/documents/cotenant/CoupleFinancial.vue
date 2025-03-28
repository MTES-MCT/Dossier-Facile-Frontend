<template>
  <NakedCard class="fr-p-md-5w fr-m-3v fr-grid-col">
    <h6>{{ t('income') }}</h6>
    <RouterView />
  </NakedCard>
</template>

<script setup lang="ts">
import { financialKey } from '@/components/financial/financialState'
import { useTenantStore } from '@/stores/tenant-store'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { computed, provide } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { t } = useI18n()
const store = useTenantStore()
const route = useRoute()
const tenantId = computed(() => Number(route.params.tenantId))

provide(financialKey, {
  category: 'couple-financial',
  textKey: 'couple',
  documents: computed(() => {
    const tenant = store.getTenant(tenantId.value)
    return tenant.documents?.filter((d) => d.documentCategory === 'FINANCIAL') ?? []
  }),
  previousStep: { name: 'CoupleProfessional', params: { tenantId: tenantId.value } },
  nextStep: { name: 'CoupleTax', params: { tenantId: tenantId.value } },
  recap: { name: 'CoupleFinancial' },
  userId: store.user.id,
  action: 'saveTenantFinancial',
  addData: (formData) => {
    formData.append('tenantId', String(tenantId.value))
  }
})
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
