<template>
  <NakedCard class="fr-p-md-5w fr-m-3v fr-grid-col">
    <TenantBadge />
    <h6>{{ t('residency-situation') }}</h6>
    <router-view />
  </NakedCard>
</template>

<script setup lang="ts">
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { useI18n } from 'vue-i18n'
import { residencyKey } from '@/components/residency/residencyState'
import { computed, provide } from 'vue'
import { useTenantStore } from '@/stores/tenant-store'
import { useMainActivityLink } from '@/components/mainActivity/lib/useMainActivityLink'
import TenantBadge from '@/components/common/TenantBadge.vue'
import { useIdentityDocumentLink } from '@/components/identityDocument/lib/identityDocumentLink'
const { t } = useI18n()
const store = useTenantStore()
const identityDocumentLink = useIdentityDocumentLink()
const mainActivityLink = useMainActivityLink()

provide(residencyKey, {
  category: 'residency',
  textKey: 'tenant',
  previousStep: identityDocumentLink.value,
  nextStep: mainActivityLink.value,
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
