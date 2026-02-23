<template>
  <NakedCard class="fr-p-md-5w fr-m-3v fr-grid-col">
    <TenantBadge />
    <h1 class="fr-h4">{{ t('main-activity') }}</h1>
    <RouterView />
  </NakedCard>
</template>

<script setup lang="ts">
import TenantBadge from '@/components/common/TenantBadge.vue'
import { mainActivityKey } from '@/components/mainActivity/lib/mainActivityState'
import { useResidencyLink } from '@/components/residency/lib/useResidencyLink'
import { useHandleValidationNavigation } from '@/composables/useInternalNavigation'
import { useTenantStore } from '@/stores/tenant-store'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { computed, provide } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useTenantStore()
const residencyLink = useResidencyLink()
const { getNavigationNextStep } = useHandleValidationNavigation()

const nextStep = getNavigationNextStep({ name: 'TenantFinancial' })

provide(mainActivityKey, {
  category: 'professional',
  textKey: 'tenant',
  previousStep: residencyLink.value,
  nextStep: nextStep,
  document: computed(() => store.getTenantProfessionalDocument),
  userId: undefined,
  action: 'saveTenantProfessional'
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
