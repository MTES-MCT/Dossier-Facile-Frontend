<template>
  <NakedCard class="fr-p-md-5w fr-m-3v fr-grid-col">
    <TenantBadge />
    <h1 class="fr-h6">{{ t('residency-situation') }}</h1>
    <router-view />
  </NakedCard>
</template>

<script setup lang="ts">
import TenantBadge from '@/components/common/TenantBadge.vue'
import { makeIdentityDocumentLink } from '@/components/identityDocument/lib/identityDocumentLink'
import { makeActivityLink } from '@/components/mainActivity/lib/useMainActivityLink'
import { residencyKey } from '@/components/residency/residencyState'
import { DocumentService } from '@/services/DocumentService'
import { UtilsService } from '@/services/UtilsService'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { computed, provide } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
const { t } = useI18n()
const route = useRoute()

const tenantId = Number(route.params.tenantId)
const step = UtilsService.getParam(route.params.step)

const identityDocumentLink = computed(() => {
  const document = DocumentService.getCoTenantDocument(tenantId, 'IDENTIFICATION')
  const path = `/documents-colocataire/${tenantId}/${step}/1`
  return makeIdentityDocumentLink(document, path)
})

const mainActivityLink = computed(() => {
  const document = DocumentService.getCoTenantDocument(tenantId, 'PROFESSIONAL')
  const path = `/documents-colocataire/${tenantId}/${step}/3`
  return makeActivityLink(document?.documentSubCategory, path)
})

const isFromValidation = route.query.from === 'validation'
const nextStep = isFromValidation ? { name: 'ValidateFile' } : mainActivityLink.value

provide(residencyKey, {
  category: 'couple-residency',
  textKey: 'couple',
  previousStep: identityDocumentLink.value,
  nextStep: nextStep,
  document: computed(() => DocumentService.getCoTenantDocument(tenantId, 'RESIDENCY')),
  userId: tenantId,
  addData: (formData) => {
    formData.append('tenantId', String(tenantId))
  }
})
</script>

<i18n>
{
  "en": {
    "residency-situation": "Your spouse's housing situation",
  },
  "fr": {
    "residency-situation": "Situation d’hébergement de votre conjoint"
  }
}
</i18n>
