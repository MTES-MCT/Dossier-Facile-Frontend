<template>
  <NakedCard class="fr-p-md-5w fr-m-3v fr-grid-col">
    <TenantBadge />
    <h1 class="fr-h6">{{ t('residency-situation') }}</h1>
    <router-view />
  </NakedCard>
</template>

<script setup lang="ts">
import TenantBadge from '@/components/common/TenantBadge.vue'
import { useIdentityDocumentLink } from '@/components/identityDocument/lib/identityDocumentLink'
import { useMainActivityLink } from '@/components/mainActivity/lib/useMainActivityLink'
import { residencyKey } from '@/components/residency/residencyState'
import { useHandleValidationNavigation } from '@/composables/useInternalNavigation'
import { useTenantStore } from '@/stores/tenant-store'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { computed, provide } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useTenantStore()
const identityDocumentLink = useIdentityDocumentLink()
const mainActivityLink = useMainActivityLink()
const { getNavigationNextStep } = useHandleValidationNavigation()

const nextStep = getNavigationNextStep(mainActivityLink.value)

provide(residencyKey, {
  category: 'residency',
  textKey: 'tenant',
  previousStep: identityDocumentLink.value,
  nextStep: nextStep,
  document: computed(() => store.getTenantResidencyDocument),
  userId: undefined
})
</script>

<i18n>
{
  "en": {
    "residency-situation": "Your housing situation",
  },
  "fr": {
    "residency-situation": "Votre situation d'hébergement"
  }
}
</i18n>
