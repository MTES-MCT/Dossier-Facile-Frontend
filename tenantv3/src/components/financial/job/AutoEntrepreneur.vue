<template>
  <BackLinkRow :label="t('form.financial.job-income')" :to="ancestor" />
  <BackLinkRow :label="t('form.financial.self-employed.' + textKey)" :to="grandparent" />
  <BackLinkRow :label="t('auto-entrepreneur.' + textKey)" :to="parent" />
  <EnterMonthlyIncomeBeforeTax />
  <UploadFilesFinancial category="SALARY" step="SALARY_FREELANCE_AUTOENTREPRENEUR">
    <template #emptyIncome>
      <AlertAutoEntrepreneur />
    </template>
    <template #incomeFilled>
      <AlertAutoEntrepreneur class="fr-mb-3w" />
      <p class="fr-mb-0">{{ t('please-provide') }}</p>
      <ul>
        <i18n-t :keypath="'choice-1-' + suffix" tag="li">
          <strong>{{ t('last-3-monthly-tax') }}</strong>
        </i18n-t>
        <i18n-t :keypath="'choice-2-' + suffix" tag="li">
          <strong>{{ t('last-quarterly-tax') }}</strong>
        </i18n-t>
      </ul>
      <i18n-t keypath="docs-urssaf" tag="p">
        <a href="https://www.autoentrepreneur.urssaf.fr/portail/accueil.html" target="_blank">{{
          t('auto-entrepreneur-section')
        }}</a>
      </i18n-t>
      <p>{{ t('note') }}</p>
    </template>
  </UploadFilesFinancial>
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import { useParentRoute } from '../../guarantorResidency/useParentRoute'
import UploadFilesFinancial from '../lib/UploadFilesFinancial.vue'
import AlertAutoEntrepreneur from './AlertAutoEntrepreneur.vue'
import { useI18n } from 'vue-i18n'
import EnterMonthlyIncomeBeforeTax from '../lib/EnterMonthlyIncomeBeforeTax.vue'
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
    "please-provide": "Please provide one of the following:",
    "choice-1-tenant": "your {0}",
    "choice-1-other": "their {0}",
    "choice-2-tenant": "your {0}",
    "choice-2-other": "their {0}",
    "last-3-monthly-tax": "last 3 monthly tax returns",
    "last-quarterly-tax": "last quarterly tax return",
    "docs-urssaf": "These documents can be found on the {0} of the URSSAF website.",
    "auto-entrepreneur-section": "service auto-entrepreneur",
    "note": "Note: you can provide more documents (e.g. last 6 months) if you wish.",
    "auto-entrepreneur": {
      "tenant": "You are an auto-entrepreneur",
      "guarantor": "Your guarantor is an auto-entrepreneur",
      "couple": "Your spouse is an auto-entrepreneur",
      "couple-guarantor": "Their guarantor is an auto-entrepreneur"
    }
  },
  "fr": {
    "please-provide": "Veuillez fournir, au choix :",
    "choice-1-tenant": "vos {0} de recettes",
    "choice-1-other": "ses {0} de recettes",
    "choice-2-tenant": "votre {0} de recettes",
    "choice-2-other": "sa {0} de recettes",
    "last-3-monthly-tax": "3 dernières déclarations mensuelles",
    "last-quarterly-tax": "dernière déclaration trimestrielle",
    "docs-urssaf": "Ces documents se trouvent sur le {0} du site de l’URSSAF.",
    "auto-entrepreneur-section": "service auto-entrepreneur",
    "note": "Note : vous pouvez fournir plus de documents (par exemple les 6 derniers mois) si vous le souhaitez.",
    "auto-entrepreneur": {
      "tenant": "Vous êtes auto-entrepreneur",
      "guarantor": "Votre garant est auto-entrepreneur",
      "couple": "Votre conjoint est auto-entrepreneur",
      "couple-guarantor": "Son garant est auto-entrepreneur"
    }
  }
}
</i18n>
