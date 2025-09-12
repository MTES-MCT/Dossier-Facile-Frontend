<template>
  <BackLinkRow
    :label="t('garantor-guest-company')"
    :to="parentRoute"
    @edit="AnalyticsService.editSituation(category, 'guest-company')"
  />
  <i18n-t keypath="please-provide" tag="p">
    <strong>{{ t(textKey + '.company-proof') }}</strong>
  </i18n-t>
  <p class="fr-mb-0">{{ t('no-proof-title') }}</p>
  <ul>
    <li>{{ t('no-proof-1') }}</li>
    <li>{{ t('no-proof-2') }}</li>
  </ul>
  <i18n-t keypath="advice" tag="p">
    <a
      href="https://www.service-public.fr/simulateur/calcul/AttestationHebergement"
      :title="`service-public.fr - ${t('new-window')}`"
      target="_blank"
      >service-public.fr</a
    >
  </i18n-t>

  <UploadFiles category="GUEST_COMPANY" guarantor />
  <GuarantorResidencyFooter />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import UploadFiles from '@/components/residency/lib/UploadFiles.vue'
import BackLinkRow from '@/components/residency/lib/BackLinkRow.vue'
import GuarantorResidencyFooter from './GuarantorResidencyFooter.vue'
import { AnalyticsService } from '@/services/AnalyticsService'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import { useResidencyState } from '../residency/residencyState'
const { t } = useI18n()
const parentRoute = useParentRoute()
const { category, textKey } = useResidencyState()
</script>

<i18n>
{
  "en": {
    "garantor-guest-company": "In staff housing",
    "please-provide" : "Please provide {0} stating that he/she benefits from company housing.",
    "no-proof-title": "If it doesn't have one, you can add:",
    "no-proof-1": "a pay slip showing the company's accomodation",
    "no-proof-2": "an employment contract mentioning the company housing",
    "advice": "We recommend that you also include a sworn statement explaining the situation. You can use the model available on the {0} website.",
    "tenant": {
      "company-proof": "a certificate from your guarantor's employer"
    },
    "couple": {
      "company-proof": "a certificate from their guarantor's employer"
    }
  },
  "fr": {
    "garantor-guest-company": "Dans un logement de fonction",
    "please-provide" : "Veuillez fournir {0} indiquant qu'il bénéficie d'un logement de fonction.",
    "no-proof-title": "S’il n’en a pas, vous pouvez ajouter, au choix :",
    "no-proof-1": "un bulletin de salaire sur lequel le logement de fonction est visible",
    "no-proof-2": "un contrat de travail qui mentionne le logement de fonction",
    "advice": "Nous vous recommandons d’ajouter également une attestation sur l’honneur expliquant la situation. Vous pouvez utiliser le modèle disponible sur le site {0}",
    "tenant": {
      "company-proof": "une attestation de l'employeur de votre garant"
    },
    "couple": {
      "company-proof": "une attestation de l'employeur de son garant"
    }
  }
}
</i18n>
