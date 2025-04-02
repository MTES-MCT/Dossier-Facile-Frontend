<template>
  <BackLinkRow :label="t('form.financial.social-aid')" :to="ancestor" />
  <BackLinkRow
    :label="t('form.financial.you-receive.' + textKey, [t('form.financial.social.aah')])"
    :to="grandparent"
  />
  <BackLinkRow :label="t('not-yet-' + suffix)" :to="parent" />
  <EnterMonthlyIncome />
  <UploadFilesFinancial category="SOCIAL_SERVICE" step="SOCIAL_SERVICE_AAH_NOT_YET">
    <template #incomeFilled>
      <p>{{ t('please-provide') }}</p>
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
const { suffix, textKey } = useFinancialState()
</script>

<i18n>
{
  "en": {
    "not-yet-tenant": "You're not yet receiving AAH",
    "not-yet-other": "They're not yet receiving AAH",
    "please-provide": "Please provide notification of the MDPH's decision.",
  },
  "fr": {
    "not-yet-tenant": "Vous ne touchez pas encore l’AAH",
    "not-yet-other": "Ne touche pas encore l’AAH",
    "please-provide": "Veuillez fournir la notification de décision de la MDPH.",
  }
}
</i18n>
