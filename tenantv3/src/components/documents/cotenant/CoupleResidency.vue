<template>
  <NakedCard class="fr-p-md-5w fr-grid-col">
    <h6>{{ t('residency-situation') }}</h6>
    <router-view />
  </NakedCard>
</template>

<script setup lang="ts">
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
provide(residencyKey, {
  category: 'couple-residency',
  textKey: 'couple',
  previousStep: {
    name: 'CoupleName',
    params: { tenantId, step }
  },
  nextStep: {
    name: 'CoupleProfessional',
    params: { tenantId, step }
  },
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
