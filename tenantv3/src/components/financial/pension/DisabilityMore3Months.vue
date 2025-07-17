<template>
  <BackLinkRow
    :label="t('form.financial.retirement-or-pension')"
    :to="ancestor"
    category="pension"
  />
  <BackLinkRow
    :label="t('you-receive.' + textKey)"
    :to="grandparent"
    category="pension"
    step="invalidite"
  />
  <BackLinkRow
    :label="t('form.financial.more-3-months')"
    :to="parent"
    category="pension"
    step="invalidite"
    substep="plus-3-mois"
  />
  <EnterMonthlyIncome :amount="1200" />
  <UploadFilesFinancial category="PENSION" step="PENSION_DISABILITY_MORE_3_MONTHS" :min-files="3">
    <template #incomeFilled>
      <i18n-t tag="p" keypath="please-provide"
        ><strong>{{ t('last-3-proofs-' + suffix) }}</strong></i18n-t
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
const { suffix, textKey } = useFinancialState()
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
    "please-provide": "Please provide {0}.",
    "last-3-proofs-tenant": "your last 3 payment slips",
    "last-3-proofs-other": "their last 3 payment slips"
  },
  "fr": {
    "you-receive": {
      "tenant": "Vous touchez une pension d’invalidité",
      "guarantor": "Votre garant touche une pension d’invalidité",
      "couple": "Votre conjoint touche une pension d’invalidité",
      "couple-guarantor": "Son garant touche une pension d’invalidité"
    },
    "please-provide": "Veuillez fournir {0}.",
    "last-3-proofs-tenant": "vos 3 derniers justificatifs de versement",
    "last-3-proofs-other": "ses 3 derniers justificatifs de versement"
  }
}
</i18n>
