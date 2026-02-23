<template>
  <BackLinkRow :label="t('form.financial.social-aid')" :to="grandparent" category="social" />
  <BackLinkRow
    :label="t('form.financial.you-receive.' + textKey, [t('form.financial.social.france-travail')])"
    :to="parent"
    category="social"
    step="france-travail"
  />
  <RadioList :list-items="optionLinks" @analytics="sendEvent" />
  <FinancialFooter disabled />
</template>

<script setup lang="ts">
import RadioList from '@/components/common/RadioList.vue'
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import FinancialFooter from '../lib/FinancialFooter.vue'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import { useI18n } from 'vue-i18n'
import { useFinancialState } from '../financialState'
import { AnalyticsService } from '@/services/AnalyticsService'
import { useSocialOptionLinks } from './lib/useSocialOptionLinks'

const parent = useParentRoute()
const grandparent = useParentRoute(2)
const { t } = useI18n()
const { category, suffix, textKey } = useFinancialState()

const sendEvent = (subCategory: string) =>
  AnalyticsService.selectSituation3(category, 'social', 'france-travail', subCategory)

const optionLinks = useSocialOptionLinks(suffix)
</script>

<i18n lang="json">
{
  "en": {
    "not-yet": {
      "tenant": "You're not yet receiving aid"
    },
    "not-yet-tenant": "You're not yet receiving aid",
    "not-yet-other": "They're not yet receiving aid"
  },
  "fr": {
    "not-yet": {
      "tenant": "Vous ne touchez pas encore l’aide"
    },
    "not-yet-tenant": "Vous ne touchez pas encore l’aide",
    "not-yet-other": "Ne touche pas encore l’aide"
  }
}
</i18n>
