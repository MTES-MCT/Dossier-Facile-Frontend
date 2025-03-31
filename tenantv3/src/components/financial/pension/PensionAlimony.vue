<template>
  <BackLinkRow :label="t('form.financial.retirement-or-pension')" :to="grandparent" />
  <BackLinkRow :label="t('you-receive')" :to="parent" />
  <p class="fr-mb-1w">{{ t('form.financial.enter-monthly-income') }}</p>
  <UploadFilesFinancial category="PENSION" step="PENSION_ALIMONY">
    <template #incomeFilled>
      <i18n-t tag="p" keypath="please-provide"
        ><strong>{{ t('proof-of-alimony') }}</strong></i18n-t
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
    "you-receive": "You receive alimony",
    "please-provide": "Please provide {0}.",
    "proof-of-alimony": "proof of alimony"
  },
  "fr": {
    "you-receive": "Vous touchez une pension alimentaire",
    "please-provide": "Veuillez fournir {0}.",
    "proof-of-alimony": "un justificatif de pension alimentaire"
  }
}
</i18n>
