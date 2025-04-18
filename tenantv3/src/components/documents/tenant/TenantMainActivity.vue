<template>
  <NakedCard class="fr-p-md-5w fr-m-3v fr-grid-col">
    <h6>{{ t('main-activity') }}</h6>
    <RouterView />
  </NakedCard>
</template>

<script setup lang="ts">
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { useI18n } from 'vue-i18n'
import { computed, provide } from 'vue'
import { useTenantStore } from '@/stores/tenant-store'
import { mainActivityKey } from '@/components/mainActivity/lib/mainActivityState'
const { t } = useI18n()
const store = useTenantStore()

provide(mainActivityKey, {
  category: 'professional',
  textKey: 'tenant',
  previousStep: '/documents-locataire/2', // Todo: update
  nextStep: { name: 'TenantFinancial' },
  document: computed(() => store.getTenantProfessionalDocument),
  userId: undefined
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
