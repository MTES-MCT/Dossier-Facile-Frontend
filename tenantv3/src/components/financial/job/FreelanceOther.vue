<template>
  <BackLinkRow :label="t('form.financial.job-income')" :to="ancestor" />
  <BackLinkRow :label="t('form.financial.self-employed')" :to="grandparent" />
  <BackLinkRow :label="t('not-auto-entrepreneur')" :to="parent" />
  <EnterMonthlyIncome />
  <UploadFilesFinancial category="SALARY" step="SALARY_FREELANCE_OTHER">
    <template #emptyIncome>
      <AlertRealisticAmount />
    </template>
    <template #incomeFilled>
      <AlertRealisticAmount class="fr-mb-3w" />
      <p class="fr-mb-0">{{ t('please-provide') }}</p>
      <ul>
        <i18n-t keypath="choice-1" tag="li">
          <strong>{{ t('statement') }}</strong>
        </i18n-t>
        <i18n-t keypath="choice-2" tag="li">
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
import EnterMonthlyIncome from './EnterMonthlyIncome.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const parent = useParentRoute()
const grandparent = useParentRoute(2)
const ancestor = useParentRoute(3)
</script>

<i18n>
{
  "en": {
    "not-auto-entrepreneur": "You are not an auto-entrepreneur",
    "please-provide": "Please provide one of the following:",
    "choice-1": "a {0} showing your most recent income",
    "statement": "statement from your accountant",
    "choice-2": "your {0}",
    "recent-balance-sheet": "most recent balance sheet",
    "if-no-docs": "If you don't have these documents, please send us documents that help us understand your income calculation. You can add a {0} to explain your calculation.",
    "sworn-statement": "sworn statement"
  },
  "fr": {
    "not-auto-entrepreneur": "Vous n’êtes pas auto-entrepreneur",
    "please-provide": "Veuillez fournir, au choix :",
    "choice-1": "une {0} indiquant vos revenus les plus récents",
    "statement": "attestation de votre comptable",
    "choice-2": "votre {0}",
    "recent-balance-sheet": "bilan comptable le plus récent",
    "if-no-docs": " Si vous n’avez pas ces documents, veuillez transmettre des documents qui permettent de comprendre le calcul de vos revenus. Vous pouvez ajouter une {0} pour expliquer votre calcul.",
    "sworn-statement": "attestation sur l’honneur"
  }
}
</i18n>
