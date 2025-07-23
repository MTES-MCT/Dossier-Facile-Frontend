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
    :label="t('not-yet.' + textKey)"
    :to="parent"
    category="pension"
    step="invalidite"
    substep="pas-encore"
  />
  <EnterMonthlyIncome :amount="1200" />
  <UploadFilesFinancial category="PENSION" step="PENSION_DISABILITY_NOT_YET">
    <template #incomeFilled>
      <p>{{ t('please-provide') }}</p>
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
    "not-yet": {
      "tenant": "You are not yet receiving a disability pension",
      "guarantor": "Your guarantor is not yet receiving a disability pension",
      "couple": "Your spouse is not yet receiving a disability pension",
      "couple-guarantor": "Their guarantor is not yet receiving a disability pension",
    },
    "please-provide": "Please provide proof of disability pension.",
  },
  "fr": {
    "you-receive": {
      "tenant": "Vous touchez une pension d’invalidité",
      "guarantor": "Votre garant touche une pension d’invalidité",
      "couple": "Votre conjoint touche une pension d’invalidité",
      "couple-guarantor": "Son garant touche une pension d’invalidité"
    },
    "not-yet": {
      "tenant": "Vous ne touchez pas encore de pension d’invalidité",
      "guarantor": "Votre garant ne touche pas encore de pension d’invalidité",
      "couple": "Votre conjoint ne touche pas encore de pension d’invalidité",
      "couple-guarantor": "Son garant ne touche pas encore de pension d’invalidité",
    },
    "please-provide": "Veuillez fournir une attestation de pension d’invalidité.",
  }
}
</i18n>
