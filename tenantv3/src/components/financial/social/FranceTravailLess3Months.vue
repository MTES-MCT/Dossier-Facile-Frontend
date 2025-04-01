<template>
  <BackLinkRow :label="t('form.financial.social-aid')" :to="ancestor" />
  <BackLinkRow
    :label="t('form.financial.you-receive', [t('form.financial.social.france-travail')])"
    :to="grandparent"
  />
  <BackLinkRow :label="t('form.financial.less-3-months')" :to="parent" />

  <i18n-t tag="p" keypath="enter-income" class="fr-mb-1w">
    <strong>{{ t('monthly-income') }}</strong>
  </i18n-t>
  <UploadFilesFinancial
    category="SOCIAL_SERVICE"
    step="SOCIAL_SERVICE_FRANCE_TRAVAIL_LESS_3_MONTHS"
  >
    <template #incomeFilled>
      <i18n-t tag="p" keypath="please-provide">
        <strong>{{ t('any-docs') }}</strong>
      </i18n-t>
    </template>
  </UploadFilesFinancial>
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import { useParentRoute } from '../../guarantorResidency/useParentRoute'
import UploadFilesFinancial from '../lib/UploadFilesFinancial.vue'
import { useI18n } from 'vue-i18n'

const parent = useParentRoute()
const grandparent = useParentRoute(2)
const ancestor = useParentRoute(3)
const { t } = useI18n()
</script>

<i18n>
{
  "en": {
    "enter-income": "Enter your {0}, without commas:",
    "monthly-income":"average net monthly income before withholding tax",
    "please-provide": "Please provide {0} (one or two).",
    "any-docs": "any France Travail payment certificates you may have"
  },
  "fr": {
    "enter-income": "Saisissez votre {0}, sans virgule :",
    "monthly-income":"revenu mensuel net moyen avant prélèvement à la source",
    "please-provide": "Veuillez fournir {0} (une ou deux attestations).",
    "any-docs": "toutes les attestations de paiement France Travail dont vous disposez"
  }
}
</i18n>
