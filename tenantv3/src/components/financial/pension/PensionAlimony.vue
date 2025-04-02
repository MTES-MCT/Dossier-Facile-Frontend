<template>
  <BackLinkRow :label="t('form.financial.retirement-or-pension')" :to="grandparent" />
  <BackLinkRow :label="t('you-receive.' + textKey)" :to="parent" />
  <EnterMonthlyIncome />
  <UploadFilesFinancial category="PENSION" step="PENSION_ALIMONY">
    <template #incomeFilled>
      <i18n-t tag="p" keypath="please-provide"
        ><strong>{{ t('proof-of-alimony') }}</strong></i18n-t
      >
    </template>
  </UploadFilesFinancial>
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import { useParentRoute } from '../../guarantorResidency/useParentRoute'
import UploadFilesFinancial from '../lib/UploadFilesFinancial.vue'
import { useI18n } from 'vue-i18n'
import EnterMonthlyIncome from '../lib/EnterMonthlyIncome.vue'
import { useFinancialState } from '../financialState'

const parent = useParentRoute()
const grandparent = useParentRoute(2)
const { t } = useI18n()
const { textKey } = useFinancialState()
</script>

<i18n>
{
  "en": {
    "you-receive": {
      "tenant": "You receive alimony",
      "guarantor": "Your guarantor receives alimony",
      "couple": "Your spouse receives alimony",
      "couple-guarantor": "Their guarantor receives alimony",
    },
    "please-provide": "Please provide {0}.",
    "proof-of-alimony": "proof of alimony"
  },
  "fr": {
    "you-receive": {
      "tenant": "Vous touchez une pension alimentaire",
      "guarantor": "Votre garant touche une pension alimentaire",
      "couple": "Votre conjoint touche une pension alimentaire",
      "couple-guarantor": "Son garant touche une pension alimentaire",
    },
    "please-provide": "Veuillez fournir {0}.",
    "proof-of-alimony": "un justificatif de pension alimentaire"
  }
}
</i18n>
