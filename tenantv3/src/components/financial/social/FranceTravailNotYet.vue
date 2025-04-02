<template>
  <BackLinkRow :label="t('form.financial.social-aid')" :to="ancestor" />
  <BackLinkRow
    :label="t('form.financial.you-receive.' + textKey, [t('form.financial.social.france-travail')])"
    :to="grandparent"
  />
  <BackLinkRow :label="t('not-yet-' + suffix)" :to="parent" />
  <EnterMonthlyIncomeBeforeTax />
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
import EnterMonthlyIncomeBeforeTax from '../lib/EnterMonthlyIncomeBeforeTax.vue'
import { useFinancialState } from '../financialState'

const parent = useParentRoute()
const grandparent = useParentRoute(2)
const ancestor = useParentRoute(3)
const { t } = useI18n()
const { suffix, textKey } = useFinancialState()
</script>

<i18n>
{
  "en": {
    "not-yet-tenant": "You're not yet receiving aid",
    "not-yet-other": "They're not yet receiving aid",
    "please-provide": "Please provide the France Travail document {0}.",
    "doc-ARE": "Ouverture de droit à l’allocation d’Aide au Retour à l’Emploi (ARE)"
  },
  "fr": {
    "not-yet-tenant": "Vous ne touchez pas encore l’aide",
    "not-yet-other": "Ne touche pas encore l’aide",
    "please-provide": "Veuillez fournir le document France Travail {0}.",
    "doc-ARE": "Ouverture de droit à l’allocation d’Aide au Retour à l’Emploi (ARE)"
  }
}
</i18n>
