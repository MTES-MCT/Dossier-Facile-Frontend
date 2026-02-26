<template>
  <NakedCard class="fr-p-md-5w fr-m-3v fr-grid-col">
    <TenantBadge />
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
import { DocumentService } from '@/services/DocumentService'
import TenantBadge from '../common/TenantBadge.vue'
import { useHandleValidationNavigation } from '@/composables/useInternalNavigation'

const route = useRoute()
const store = useTenantStore()
const { getNavigationNextStep } = useHandleValidationNavigation()

const tenantId = computed(() => Number(route.params.tenantId))

const nextStep = getNavigationNextStep({
  name: 'TenantGuarantors',
  params: { tenantId: tenantId.value, step: '5' }
})

provide(taxKey, {
  category: 'couple-tax',
  textKey: 'couple',
  previousStep: { name: 'CoupleFinancial', params: { tenantId: tenantId.value } },
  nextStep: nextStep,
  document: computed(() => {
    const tenant = store.getTenant(tenantId.value)
    return DocumentService.getDoc('TAX', tenant.documents)
  }),
  action: 'saveTenantTax',
  userId: store.user.id,
  addData(formData) {
    formData.append('tenantId', tenantId.value.toString())
  }
})

const { t } = useI18n()
</script>

<i18n>
{
  "en": {
    "tax-notice": "Your spouse's tax notice"
  },
  "fr": {
    "tax-notice": "Avis d’impôt de votre conjoint"
  }
}
</i18n>
