<template>
  <BackLinkRow :label="t('form.financial.social-aid')" :to="ancestor" />
  <BackLinkRow
    :label="t('form.financial.you-receive', [t('form.financial.social.france-travail')])"
    :to="grandparent"
  />
  <BackLinkRow :label="t('not-yet')" :to="parent" />
  <i18n-t tag="p" keypath="enter-income" class="fr-mb-1w">
    <strong>{{ t('monthly-income') }}</strong>
  </i18n-t>
  <UploadFilesFinancial category="SOCIAL_SERVICE" step="SOCIAL_SERVICE_FRANCE_TRAVAIL_NOT_YET">
    <template #incomeFilled>
      <i18n-t tag="p" keypath="please-provide">
        <strong>{{ t('doc-ARE') }}</strong>
      </i18n-t>
    </template>
  </UploadFilesFinancial>
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import { useParentRoute } from '../../guarantorResidency/useParentRoute'
import UploadFilesFinancial from '../lib/UploadFilesFinancial.vue'
import { useI18n } from 'vue-i18n'

const parent = useParentRoute()
const grandparent = useParentRoute(2)
const ancestor = useParentRoute(3)
const { t } = useI18n()
</script>

<i18n>
{
  "en": {
    "not-yet": "You're not yet receiving aid",
    "enter-income": "Enter your {0}, without commas:",
    "monthly-income":"average net monthly income before withholding tax",
    "please-provide": "Please provide the France Travail document {0}.",
    "doc-ARE": "Ouverture de droit à l’allocation d’Aide au Retour à l’Emploi (ARE)"
  },
  "fr": {
    "not-yet": "Vous ne touchez pas encore l’aide",
    "enter-income": "Saisissez votre {0}, sans virgule :",
    "monthly-income":"revenu mensuel net moyen avant prélèvement à la source",
    "please-provide": "Veuillez fournir le document France Travail {0}.",
    "doc-ARE": "Ouverture de droit à l’allocation d’Aide au Retour à l’Emploi (ARE)"
  }
}
</i18n>
