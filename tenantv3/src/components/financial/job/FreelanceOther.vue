<template>
  <BackLinkRow :label="t('form.financial.job-income')" :to="ancestor" />
  <BackLinkRow :label="t('form.financial.self-employed.' + textKey)" :to="grandparent" />
  <BackLinkRow :label="t('not-auto-entrepreneur.' + textKey)" :to="parent" />
  <EnterMonthlyIncomeBeforeTax />
  <UploadFilesFinancial category="SALARY" step="SALARY_FREELANCE_OTHER">
    <template #emptyIncome>
      <AlertRealisticAmount />
    </template>
    <template #incomeFilled>
      <AlertRealisticAmount class="fr-mb-3w" />
      <p class="fr-mb-0">{{ t('please-provide') }}</p>
      <ul>
        <i18n-t :keypath="'choice-1-' + suffix" tag="li">
          <strong>{{ t('statement-' + suffix) }}</strong>
        </i18n-t>
        <i18n-t :keypath="'choice-2-' + suffix" tag="li">
          <strong>{{ t('recent-balance-sheet') }}</strong>
        </i18n-t>
      </ul>
      <i18n-t keypath="if-no-docs" tag="p">
        <a
          href="https://www.service-public.fr/simulateur/calcul/AttestationHonneur"
          target="_blank"
          >{{ t('sworn-statement') }}</a
        >
      </i18n-t>
    </template>
  </UploadFilesFinancial>
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import { useParentRoute } from '../../guarantorResidency/useParentRoute'
import UploadFilesFinancial from '../lib/UploadFilesFinancial.vue'
import AlertRealisticAmount from './AlertRealisticAmount.vue'
import EnterMonthlyIncomeBeforeTax from '../lib/EnterMonthlyIncomeBeforeTax.vue'
import { useI18n } from 'vue-i18n'
import { useFinancialState } from '../financialState'

const { t } = useI18n()
const parent = useParentRoute()
const grandparent = useParentRoute(2)
const ancestor = useParentRoute(3)
const { suffix, textKey } = useFinancialState()
</script>

<i18n>
{
  "en": {
    "not-auto-entrepreneur": {
      "tenant": "You are not an auto-entrepreneur",
      "guarantor": "Your guarantor is not an auto-entrepreneur",
      "couple": "Your spouse is not an auto-entrepreneur",
      "couple-guarantor": "Their guarantor is not an auto-entrepreneur"
    },
    "please-provide": "Please provide one of the following:",
    "choice-1-tenant": "a {0} showing your most recent income",
    "choice-1-other": "a {0} showing their most recent income",
    "statement-tenant": "statement from your accountant",
    "statement-other": "statement from their accountant",
    "choice-2-tenant": "your {0}",
    "choice-2-other": "their {0}",
    "recent-balance-sheet": "most recent balance sheet",
    "if-no-docs": "If you don't have these documents, please send us documents that help us understand your income calculation. You can add a {0} to explain your calculation.",
    "sworn-statement": "sworn statement"
  },
  "fr": {
    "not-auto-entrepreneur": {
      "tenant": "Vous n’êtes pas auto-entrepreneur",
      "guarantor": "Votre garant n’est pas auto-entrepreneur",
      "couple": "Votre conjoint n’est pas auto-entrepreneur",
      "couple-guarantor": "Son garant n’est pas auto-entrepreneur"
    },
    "please-provide": "Veuillez fournir, au choix :",
    "choice-1-tenant": "une {0} indiquant vos revenus les plus récents",
    "choice-1-other": "une {0} indiquant ses revenus les plus récents",
    "statement-tenant": "attestation de votre comptable",
    "statement-other": "attestation de son comptable",
    "choice-2-tenant": "votre {0}",
    "choice-2-other": "son {0}",
    "recent-balance-sheet": "bilan comptable le plus récent",
    "if-no-docs": " Si vous n’avez pas ces documents, veuillez transmettre des documents qui permettent de comprendre le calcul de vos revenus. Vous pouvez ajouter une {0} pour expliquer votre calcul.",
    "sworn-statement": "attestation sur l’honneur"
  }
}
</i18n>
