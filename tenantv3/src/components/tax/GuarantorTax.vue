<template>
  <NakedCard class="fr-p-md-5w fr-m-3v fr-grid-col">
    <GuarantorBadge />
    <h1 class="fr-h6">
      {{ t('tax-notice') }}
    </h1>
    <RouterView />
  </NakedCard>
</template>

<script setup lang="ts">
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { useI18n } from 'vue-i18n'
import { computed, provide } from 'vue'
import { useTenantStore } from '@/stores/tenant-store'
import { taxKey } from '@/components/tax/lib/taxState'
import GuarantorBadge from '@/components/common/GuarantorBadge.vue'

const store = useTenantStore()

provide(taxKey, {
  category: 'guarantor-tax',
  textKey: 'guarantor',
  previousStep: { name: 'GuarantorFinancial' },
  nextStep: { name: 'GuarantorList' },
  document: computed(() => store.getGuarantorTaxDocument),
  action: 'saveGuarantorTax',
  userId: store.user.id,
  addData(formData) {
    if (store.guarantor?.id) {
      formData.append('guarantorId', store.guarantor.id.toString())
    }
  }
})

const { t } = useI18n()
</script>

<i18n>
{
  "en": {
    "tax-notice": "Your guarantor's tax notice"
  },
  "fr": {
    "tax-notice": "Avis d’impôt de votre garant"
  }
}
</i18n>
