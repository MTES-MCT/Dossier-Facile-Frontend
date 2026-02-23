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
import { useRoute } from 'vue-router'

const store = useTenantStore()
const route = useRoute()
const residencyLink = useResidencyLink()

const isFromValidation = route.query.from === 'validation'
const nextStep = isFromValidation ? { name: 'ValidateFile' } : residencyLink.value

provide(idDocKey, {
  category: 'identification',
  textKey: 'tenant',
  previousStep: isFromValidation ? { name: 'ValidateFile' } : { name: 'TenantType' },
  nextStep: nextStep,
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
