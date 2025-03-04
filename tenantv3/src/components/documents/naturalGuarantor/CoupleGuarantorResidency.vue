<template>
  <NakedCard class="fr-p-md-5w">
    <h6>{{ t('guarantor-residency-situation') }}</h6>
    <router-view />
  </NakedCard>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'
import { useI18n } from 'vue-i18n'
import { residencyKey } from '@/components/residency/residencyState'
import useTenantStore from '@/stores/tenant-store'
import { useGuarantorId } from '@/components/guarantorResidency/useGuarantorId'
import { useRoute } from 'vue-router'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'

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

provide(residencyKey, {
  category: 'couple-guarantor-residency',
  textKey: 'couple',
  previousStep: {
    name: 'TenantGuarantorDocuments',
    params: {
      tenantId,
      guarantorId: guarantorId.value,
      step,
      substep: 1
    }
  },
  nextStep: {
    name: 'TenantGuarantorDocuments',
    params: {
      tenantId,
      guarantorId: guarantorId.value,
      step,
      substep: 3
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
