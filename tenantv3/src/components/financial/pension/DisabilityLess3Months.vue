<template>
  <BackLinkRow :label="t('form.financial.retirement-or-pension')" :to="ancestor" />
  <BackLinkRow :label="t('you-receive')" :to="grandparent" />
  <BackLinkRow :label="t('form.financial.less-3-months')" :to="parent" />
  <p class="fr-mb-1w">{{ t('form.financial.enter-monthly-income') }}</p>
  <UploadFilesFinancial category="PENSION" step="PENSION_DISABILITY_LESS_3_MONTHS">
    <template #incomeFilled>
      <i18n-t tag="p" keypath="please-provide"
        ><strong>{{ t('any-docs') }}</strong></i18n-t
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
const ancestor = useParentRoute(3)
const { t } = useI18n()
</script>

<i18n>
{
  "en": {
    "you-receive": "You receive a disability pension",
    "please-provide": "Please provide {0} (one or two).",
    "any-docs": "any supporting documents you may have"
  },
  "fr": {
    "you-receive": "Vous touchez une pension d’invalidité",
    "please-provide": "Veuillez fournir {0} (un ou deux justificatifs).",
    "any-docs": "tous les justificatifs dont vous disposez"
  }
}
</i18n>
