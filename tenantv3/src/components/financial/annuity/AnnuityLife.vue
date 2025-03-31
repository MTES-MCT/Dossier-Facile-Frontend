<template>
  <BackLinkRow :label="t('form.financial.annuity')" :to="grandparent" />
  <BackLinkRow :label="t('life-annuity')" :to="parent" />
  <p class="fr-mb-1w">{{ t('form.financial.enter-monthly-income') }}</p>
  <UploadFilesFinancial category="RENT" step="RENT_ANNUITY_LIFE">
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
    "life-annuity": "You receive a life annuity",
    "please-provide": "Please provide {0}.",
    "certificate": "a life annuity certificate"
  },
  "fr": {
    "life-annuity": "Vous touchez une rente viagère",
    "please-provide": "Veuillez fournir {0}.",
    "certificate": "une attestion de rente viagère"
  }
}
</i18n>
