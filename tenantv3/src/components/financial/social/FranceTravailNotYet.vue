<template>
  <BackLinkRow :label="t('form.financial.social-aid')" :to="ancestor" category="social" />
  <BackLinkRow
    :label="t('form.financial.you-receive.' + textKey, [t('form.financial.social.france-travail')])"
    :to="grandparent"
    category="social"
    step="france-travail"
  />
  <BackLinkRow
    :label="t('not-yet-' + suffix)"
    :to="parent"
    category="social"
    step="france-travail"
    substep="pas-encore"
  />
  <EnterMonthlyIncome before-tax :amount="1200" />
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
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import UploadFilesFinancial from '../lib/UploadFilesFinancial.vue'
import { useI18n } from 'vue-i18n'
import EnterMonthlyIncome from '../lib/EnterMonthlyIncome.vue'
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
