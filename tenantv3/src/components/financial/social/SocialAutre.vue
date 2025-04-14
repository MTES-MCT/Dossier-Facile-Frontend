<template>
  <BackLinkRow :label="t('form.financial.social-aid')" :to="grandparent" category="social" />
  <BackLinkRow
    :label="t('form.financial.social.other')"
    :to="parent"
    category="social"
    step="autre"
  />
  <EnterMonthlyIncome />
  <UploadFilesFinancial category="SOCIAL_SERVICE" step="SOCIAL_SERVICE_OTHER">
    <template #incomeFilled>
      <i18n-t tag="p" keypath="please-provide">
        <template #amount>
          <strong>{{ t('aid-amount') }}</strong>
        </template>
        <template #frequency>
          <strong>{{ t('payment-frequency') }}</strong>
        </template>
      </i18n-t>
    </template>
  </UploadFilesFinancial>
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import UploadFilesFinancial from '../lib/UploadFilesFinancial.vue'
import { useI18n } from 'vue-i18n'
import EnterMonthlyIncome from '../lib/EnterMonthlyIncome.vue'

const parent = useParentRoute()
const grandparent = useParentRoute(2)
const { t } = useI18n()
</script>

<i18n>
{
  "en": {
    "please-provide": "Please provide proof of this assistance. The document must indicate {amount} and {frequency}.",
    "aid-amount": "the amount of assistance",
    "payment-frequency": "the frequency of payments"
  },
  "fr": {
    "please-provide": "Veuillez fournir un justificatif de cette aide. Le document doit indiquer {amount} et {frequency}.",
    "aid-amount": "le montant de l’aide",
    "payment-frequency": "la fréquence des versements"
  }
}
</i18n>
