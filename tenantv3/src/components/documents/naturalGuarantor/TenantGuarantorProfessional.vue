<template>
  <NakedCard class="fr-p-md-5w fr-m-3v fr-grid-col">
    <GuarantorBadge />
    <h2 class="fr-h6">{{ t('main-activity') }}</h2>
    <RouterView />
  </NakedCard>
</template>

<script setup lang="ts">
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { useI18n } from 'vue-i18n'
import { computed, provide } from 'vue'
import { useTenantStore } from '@/stores/tenant-store'
import { mainActivityKey } from '@/components/mainActivity/lib/mainActivityState'
import { useGuarantorId } from '@/components/guarantorResidency/useGuarantorId'
import { useRoute } from 'vue-router'
import GuarantorBadge from '@/components/common/GuarantorBadge.vue'
import { makeCotenantGuarantorResidencyLink } from '@/components/guarantorResidency/makeGuarantorResidencyLink'
const { t } = useI18n()
const store = useTenantStore()
const route = useRoute()
const guarantorId = useGuarantorId()
const tenantId = computed(() => Number(route.params.tenantId))

const residencyLink = computed(() => {
  const coTenants = store.user.apartmentSharing?.tenants.filter((t) => t.id != store.user.id)
  const coTenant = coTenants?.find((r) => r.id === tenantId.value)
  const guarantor = coTenant?.guarantors?.find((g) => g.id === Number(guarantorId.value))
  const document = guarantor?.documents?.find((d) => d.documentCategory === 'RESIDENCY')
  return makeCotenantGuarantorResidencyLink(tenantId.value, Number(guarantorId.value), document)
})

provide(mainActivityKey, {
  category: 'couple-guarantor-professional',
  textKey: 'couple-guarantor',
  previousStep: residencyLink.value,
  nextStep: { name: 'TenantGuarantorFinancial' },
  document: computed(() => store.getGuarantorProfessionalDocument),
  userId: store.user.id,
  action: 'saveGuarantorProfessional',
  addData: (formData) => {
    formData.append('tenantId', tenantId.value.toString())
    formData.append('guarantorId', guarantorId.value)
  }
})
</script>

<i18n>
{
  "en": {
    "main-activity": "Main activity",
  },
  "fr": {
    "main-activity": "Activité principale"
  }
}
</i18n>
