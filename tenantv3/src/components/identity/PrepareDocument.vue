<template>
  <NakedCard class="fr-mt-3v fr-p-md-5w fr-mb-12w">
    <h2 class="fr-h4">{{ t(textKey + '.title') }}</h2>
    <DsfrAlert type="info" small :description="t('common.information-block')" class="fr-mb-3w" />
    <p class="text-bold">{{ t(textKey + '.list-title') }}</p>
    <ul class="fr-mb-2w">
      <li class="fr-mb-1w">
        <TrackedExternalLink
          event="identity"
          :url="`${HELP_URL}/article/1-piece-identite-1j6eask/`"
          :label="t('common.identity-card')"
        />
      </li>
      <li class="fr-mb-1w">
        <TrackedExternalLink
          event="residency"
          :url="`${HELP_URL}/article/2-justificatif-domicile-bon-paiement-loyers-1ftrkb8/`"
          :label="t('common.residency')"
        />
      </li>
      <li class="fr-mb-1w">
        <TrackedExternalLink
          event="professional"
          :url="`${HELP_URL}/article/3-justificatifs-de-situation-professionnelle-rpepjc/`"
          :label="t('common.professional')"
        />
      </li>
      <li class="fr-mb-1w">
        <TrackedExternalLink
          event="financial"
          :url="`${HELP_URL}/article/4-justificatifs-ressources-1uyf090/`"
          :label="t('common.financial')"
        />
      </li>
      <li>
        <TrackedExternalLink
          event="tax"
          :url="`${HELP_URL}/article/5-avis-dimposition-eg82wt/`"
          :label="t('common.tax')"
        />
      </li>
    </ul>
    <TrackedExternalLink
      event="general-help"
      :url="`${HELP_URL}/category/justificatifs-ye12ln/`"
      :label="t('common.online-help-details')"
    />
    <hr class="fr-mt-3w" />
    <p class="text-bold">{{ t('common.guarantor-title') }}</p>
    <TrackedExternalLink
      event="guarantor-help"
      :url="`${HELP_URL}/article/6-les-justificatifs-du-ou-des-garants-1nt94gc/`"
      :label="t('common.online-help')"
    />
  </NakedCard>
</template>

<script setup lang="ts">
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { useI18n } from 'vue-i18n'
import TrackedExternalLink from './lib/TrackedExternalLink.vue'
import { DsfrAlert } from '@gouvminint/vue-dsfr'

defineProps<{
  textKey: 'self' | 'third-party'
}>()

const { t } = useI18n()

const HELP_URL = 'https://aide.dossierfacile.logement.gouv.fr/fr'
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
