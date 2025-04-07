<template>
  <BackLinkRow :label="t('form.financial.social-aid')" :to="ancestor" category="social" />
  <BackLinkRow
    :label="t('form.financial.you-receive.' + textKey, [t('form.financial.social.france-travail')])"
    :to="grandparent"
    category="social"
    step="france-travail"
  />
  <BackLinkRow
    :label="t('form.financial.less-3-months')"
    :to="parent"
    category="social"
    step="france-travail"
    substep="moins-3-mois"
  />
  <EnterMonthlyIncomeBeforeTax />
  <UploadFilesFinancial
    category="SOCIAL_SERVICE"
    step="SOCIAL_SERVICE_FRANCE_TRAVAIL_LESS_3_MONTHS"
  >
    <template #incomeFilled>
      <i18n-t tag="p" keypath="please-provide">
        <strong>{{ t('any-docs') }}</strong>
      </i18n-t>
    </template>
  </UploadFilesFinancial>
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import UploadFilesFinancial from '../lib/UploadFilesFinancial.vue'
import { useI18n } from 'vue-i18n'
import EnterMonthlyIncomeBeforeTax from '../lib/EnterMonthlyIncomeBeforeTax.vue'
import { useFinancialState } from '../financialState'

const parent = useParentRoute()
const grandparent = useParentRoute(2)
const ancestor = useParentRoute(3)
const { t } = useI18n()
const { textKey } = useFinancialState()
</script>

<i18n>
{
  "en": {
    "please-provide": "Please provide {0} (one or two).",
    "any-docs": "any France Travail payment certificates you may have"
  },
  "fr": {
    "please-provide": "Veuillez fournir {0} (une ou deux attestations).",
    "any-docs": "toutes les attestations de paiement France Travail dont vous disposez"
  }
}
</i18n>
