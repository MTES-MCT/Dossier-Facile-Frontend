<template>
  <NakedCard class="fr-mt-3v fr-p-md-5w">
    <h4>{{ t(textKey + '.title') }}</h4>
    <div class="fr-alert fr-alert--info fr-mb-3w">
      <p>{{ t('common.information-block') }}</p>
    </div>
    <p class="text-bold">{{ t(textKey + '.list-title') }}</p>
    <ul class="fr-mb-2w">
      <li class="fr-mb-1w">
        <a
          href="https://aide.dossierfacile.logement.gouv.fr/fr/article/1-piece-identite-1j6eask/"
          target="_blank"
        >
          {{ t('common.identity-card') }}
        </a>
      </li>
      <li class="fr-mb-1w">
        <a
          href="https://aide.dossierfacile.logement.gouv.fr/fr/article/2-justificatif-domicile-bon-paiement-loyers-1ftrkb8/"
          target="_blank"
        >
          {{ t('common.residency') }}
        </a>
      </li>
      <li class="fr-mb-1w">
        <a
          href="https://aide.dossierfacile.logement.gouv.fr/fr/article/3-justificatifs-de-situation-professionnelle-rpepjc/"
          target="_blank"
        >
          {{ t('common.professional') }}
        </a>
      </li>
      <li class="fr-mb-1w">
        <a
          href="https://aide.dossierfacile.logement.gouv.fr/fr/article/4-justificatifs-ressources-1uyf090/"
          target="_blank"
        >
          {{ t('common.financial') }}
        </a>
      </li>
      <li>
        <a
          href="https://aide.dossierfacile.logement.gouv.fr/fr/article/5-avis-dimposition-eg82wt/"
          target="_blank"
        >
          {{ t('common.tax') }}
        </a>
      </li>
    </ul>
    <a
      href="https://aide.dossierfacile.logement.gouv.fr/fr/category/justificatifs-ye12ln/"
      target="_blank"
    >
      {{ t('common.online-help-details') }}
    </a>
    <hr class="fr-mt-3w" />
    <p class="text-bold">{{ t('common.guarantor-title') }}</p>
    <a
      href="https://aide.dossierfacile.logement.gouv.fr/fr/article/6-les-justificatifs-du-ou-des-garants-1nt94gc/"
      target="_blank"
    >
      {{ t('common.online-help') }}
    </a>
    <div v-if="textKey === 'third-party'">
      <hr class="fr-mt-3w" />
      <div class="fr-highlight">
        <p>
          {{ t('third-party.highlight') }}
        </p>
      </div>
    </div>
  </NakedCard>
</template>

<script setup lang="ts">
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { useI18n } from 'vue-i18n'

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
      "list-title": "Your supporting documents:",
    },
    "third-party": {
      "title": "Prepare the tenant's documents",
      "list-title": "The tenant's supporting documents:",
      "highlight": "If you want to create a file for another child or another person, you will need to create a second account with a different email address."
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
      "list-title": "Vos pièces justificatives :",
    },
    "third-party": {
      "title": "Préparer les documents du futur locataire",
      "list-title": "Les pièces justificatives du futur locataire :",
      "highlight": " Si vous souhaitez créer un dossier pour un autre enfant ou une autre personne, vous devrez créer un second compte avec une adresse e-mail différente."
    }
  }
}
</i18n>
