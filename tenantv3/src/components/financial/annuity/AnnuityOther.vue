<template>
  <BackLinkRow :label="t('form.financial.annuity')" :to="grandparent" />
  <BackLinkRow :label="t('you-receive')" :to="parent" />
  <p class="fr-mb-1w">{{ t('form.financial.enter-monthly-income') }}</p>
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
import { useParentRoute } from '../../guarantorResidency/useParentRoute'
import UploadFilesFinancial from '../lib/UploadFilesFinancial.vue'
import { useI18n } from 'vue-i18n'

const parent = useParentRoute()
const grandparent = useParentRoute(2)
const { t } = useI18n()
</script>

<i18n>
{
  "en": {
    "you-receive": "You receive another type of pension",
    "please-provide": "Please provide {0}.",
    "certificate": "a pension certificate"
  },
  "fr": {
    "you-receive": "Vous touchez un autre type de rente",
    "please-provide": "Veuillez fournir {0}.",
    "certificate": "une attestion de rente"
  }
}
</i18n>
