<template>
  <BackLinkRow :label="t('form.financial.retirement-or-pension')" :to="ancestor" />
  <BackLinkRow :label="t('you-receive.' + textKey)" :to="grandparent" />
  <BackLinkRow :label="t('no-statement.' + textKey)" :to="parent" />
  <EnterMonthlyIncome />
  <UploadFilesFinancial category="PENSION" step="PENSION_NO_STATEMENT">
    <template #incomeFilled>
      <i18n-t tag="p" keypath="please-provide"
        ><strong>{{ t('latest-tax-notice-' + suffix) }}</strong></i18n-t
      >
      <AlertRealisticAmount pclass="bold" class="fr-mb-3w">
        <p>{{ t('for-example-' + suffix) }}</p>
      </AlertRealisticAmount>
    </template>
  </UploadFilesFinancial>
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import UploadFilesFinancial from '../lib/UploadFilesFinancial.vue'
import { useI18n } from 'vue-i18n'
import AlertRealisticAmount from '../job/AlertRealisticAmount.vue'
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
      "tenant": "You receive a pension",
      "guarantor": "Your guarantor receives a pension",
      "couple": "Your spouse receives a pension",
      "couple-guarantor": "Their guarantor receives a pension",
    },
    "no-statement": {
      "tenant": "You don't have a pension statement",
      "guarantor": "Your guarantor has no pension statement",
      "couple": "Your spouse has no pension statement",
      "couple-guarantor": "Their guarantor has no pension statement",
    },
    "please-provide": "Please provide {0}.",
    "latest-tax-notice-tenant": "your latest tax notice 2023-24",
    "latest-tax-notice-other": "their latest tax notice 2023-24",
    "for-example-tenant": "For example: if the “property income” line on your tax form shows €18,000, your rental income is 18000÷12=1500€.",
    "for-example-other": "For example: if the “property income” line on their tax form shows €18,000, their rental income is 18000÷12=1500€."
  },
  "fr": {
    "you-receive": {
      "tenant": "Vous touchez une retraite",
      "guarantor": "Votre garant touche une retraite",
      "couple": "Votre conjoint touche une retraite",
      "couple-guarantor": "Son garant touche une retraite",
    },
    "no-statement": {
      "tenant": "Vous n’avez pas de bulletin de pension",
      "guarantor": "Votre garant n’a pas de bulletin de pension",
      "couple": "Votre conjoint n’a pas de bulletin de pension",
      "couple-guarantor": "Son garant n’a pas de bulletin de pension",
    },
    "please-provide": "Veuillez fournir {0}.",
    "latest-tax-notice-tenant": "votre dernier avis d’imposition 2023-24",
    "latest-tax-notice-other": "son dernier avis d’imposition 2023-24",
    "for-example-tenant": "Par exemple : si la ligne “revenus fonciers” de votre avis d’imposition indique 18000€, le montant de vos revenus locatifs est de 18000÷12=1500€.",
    "for-example-other": "Par exemple : si la ligne “revenus fonciers” de son avis d’imposition indique 18000€, le montant des revenus locatifs est de 18000÷12=1500€."
  }
}
</i18n>
