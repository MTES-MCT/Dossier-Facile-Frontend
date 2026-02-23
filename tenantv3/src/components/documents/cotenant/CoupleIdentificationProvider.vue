<template>
  <NakedCard class="fr-p-md-5w fr-m-3v">
    <TenantBadge />
    <h1 class="fr-h4">{{ t('spouse-identity-document') }}</h1>
    <RouterView />
  </NakedCard>
</template>

<script setup lang="ts">
import TenantBadge from '@/components/common/TenantBadge.vue'
import { idDocKey } from '@/components/identityDocument/lib/identityDocumentState'
import { makeResidencyLink } from '@/components/residency/lib/useResidencyLink'
import { DocumentService } from '@/services/DocumentService'
import { useTenantStore } from '@/stores/tenant-store'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { computed, provide } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const store = useTenantStore()
const route = useRoute()
const { t } = useI18n()

const tenantId = computed(() => Number(route.params.tenantId))
const residencyLink = computed(() => {
  const cotenant = store.getTenant(tenantId.value)
  const step = Number(route.params.step) || 0
  return makeResidencyLink(cotenant, `/documents-colocataire/${tenantId.value}/${step}/2`)
})

const isFromValidation = route.query.from === 'validation'
const nextStep = isFromValidation ? { name: 'ValidateFile' } : residencyLink.value

provide(idDocKey, {
  category: 'couple-identification',
  textKey: 'couple',
  document: computed(() => DocumentService.getCoTenantDocument(tenantId.value, 'IDENTIFICATION')),
  previousStep: { name: 'CoupleName', params: { tenantId: tenantId.value } },
  nextStep: nextStep,
  userId: tenantId.value,
  action: 'saveTenantIdentification',
  addData: (formData) => {
    formData.append('tenantId', String(tenantId.value))
  }
})
</script>

<i18n>
{
  "en": {
    "spouse-identity-document": "Your spouse's identity document"
  },
  "fr": {
    "spouse-identity-document": "Pièce d’identité de votre conjoint"
  }
}
</i18n>
