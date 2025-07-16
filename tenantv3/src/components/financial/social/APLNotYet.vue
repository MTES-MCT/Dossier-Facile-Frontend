<template>
  <BackLinkRow :label="t('form.financial.social-aid')" :to="ancestor" category="social" />
  <BackLinkRow
    :label="t('form.financial.you-receive.' + textKey, [t('form.financial.social.apl')])"
    :to="grandparent"
    category="social"
    step="apl"
  />
  <BackLinkRow
    :label="t('not-yet-' + suffix)"
    :to="parent"
    category="social"
    step="apl"
    substep="pas-encore"
  />
  <EnterMonthlyIncome :amount="300" />
  <UploadFilesFinancial category="SOCIAL_SERVICE" step="SOCIAL_SERVICE_APL_NOT_YET">
    <template #incomeFilled>
      <i18n-t tag="p" keypath="please-provide">
        <a href="https://www.service-public.fr/particuliers/vosdroits/R2972" target="_blank">{{
          t('simulation')
        }}</a>
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
    "not-yet-tenant": "You're not yet receiving APL",
    "not-yet-other": "They're not yet receiving APL",
    "please-provide": "Please provide a screenshot of the {0}.",
    "simulation": "CAF housing assistance simulation"
  },
  "fr": {
    "not-yet-tenant": "Vous ne touchez pas encore l’APL",
    "not-yet-other": "Ne touche pas encore l’APL",
    "please-provide": "Veuillez fournir une copie d’écran de la {0}.",
    "simulation": "simulation CAF d’aide au logement"
  }
}
</i18n>
