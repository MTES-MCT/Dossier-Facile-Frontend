<template>
  <BackLinkRow :label="t('form.financial.retirement-or-pension')" :to="ancestor" />
  <BackLinkRow :label="t('you-receive.' + textKey)" :to="grandparent" />
  <BackLinkRow :label="t('form.financial.less-3-months')" :to="parent" />
  <EnterMonthlyIncome />
  <UploadFilesFinancial category="PENSION" step="PENSION_DISABILITY_LESS_3_MONTHS">
    <template #incomeFilled>
      <i18n-t tag="p" keypath="please-provide"
        ><strong>{{ t('any-docs') }}</strong></i18n-t
      >
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
const { textKey } = useFinancialState()
</script>

<i18n>
{
  "en": {
    "you-receive": {
      "tenant": "You receive a disability pension",
      "guarantor": "Your guarantor receives a disability pension",
      "couple": "Your spouse receives a disability pension",
      "couple-guarantor": "Their guarantor receives a disability pension",
    },
    "please-provide": "Please provide {0} (one or two).",
    "any-docs": "any supporting documents you may have"
  },
  "fr": {
    "you-receive": {
      "tenant": "Vous touchez une pension d’invalidité",
      "guarantor": "Votre garant touche une pension d’invalidité",
      "couple": "Votre conjoint touche une pension d’invalidité",
      "couple-guarantor": "Son garant touche une pension d’invalidité"
    },
    "please-provide": "Veuillez fournir {0} (un ou deux justificatifs).",
    "any-docs": "tous les justificatifs dont vous disposez"
  }
}
</i18n>
