<template>
  <BackLinkRow :label="t('form.financial.social-aid')" :to="ancestor" category="social" />
  <BackLinkRow
    :label="t('form.financial.you-receive.' + textKey, [t('form.financial.social.france-travail')])"
    :to="grandparent"
    category="social"
    step="france-travail"
  />
  <BackLinkRow
    :label="t('form.financial.more-3-months')"
    :to="parent"
    category="social"
    step="france-travail"
    substep="plus-3-mois"
  />
  <EnterMonthlyIncome before-tax :amount="1200" />
  <UploadFilesFinancial
    category="SOCIAL_SERVICE"
    step="SOCIAL_SERVICE_FRANCE_TRAVAIL_MORE_3_MONTHS"
  >
    <template #incomeFilled>
      <i18n-t tag="p" keypath="please-provide">
        <template #months>
          <strong>{{ t('months', [...months.slice(0, 3)]) }}</strong>
        </template>
        <template #month>{{ months[3] }}</template>
      </i18n-t>
    </template>
  </UploadFilesFinancial>
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import UploadFilesFinancial from '../lib/UploadFilesFinancial.vue'
import { lastMonths } from '../lib/lastMonths'
import { useI18n } from 'vue-i18n'
import EnterMonthlyIncome from '../lib/EnterMonthlyIncome.vue'
import { useFinancialState } from '../financialState'

const parent = useParentRoute()
const grandparent = useParentRoute(2)
const ancestor = useParentRoute(3)
const months = lastMonths()
const { t } = useI18n()
const { textKey } = useFinancialState()
</script>

<i18n>
{
  "en": {
    "please-provide": "Please provide France Travail payment certificates for {months}. You can add the {month} attestation if you have it.",
    "months": "{0}, {1} et {2}",
  },
  "fr": {
    "please-provide": "Veuillez fournir les attestations de paiement France Travail de {months}. Vous pouvez ajouter l’attestation de {month} si vous l’avez.",
    "months": "{0}, {1} et {2}",
  }
}
</i18n>
