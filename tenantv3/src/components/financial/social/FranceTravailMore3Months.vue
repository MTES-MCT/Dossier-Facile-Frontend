<template>
  <BackLinkRow :label="t('form.financial.social-aid')" :to="ancestor" />
  <BackLinkRow
    :label="t('form.financial.you-receive', [t('form.financial.social.france-travail')])"
    :to="grandparent"
  />
  <BackLinkRow :label="t('form.financial.more-3-months')" :to="parent" />
  <i18n-t tag="p" keypath="enter-income" class="fr-mb-1w">
    <strong>{{ t('monthly-income') }}</strong>
  </i18n-t>
  <UploadFilesFinancial
    category="SOCIAL_SERVICE"
    step="SOCIAL_SERVICE_FRANCE_TRAVAIL_MORE_3_MONTHS"
  >
    <template #incomeFilled>
      <i18n-t tag="p" keypath="please-provide">
        <template #months>
          <strong>{{ t('months', [...months.slice(0, 3)]) }}</strong>
        </template>
        <template #month>{{ months[3] }}</template>
      </i18n-t>
    </template>
  </UploadFilesFinancial>
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import { useParentRoute } from '../../guarantorResidency/useParentRoute'
import UploadFilesFinancial from '../lib/UploadFilesFinancial.vue'
import { lastMonths } from '../lib/lastMonths'
import { useI18n } from 'vue-i18n'

const parent = useParentRoute()
const grandparent = useParentRoute(2)
const ancestor = useParentRoute(3)
const months = lastMonths()
const { t } = useI18n()
</script>

<i18n>
{
  "en": {
    "enter-income": "Enter your {0}, without commas:",
    "monthly-income":"average net monthly income before withholding tax",
    "please-provide": "Please provide France Travail payment certificates for {months}. You can add the {month} attestation if you have it.",
    "months": "{0}, {1} et {2}",
  },
  "fr": {
    "enter-income": "Saisissez votre {0}, sans virgule :",
    "monthly-income":"revenu mensuel net moyen avant prélèvement à la source",
    "please-provide": "Veuillez fournir les attestations de paiement France Travail de {months}. Vous pouvez ajouter l’attestation de {month} si vous l’avez.",
    "months": "{0}, {1} et {2}",
  }
}
</i18n>
