<template>
  <NakedCard class="fr-p-md-5w fr-m-3v">
    <TenantBadge />
    <h1 class="fr-h4">
      {{ t('your-identity-document') }}
    </h1>
    <RouterView />
  </NakedCard>
</template>

<script setup lang="ts">
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { useI18n } from 'vue-i18n'
import TenantBadge from '@/components/common/TenantBadge.vue'
import { computed, provide } from 'vue'
import { useTenantStore } from '@/stores/tenant-store'
import { idDocKey } from '@/components/identityDocument/lib/identityDocumentState'
import { useResidencyLink } from '@/components/residency/lib/useResidencyLink'

const store = useTenantStore()
const residencyLink = useResidencyLink()

provide(idDocKey, {
  category: 'identification',
  textKey: 'tenant',
  previousStep: { name: 'TenantType' },
  nextStep: residencyLink.value,
  document: computed(() => store.getTenantIdentificationDocument),
  action: 'saveTenantIdentification',
  userId: store.user.id
})

const { t } = useI18n()
</script>

<i18n>
{
  "en": {
    "your-identity-document": "Your identity document"
  },
  "fr": {
    "your-identity-document": "Votre pièce d’identité"
  }
}
</i18n>
