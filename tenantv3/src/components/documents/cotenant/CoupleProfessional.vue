<template>
  <NakedCard class="fr-p-md-5w fr-m-3v fr-grid-col">
    <h2 class="fr-h6">{{ t('main-activity') }}</h2>
    <RouterView />
  </NakedCard>
</template>

<script setup lang="ts">
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { useI18n } from 'vue-i18n'
import { computed, provide } from 'vue'
import { mainActivityKey } from '@/components/mainActivity/lib/mainActivityState'
import { useRoute } from 'vue-router'
import { DocumentService } from '@/services/DocumentService'
import { useTenantStore } from '@/stores/tenant-store'
import { makeResidencyLink } from '@/components/residency/lib/useResidencyLink'
const { t } = useI18n()
const route = useRoute()
const tenantId = Number(route.params.tenantId)
const store = useTenantStore()

const residencyLink = computed(() => {
  const cotenant = store.getTenant(tenantId)
  const step = Number(route.params.step) || 0
  return makeResidencyLink(cotenant, `/documents-colocataire/${tenantId}/${step}/2`)
})

provide(mainActivityKey, {
  category: 'couple-professional',
  textKey: 'couple',
  previousStep: residencyLink.value,
  nextStep: { name: 'CoupleFinancial', params: { tenantId } },
  document: computed(() => DocumentService.getCoTenantDocument(tenantId, 'PROFESSIONAL')),
  userId: tenantId,
  action: 'saveTenantProfessional',
  addData: (formData) => {
    formData.append('tenantId', tenantId.toString())
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
