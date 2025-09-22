<template>
  <NakedCard class="fr-p-md-5w fr-m-3v">
    <GuarantorBadge />
    <h1 class="fr-h6">{{ t('guarantor-residency-situation') }}</h1>
    <router-view />
  </NakedCard>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'
import { useI18n } from 'vue-i18n'
import { residencyKey } from '@/components/residency/residencyState'
import { useTenantStore } from '@/stores/tenant-store'
import { useGuarantorId } from '@/components/guarantorResidency/useGuarantorId'
import { useRoute } from 'vue-router'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import GuarantorBadge from '@/components/common/GuarantorBadge.vue'
import { makeSpouseGuarantorIdDocLink } from '@/components/identityDocument/lib/identityDocumentLink'

const { t } = useI18n()
const store = useTenantStore()
const route = useRoute()
const guarantorId = useGuarantorId()

const tenantId = Number(route.params.tenantId)
const step = route.params.step

const document = computed(() => {
  const { tenantId, guarantorId } = route.params
  const coTenants = store.user.apartmentSharing?.tenants.filter((t) => t.id != store.user.id)
  const coTenant = coTenants?.find((r) => r.id === Number(tenantId))
  const guarantor = coTenant?.guarantors?.find((g) => g.id === Number(guarantorId))
  return guarantor?.documents?.find((d) => d.documentCategory === 'RESIDENCY')
})

const identificationLink = computed(() => {
  const { guarantorId } = route.params
  const tenantId = Number(route.params.tenantId)
  const coTenants = store.user.apartmentSharing?.tenants.filter((t) => t.id != store.user.id)
  const coTenant = coTenants?.find((r) => r.id === tenantId)
  const guarantor = coTenant?.guarantors?.find((g) => g.id === Number(guarantorId))
  return guarantor
    ? makeSpouseGuarantorIdDocLink(guarantor, tenantId)
    : `/garants-locataire/${tenantId}/5`
})

provide(residencyKey, {
  category: 'couple-guarantor-residency',
  textKey: 'couple',
  previousStep: identificationLink.value,
  nextStep: {
    name: 'TenantGuarantorProfessional',
    params: {
      tenantId,
      guarantorId: guarantorId.value,
      step
    }
  },
  document,
  userId: tenantId,
  addData: (formData) => {
    formData.append('guarantorId', guarantorId.value)
    formData.append('tenantId', tenantId.toString())
  }
})
</script>

<i18n>
{
  "en": {
    "guarantor-residency-situation" : "Housing situation of your spouse's guarantor"
  },
  "fr": {
    "guarantor-residency-situation" : "Situation d'hébergement du garant de votre conjoint"
  }
}
</i18n>
