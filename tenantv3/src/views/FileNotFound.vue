<template>
  <div class="fr-container">
    <div class="fr-my-2w fr-grid-row fr-grid-row--gutters fr-grid-row--middle fr-grid-row--center">
      <div class="fr-py-0 fr-col-12 fr-col-md-6">
        <h1>{{ t('file.not-found.title') }}</h1>
        <p class="fr-text--lead">
          {{ t('file.not-found.line1') }}
          <br />
          {{ t('file.not-found.line2') }}
        </p>
      </div>
      <div class="fr-col-12 fr-col-md-3 fr-col-offset-md-1 fr-px-6w fr-px-md-0 fr-py-0">
        <Artwork pictogram="connection-lost" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Artwork from 'df-shared-next/src/components/ArtworkImage.vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>
