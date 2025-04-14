<template>
  <div
    class="fr-container fr-container-full-size bg--grey full-height fr-grid-row fr-p-3v justify-content-center"
  >
    <div class="max-600 fr-col-12">
      <TenanIdentity />
      <PrepareDocument v-if="hasToDisplayInformations()" :text-key="getTextKey()" />
    </div>
  </div>
</template>

<script setup lang="ts">
import TenanIdentity from '../components/identity/TenantIdentity.vue'
import { useRoute } from 'vue-router'
import PrepareDocument from '@/components/identity/PrepareDocument.vue'

const currentRoute = useRoute()

const hasToDisplayInformations = () => {
  return (
    currentRoute.path === '/nom-locataire/pour-moi' ||
    currentRoute.path === '/nom-locataire/pour-une-autre-personne'
  )
}

const getTextKey = () => {
  if (currentRoute.path === '/nom-locataire/pour-moi') {
    return 'self'
  } else {
    return 'third-party'
  }
}
</script>
