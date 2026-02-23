<template>
  <NakedCard class="fr-p-md-5w fr-m-3v fr-grid-col">
    <GuarantorBadge />
    <h1 class="fr-h4">
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
import { useRoute } from 'vue-router'
import GuarantorBadge from '../common/GuarantorBadge.vue'
import { useGuarantorId } from '../guarantorResidency/useGuarantorId'

const route = useRoute()
const store = useTenantStore()
const guarantorId = useGuarantorId()

const tenantId = computed(() => Number(route.params.tenantId))

const isFromValidation = route.query.from === 'validation'
const nextStep = isFromValidation
  ? { name: 'ValidateFile' }
  : { name: 'TenantGuarantors', params: { tenantId: tenantId.value, step: '5' } }

provide(taxKey, {
  category: 'couple-guarantor-tax',
  textKey: 'couple-guarantor',
  previousStep: {
    name: 'TenantGuarantorFinancial',
    params: { tenantId: tenantId.value, guarantorId: guarantorId.value, step: '5' }
  },
  nextStep: nextStep,
  document: computed(() => store.getGuarantorTaxDocument),
  action: 'saveGuarantorTax',
  userId: store.user.id,
  addData(formData) {
    formData.append('tenantId', tenantId.value.toString())
    formData.append('guarantorId', guarantorId.value)
  }
})

const { t } = useI18n()
</script>

<i18n>
{
  "en": {
    "tax-notice": "Tax notice from your spouse's guarantor"
  },
  "fr": {
    "tax-notice": "Avis d’impôt du garant de votre conjoint"
  }
}
</i18n>
