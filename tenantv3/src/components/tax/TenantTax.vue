<template>
  <NakedCard class="fr-p-md-5w fr-m-3v fr-grid-col">
    <TenantBadge />
    <h1 class="fr-h6">
      {{ t('your-tax-notice') }}
    </h1>
    <RouterView />
  </NakedCard>
</template>

<script setup lang="ts">
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { useI18n } from 'vue-i18n'
import TenantBadge from '@/components/common/TenantBadge.vue'
import { computed, provide } from 'vue'
import { useTenantStore } from '@/stores/tenant-store'
import { taxKey } from '@/components/tax/lib/taxState'

const store = useTenantStore()

provide(taxKey, {
  category: 'tax',
  textKey: 'tenant',
  previousStep: { name: 'TenantFinancial' },
  nextStep: computed(() =>
    store.user.guarantors.length > 0 ? { name: 'GuarantorList' } : { name: 'GuarantorChoice' }
  ),
  document: computed(() => store.getTenantTaxDocument),
  action: 'saveTenantTax',
  userId: store.user.id
})

const { t } = useI18n()
</script>

<i18n>
{
  "en": {
    "your-tax-notice": "Your tax notice"
  },
  "fr": {
    "your-tax-notice": "Votre avis d’impôt"
  }
}
</i18n>
