<template>
  <BackLinkRow :label="t('form.financial.social-aid')" :to="ancestor" category="social" />
  <BackLinkRow
    :label="t('form.financial.you-receive.' + textKey, [t('form.financial.social.aah')])"
    :to="grandparent"
    category="social"
    step="aah"
  />
  <BackLinkRow
    :label="t('form.financial.more-3-months')"
    :to="parent"
    category="social"
    step="aah"
    substep="plus-3-mois"
  />
  <EnterMonthlyIncome :amount="1200" />
  <UploadFilesFinancial
    category="SOCIAL_SERVICE"
    step="SOCIAL_SERVICE_AAH_MORE_3_MONTHS"
    :min-file="3"
  >
    <template #incomeFilled>
      <i18n-t tag="p" :keypath="'please-provide-' + suffix">
        <strong>{{ t('last-3-proofs') }}</strong>
      </i18n-t>
    </template>
  </UploadFilesFinancial>
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import UploadFilesFinancial from '../lib/UploadFilesFinancial.vue'
import { useI18n } from 'vue-i18n'
import { useFinancialState } from '../financialState'
import EnterMonthlyIncome from '../lib/EnterMonthlyIncome.vue'

const parent = useParentRoute()
const grandparent = useParentRoute(2)
const ancestor = useParentRoute(3)
const { t } = useI18n()
const { suffix, textKey } = useFinancialState()
</script>

<i18n>
{
  "en": {
    "please-provide-tenant": "Please provide your {0}.",
    "please-provide-other": "Please provide their {0}.",
    "last-3-proofs": "last 3 proofs of payment"
  },
  "fr": {
    "please-provide-tenant": "Veuillez fournir vos {0}.",
    "please-provide-other": "Veuillez fournir ses {0}.",
    "last-3-proofs": "3 derniers justificatifs de versement"
  }
}
</i18n>
