<template>
  <div class="fr-container">
    <div class="fr-my-2w fr-grid-row fr-grid-row--gutters fr-grid-row--middle fr-grid-row--center">
      <div class="fr-py-0 fr-col-12 fr-col-md-6">
        <h1>{{ t('file.bad-link.title') }}</h1>
        <p class="fr-text--lead">
          {{ t('file.bad-link.line1') }}
          <br />
          {{ t('file.bad-link.line2') }}
        </p>
        <p class="fr-text--sm">
          <strong>{{ t('file.bad-link.example-label') }}</strong>
          <code class="link-url">{{ exampleLink }}</code>
        </p>
        <p class="fr-text--sm fr-mt-2w">
          <strong>{{ t('file.bad-link.current-link-label') }}</strong>
          <code class="link-url">{{ currentLink }}</code>
        </p>
        <p class="fr-text--sm">
          <a
            href="/contact"
            target="_blank"
            rel="noopener noreferrer"
            :title="`${t('trigram.support-link')} - ${t('new-window')}`"
          >
            {{ t('trigram.support-link') }}
          </a>
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
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const { t } = useI18n()
const route = useRoute()

const TENANT_URL = `https://${import.meta.env.VITE_TENANT_URL}`
const EXAMPLE_UUID = '550e8400-e29b-41d4-a716-446655440000'

const exampleLink = computed(() => {
  return `${TENANT_URL}/file/${EXAMPLE_UUID}`
})

const currentLink = computed(() => {
  const token = Array.isArray(route.params.token) ? route.params.token[0] : route.params.token
  return `${TENANT_URL}/file/${token}`
})
</script>

<style scoped lang="scss">
.link-url {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background-color: var(--background-contrast-grey);
  color: var(--text-default-grey);
  border-radius: 0.25rem;
  font-family: monospace;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}
</style>

