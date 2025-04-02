<template>
  <BackLinkRow :label="t('form.financial.social-aid')" :to="ancestor" />
  <BackLinkRow
    :label="t('form.financial.you-receive.' + textKey, [t('form.financial.social.apl')])"
    :to="grandparent"
  />
  <BackLinkRow :label="t('form.financial.less-3-months')" :to="parent" />
  <EnterMonthlyIncome />
  <UploadFilesFinancial category="SOCIAL_SERVICE" step="SOCIAL_SERVICE_APL_LESS_3_MONTHS">
    <template #incomeFilled>
      <i18n-t tag="p" keypath="please-provide">
        <strong>{{ t('any-docs') }}</strong>
      </i18n-t>
    </template>
  </UploadFilesFinancial>
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import { useParentRoute } from '../../guarantorResidency/useParentRoute'
import UploadFilesFinancial from '../lib/UploadFilesFinancial.vue'
import { useI18n } from 'vue-i18n'
import { useFinancialState } from '../financialState'
import EnterMonthlyIncome from '../lib/EnterMonthlyIncome.vue'

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
    "any-docs": "any supporting documents you may have"
  },
  "fr": {
    "please-provide": "Veuillez fournir {0} (un ou deux justificatifs).",
    "any-docs": "tous les justificatifs dont vous disposez"
  }
}
</i18n>
