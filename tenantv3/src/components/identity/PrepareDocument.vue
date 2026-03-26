<template>
  <NakedCard class="fr-mt-3v fr-p-md-5w fr-mb-12w">
    <h2 class="fr-h4">{{ t('title') }}</h2>
    <p class="fr-mb-0">
      {{ t('description') }}
      <TrackedExternalLink
        event="documents-list"
        :url="REQUIRED_DOCS_HELP_URL"
        :label="t('help-link')"
        anchor-class="fr-link fr-icon-external-link-line fr-link--icon-right"
      />
    </p>
  </NakedCard>
</template>

<script setup lang="ts">
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { useI18n } from 'vue-i18n'
import TrackedExternalLink from './lib/TrackedExternalLink.vue'

const { t } = useI18n()

const REQUIRED_DOCS_HELP_URL =
  'https://aide.dossierfacile.logement.gouv.fr/fr/article/liste-des-documents-a-fournir-scnv25/'
</script>

<i18n>
{
  "en": {
    "title": "Documents you need",
    "description": "See our online help for the exact list of documents to provide:",
    "help-link": "Online help"
  },
  "fr": {
    "title": "Les documents nécessaires",
    "description": "Consultez l'aide en ligne pour connaître la liste précise des documents à fournir :",
    "help-link": "Aide en ligne"
  }
}
</i18n>
