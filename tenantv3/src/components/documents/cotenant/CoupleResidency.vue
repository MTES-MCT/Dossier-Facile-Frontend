<template>
  <NakedCard class="fr-p-md-5w fr-grid-col">
    <h6>{{ t('residency-situation') }}</h6>
    <router-view />
  </NakedCard>
</template>

<script setup lang="ts">
import { makeActivityLink } from '@/components/mainActivity/lib/useMainActivityLink'
import { residencyKey } from '@/components/residency/residencyState'
import { DocumentService } from '@/services/DocumentService'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { computed, provide } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
const { t } = useI18n()
const route = useRoute()

const tenantId = Number(route.params.tenantId)
const step = route.params.step

const mainActivityLink = computed(() => {
  const document = DocumentService.getCoTenantDocument(tenantId, 'PROFESSIONAL')
  const path = `/documents-colocataire/${tenantId}/${step}/3`
  return makeActivityLink(document?.documentSubCategory, path)
})

provide(residencyKey, {
  category: 'couple-residency',
  textKey: 'couple',
  previousStep: {
    name: 'CoupleName',
    params: { tenantId, step }
  },
  nextStep: mainActivityLink.value,
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
