<template>
  <BackLinkRow :label="t('form.financial.social-aid')" :to="ancestor" />
  <BackLinkRow
    :label="t('form.financial.you-receive.' + textKey, [t('form.financial.social.apl')])"
    :to="grandparent"
  />
  <BackLinkRow :label="t('form.financial.more-3-months')" :to="parent" />
  <EnterMonthlyIncome />
  <UploadFilesFinancial category="SOCIAL_SERVICE" step="SOCIAL_SERVICE_APL_MORE_3_MONTHS">
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
import { useParentRoute } from '../../guarantorResidency/useParentRoute'
import UploadFilesFinancial from '../lib/UploadFilesFinancial.vue'
import { lastMonths } from '../lib/lastMonths'
import { useI18n } from 'vue-i18n'
import { useFinancialState } from '../financialState'
import EnterMonthlyIncome from '../lib/EnterMonthlyIncome.vue'

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
    "please-provide": "Please provide proof of payment for {months}. You can add the {month} receipt if you have it.",
    "months": "{0}, {1} and {2}",
  },
  "fr": {
    "please-provide": "Veuillez fournir les justificatifs de versement de {months}. Vous pouvez ajouter le justificatif de {month} si vous l’avez.",
    "months": "{0}, {1} et {2}",
  }
}
</i18n>
