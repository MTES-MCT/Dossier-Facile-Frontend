<template>
  <BackLinkRow :label="t('form.financial.retirement-or-pension')" :to="ancestor" />
  <BackLinkRow :label="t('you-receive')" :to="grandparent" />
  <BackLinkRow :label="t('no-statement')" :to="parent" />
  <p class="fr-mb-1w">{{ t('form.financial.enter-monthly-income') }}</p>
  <UploadFilesFinancial category="PENSION" step="PENSION_NO_STATEMENT">
    <template #incomeFilled>
      <i18n-t tag="p" keypath="please-provide"
        ><strong>{{ t('latest-tax-notice') }}</strong></i18n-t
      >
      <AlertRealisticAmount pclass="bold" class="fr-mb-3w">
        <p>{{ t('for-example') }}</p>
      </AlertRealisticAmount>
    </template>
  </UploadFilesFinancial>
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import { useParentRoute } from '../../guarantorResidency/useParentRoute'
import UploadFilesFinancial from '../lib/UploadFilesFinancial.vue'
import { useI18n } from 'vue-i18n'
import AlertRealisticAmount from '../job/AlertRealisticAmount.vue'

const parent = useParentRoute()
const grandparent = useParentRoute(2)
const ancestor = useParentRoute(3)
const { t } = useI18n()
</script>

<i18n>
{
  "en": {
    "you-receive": "You receive a pension",
    "no-statement": "You have a pension statement",
    "please-provide": "Please provide {0}.",
    "latest-tax-notice": "your latest tax notice 2023-24",
    "for-example": "For example: if the “property income” line on your tax form shows €18,000, your rental income is 18000÷12=1500€."
  },
  "fr": {
    "you-receive": "Vous touchez une retraite",
    "pension-statement": "Vous avez un bulletin de pension",
    "please-provide": "Veuillez fournir {0}.",
    "latest-tax-notice": "votre dernier avis d’imposition 2023-24",
    "for-example": "Par exemple : si la ligne “revenus fonciers” de votre avis d’imposition indique 18000€, le montant de vos revenus locatifs est de 18000÷12=1500€."
  }
}
</i18n>
