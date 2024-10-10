<template>
  <div class="full-width">
    <h1 class="fr-h1">{{ t('title') }}</h1>
    <div class="iframe-container">
      <iframe
        title="Statistiques sur metabase"
        :src="metabaseUrl"
        width="100%"
        height="1000"
      ></iframe>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'

useHead({
  title: 'Nos statistiques - DossierFacile',
  meta: [
    {
      name: 'description',
      content:
        'Consultez nos statistiques sur l’utilisation du service (nombre de dossiers créés, nombre de liens partagés, satisfaction des utilisateurs...)'
    }
  ]
})

const { t } = useI18n()
const metabaseUrl = `${import.meta.env.VITE_METABASE_DASHBOARD_URL}`
</script>

<style lang="scss">
.main {
  background-color: var(--bf100-g750);
}

.iframe-container {
  text-align: center;
}
</style>
