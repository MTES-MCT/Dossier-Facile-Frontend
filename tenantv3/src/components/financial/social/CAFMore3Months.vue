<template>
  <BackLinkRow :label="t('form.financial.social-aid')" :to="ancestor" category="social" />
  <BackLinkRow
    :label="t('form.financial.you-receive.' + textKey, [t('form.financial.social.caf')])"
    :to="grandparent"
    category="social"
    step="caf"
  />
  <BackLinkRow
    :label="t('form.financial.more-3-months')"
    :to="parent"
    category="social"
    step="caf"
    substep="plus-3-mois"
  />
  <EnterMonthlyIncome :amount="500" />
  <UploadFilesFinancial
    category="SOCIAL_SERVICE"
    step="SOCIAL_SERVICE_CAF_MORE_3_MONTHS"
    :min-files="3"
  >
    <template #incomeFilled>
      <i18n-t tag="p" keypath="please-provide">
        <template #months>
          <strong>{{ t('months', [...months.slice(0, 3)]) }}</strong>
        </template>
        <template #month>{{ months[3] }}</template>
      </i18n-t>
      <div class="fr-alert fr-alert--info fr-mb-2w">
        <p>{{ t('auto-reject') }}</p>
      </div>
    </template>
  </UploadFilesFinancial>
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import UploadFilesFinancial from '../lib/UploadFilesFinancial.vue'
import { lastMonths } from '../lib/lastMonths'
import { useI18n } from 'vue-i18n'
import { useFinancialState } from '../financialState'
import EnterMonthlyIncome from '../lib/EnterMonthlyIncome.vue'

const parent = useParentRoute()
const grandparent = useParentRoute(2)
const ancestor = useParentRoute(3)
const months = lastMonths()
const { t } = useI18n()
const { textKey } = useFinancialState()
</script>

<i18n>
{
  "en": {
    "please-provide": "Please provide proof of payment for {months}. You can add the {month} receipt if you have it.",
    "months": "{0}, {1} and {2}",
    "auto-reject": "Our team automatically refuses applications with only 1 or 2 supporting documents."
  },
  "fr": {
    "please-provide": "Veuillez fournir les justificatifs de versement de {months}. Vous pouvez ajouter le justificatif de {month} si vous l’avez.",
    "months": "{0}, {1} et {2}",
    "auto-reject": "Notre équipe refuse automatiquement les dossiers avec 1 ou 2 justificatifs seulement."
  }
}
</i18n>
