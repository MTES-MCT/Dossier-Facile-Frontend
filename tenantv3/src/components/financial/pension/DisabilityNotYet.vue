<template>
  <BackLinkRow :label="t('form.financial.retirement-or-pension')" :to="ancestor" />
  <BackLinkRow :label="t('you-receive')" :to="grandparent" />
  <BackLinkRow :label="t('not-yet')" :to="parent" />
  <p class="fr-mb-1w">{{ t('form.financial.enter-monthly-income') }}</p>
  <UploadFilesFinancial category="PENSION" step="PENSION_DISABILITY_NOT_YET">
    <template #incomeFilled>
      <p>{{ t('please-provide') }}</p>
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
    "you-receive": "You receive a disability pension",
    "not-yet": "You are not yet receiving a disability pension",
    "please-provide": "Please provide proof of disability pension.",
  },
  "fr": {
    "you-receive": "Vous touchez une pension d’invalidité",
    "not-yet": "Vous ne touchez pas encore de pension d’invalidité",
    "please-provide": "Veuillez fournir une attestation de pension d’invalidité.",
  }
}
</i18n>
