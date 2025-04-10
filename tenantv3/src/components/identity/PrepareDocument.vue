<template>
  <NakedCard class="fr-mt-3v fr-p-md-5w fr-mb-12w">
    <h2 class="fr-h4">{{ t(textKey + '.title') }}</h2>
    <div class="fr-alert fr-alert--info fr-mb-3w">
      <p>{{ t('common.information-block') }}</p>
    </div>
    <p class="text-bold">{{ t(textKey + '.list-title') }}</p>
    <ul class="fr-mb-2w">
      <li class="fr-mb-1w">
        <TrackedExternalLink :external-doc="EXTERNAL_DOCUMENTATIONS.IDENTITY">
          {{ t('common.identity-card') }}
        </TrackedExternalLink>
      </li>
      <li class="fr-mb-1w">
        <TrackedExternalLink :external-doc="EXTERNAL_DOCUMENTATIONS.RESIDENCY">
          {{ t('common.residency') }}
        </TrackedExternalLink>
      </li>
      <li class="fr-mb-1w">
        <TrackedExternalLink :external-doc="EXTERNAL_DOCUMENTATIONS.PROFESSIONAL">
          {{ t('common.professional') }}
        </TrackedExternalLink>
      </li>
      <li class="fr-mb-1w">
        <TrackedExternalLink :external-doc="EXTERNAL_DOCUMENTATIONS.FINANCIAL">
          {{ t('common.financial') }}
        </TrackedExternalLink>
      </li>
      <li>
        <TrackedExternalLink :external-doc="EXTERNAL_DOCUMENTATIONS.TAX">
          {{ t('common.tax') }}
        </TrackedExternalLink>
      </li>
    </ul>
    <TrackedExternalLink :external-doc="EXTERNAL_DOCUMENTATIONS.GENERAL_HELP">
      {{ t('common.online-help-details') }}
    </TrackedExternalLink>
    <hr class="fr-mt-3w" />
    <p class="text-bold">{{ t('common.guarantor-title') }}</p>
    <TrackedExternalLink :external-doc="EXTERNAL_DOCUMENTATIONS.GUARANTOR_HELP">
      {{ t('common.online-help') }}
    </TrackedExternalLink>
  </NakedCard>
</template>

<script setup lang="ts">
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { useI18n } from 'vue-i18n'
import TrackedExternalLink from './lib/TrackedExternalLink.vue'
import { EXTERNAL_DOCUMENTATIONS } from './lib/ExternalDocumentation'

defineProps<{
  textKey: 'self' | 'third-party'
}>()

const { t } = useI18n()
</script>

<i18n>
{
  "en": {
    "common": {
      "information-block": "The documents in the file will be protected by a watermark to ensure their security.",
      "identity-card": "Identity document",
      "residency" : "Proof of residency",
      "professional": "Proof of professional situation",
      "financial": "Proof of resources",
      "tax": "Tax notice",
      "online-help-details": "Check our online help for more details",
      "online-help": "Check our online help",
      "guarantor-title": "Guarantor's supporting documents:"
    },
    "self": {
      "title": "Prepare your documents",
      "list-title": "Your supporting documents:"
    },
    "third-party": {
      "title": "Prepare the tenant's documents",
      "list-title": "The tenant's supporting documents:"
    }
  },
  "fr": {
    "common": {
      "information-block": "Les pièces du dossier seront protégées par un filigrane afin d'assurer leur sécurité.",
      "identity-card": "Pièce d'identité",
      "residency" : "Justificatif de situation d'hébergement",
      "professional": "Justificatif de situation professionnelle",
      "financial": "Justificatif de ressources",
      "tax": "Avis d'imposition",
      "online-help-details": "Consultez notre aide en ligne pour plus de détails",
      "online-help": "Consultez notre aide en ligne",
      "guarantor-title": "Les pièces justificatives du garant :"
    },
    "self": {
      "title": "Préparer vos documents",
      "list-title": "Vos pièces justificatives :"
    },
    "third-party": {
      "title": "Préparer les documents du futur locataire",
      "list-title": "Les pièces justificatives du futur locataire :"
    }
  }
}
</i18n>
