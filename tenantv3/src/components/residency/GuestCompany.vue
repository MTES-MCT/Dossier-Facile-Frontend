<template>
  <BackLinkRow
    :label="t('guest-company')"
    to="../2"
    @edit="AnalyticsService.editSituation(category, 'guest-company')"
  />
  <i18n-t :keypath="textKey + '.please-provide'" tag="p">
    <strong>{{ t(textKey + '.attestation') }}</strong>
  </i18n-t>
  <p class="fr-mb-0">{{ t(textKey + '.if-no-add') }}</p>
  <ul>
    <li>{{ t(textKey + '.pay-slip') }}</li>
    <li>{{ t(textKey + '.contract') }}</li>
  </ul>
  <i18n-t :keypath="textKey + '.recommend-statement'" tag="p">
    <a href="https://www.service-public.fr/simulateur/calcul/AttestationHebergement" target="_blank"
      >service-public.fr</a
    >
  </i18n-t>
  <UploadFiles category="GUEST_COMPANY" />
  <ResidencyFooter />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import BackLinkRow from './lib/BackLinkRow.vue'
import ResidencyFooter from './lib/ResidencyFooter.vue'
import UploadFiles from './lib/UploadFiles.vue'
import { AnalyticsService } from '@/services/AnalyticsService'
import { useResidencyState } from './residencyState'
const { t } = useI18n()
const { category, textKey } = useResidencyState()
</script>

<i18n>
{
  "en": {
    "guest-company": "In a staff housing",
    "tenant": {
      "please-provide": "Please provide {0} stating that you benefit from company housing",
      "attestation": "an attestation from your employer",
      "if-no-add": "If you don't have any, you can add:",
      "pay-slip": "a pay slip showing the company's accomodation",
      "contract": "an employment contract mentioning your company housing",
      "recommend-statement": "We recommend that you also include a sworn statement explaining your situation. You can use the model available on the {0} website."
    },
    "couple": {
      "please-provide": "Please provide {0} stating that your spouse benefit from company housing",
      "attestation": "an attestation from your spouse's employer",
      "if-no-add": "If they don't have any, you can add:",
      "pay-slip": "a pay slip showing the company's accomodation",
      "contract": "an employment contract mentioning the company housing",
      "recommend-statement": "We recommend that you also include a sworn statement explaining the situation. You can use the model available on the {0} website."
    }
  },
  "fr": {
    "guest-company": "Dans un logement de fonction",
    "tenant": {
      "please-provide": "Veuillez fournir {0} indiquant que vous bénéficiez d’un logement de fonction.",
      "attestation": "une attestation de votre employeur",
      "if-no-add": "Si vous n’en avez pas, vous pouvez ajouter, au choix :",
      "pay-slip": "un bulletin de salaire sur lequel le logement de fonction est visible",
      "contract": "un contrat de travail qui mentionne votre logement de fonction",
      "recommend-statement": "Nous vous recommandons d’ajouter également une attestation sur l’honneur expliquant votre situation. Vous pouvez utiliser le modèle disponible sur le site {0}."
    },
    "couple": {
      "please-provide": "Veuillez fournir {0} indiquant qu’il bénéficie d’un logement de fonction.",
      "attestation": "une attestation de l’employeur de votre conjoint",
      "if-no-add": "S’il n’en a pas, vous pouvez ajouter, au choix :",
      "pay-slip": "un bulletin de salaire sur lequel le logement de fonction est visible",
      "contract": "un contrat de travail qui mentionne le logement de fonction",
      "recommend-statement": "Nous vous recommandons d’ajouter également une attestation sur l’honneur expliquant la situation. Vous pouvez utiliser le modèle disponible sur le site {0}."
    }
  }
}
</i18n>
