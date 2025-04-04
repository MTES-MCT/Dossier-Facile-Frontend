<template>
  <BackLinkRow :label="t('form.financial.annuity')" :to="grandparent" />
  <BackLinkRow :label="t('life-annuity.' + textKey)" :to="parent" />
  <EnterMonthlyIncome />
  <UploadFilesFinancial category="RENT" step="RENT_ANNUITY_LIFE">
    <template #incomeFilled>
      <i18n-t tag="p" keypath="please-provide"
        ><strong>{{ t('certificate') }}</strong></i18n-t
      >
    </template>
  </UploadFilesFinancial>
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import UploadFilesFinancial from '../lib/UploadFilesFinancial.vue'
import { useI18n } from 'vue-i18n'
import EnterMonthlyIncome from '../lib/EnterMonthlyIncome.vue'
import { useFinancialState } from '../financialState'
import { useParentRoute } from '@/components/common/lib/useParentRoute'

const parent = useParentRoute()
const grandparent = useParentRoute(2)
const { t } = useI18n()
const { textKey } = useFinancialState()
</script>

<i18n>
{
  "en": {
    "life-annuity": {
      "tenant": "You receive a life annuity",
      "guarantor": "Your guarantor receives a life annuity",
      "couple": "Your spouse receives a life annuity",
      "couple-guarantor": "Their guarantor receives a life annuity",
    },
    "please-provide": "Please provide {0}.",
    "certificate": "a life annuity certificate"
  },
  "fr": {
    "life-annuity": {
      "tenant": "Vous touchez une rente viagère",
      "guarantor": "Votre garant touche une rente viagère",
      "couple": "Votre conjoint touche une rente viagère",
      "couple-guarantor": "Son garant touche une rente viagère",
    },
    "please-provide": "Veuillez fournir {0}.",
    "certificate": "une attestion de rente viagère"
  }
}
</i18n>
