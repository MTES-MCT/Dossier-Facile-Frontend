<template>
  <BackLinkRow :label="t('form.financial.annuity')" :to="grandparent" category="rente" />
  <BackLinkRow :label="t('you-receive.' + textKey)" :to="parent" category="rente" step="autre" />
  <EnterMonthlyIncome :amount="1200" />
  <UploadFilesFinancial category="RENT" step="RENT_OTHER">
    <template #incomeFilled>
      <i18n-t tag="p" keypath="please-provide"
        ><strong>{{ t('certificate') }}</strong></i18n-t
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
const { t } = useI18n()
const { textKey } = useFinancialState()
</script>

<i18n>
{
  "en": {
    "you-receive": {
      "tenant": "You receive another type of pension",
      "guarantor": "Your guarantor receives another type of pension",
      "couple": "Your spouse receives another type of pension",
      "couple-guarantor": "Their guarantor receives another type of pension",
    },
    "please-provide": "Please provide {0}.",
    "certificate": "a pension certificate"
  },
  "fr": {
    "you-receive": {
      "tenant": "Vous touchez un autre type de rente",
      "guarantor": "Votre garant touche un autre type de rente",
      "couple": "Votre conjoint touche un autre type de rente",
      "couple-guarantor": "Son garant touche un autre type de rente",
    },
    "please-provide": "Veuillez fournir {0}.",
    "certificate": "une attestion de rente"
  }
}
</i18n>
