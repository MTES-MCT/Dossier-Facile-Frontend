<template>
  <BackLinkRow :label="t('form.financial.social-aid')" :to="ancestor" category="social" />
  <BackLinkRow
    :label="t('form.financial.you-receive.' + textKey, [t('form.financial.social.aah')])"
    :to="grandparent"
    category="social"
    step="aah"
  />
  <BackLinkRow
    :label="t('not-yet-' + suffix)"
    :to="parent"
    category="social"
    step="aah"
    substep="pas-encore"
  />
  <EnterMonthlyIncome :amount="1200" />
  <UploadFilesFinancial category="SOCIAL_SERVICE" step="SOCIAL_SERVICE_AAH_NOT_YET">
    <template #incomeFilled>
      <p>{{ t('please-provide') }}</p>
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
    "not-yet-tenant": "You're not yet receiving AAH",
    "not-yet-other": "They're not yet receiving AAH",
    "please-provide": "Please provide notification of the decision of the MDPH (Maison Départementale pour les Personnes Handicapées).",
  },
  "fr": {
    "not-yet-tenant": "Vous ne touchez pas encore l’AAH",
    "not-yet-other": "Ne touche pas encore l’AAH",
    "please-provide": "Veuillez fournir la notification de décision de la MDPH (Maison Départementale pour les Personnes Handicapées).",
  }
}
</i18n>
