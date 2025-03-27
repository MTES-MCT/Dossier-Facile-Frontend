<template>
  <RadioList>
    <RadioListItem :to="here + '/travail'" @click="sendEvent('job')"
      >{{ t('form.financial.job-income') }}
      <span class="fr-hint-text">{{ t('employed') }}</span></RadioListItem
    >
    <RadioListItem :to="here + '/social'" @click="sendEvent('social')"
      >{{ t('form.financial.social-aid') }}
      <span class="fr-hint-text">{{ t('social-aid') }}</span>
    </RadioListItem>
    <RadioListItem :to="here + '/pension'" @click="sendEvent('pension')"
      >{{ t('form.financial.retirement-or-pension') }}
      <span class="fr-hint-text">{{ t('pension') }}</span>
    </RadioListItem>
    <RadioListItem :to="here + '/rente'" @click="sendEvent('annuity')"
      >{{ t('form.financial.annuity') }}
      <span class="fr-hint-text">{{ t('annuity') }}</span>
    </RadioListItem>
    <RadioListItem :to="here + '/bourse'" @click="sendEvent('grant')">{{
      t('form.financial.grant')
    }}</RadioListItem>
    <RadioListItem
      v-if="documents.length === 0"
      :to="here + '/pas-de-revenus'"
      @click="sendEvent('no-income')"
      >{{ t('form.financial.no-income') }}</RadioListItem
    >
  </RadioList>
  <FinancialFooter />
</template>

<script setup lang="ts">
import RadioList from '@/components/common/RadioList.vue'
import RadioListItem from '@/components/common/RadioListItem.vue'
import { AnalyticsService } from '@/services/AnalyticsService'
import FinancialFooter from './lib/FinancialFooter.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFinancialState } from './financialState'

const { t } = useI18n()
const route = useRoute()
const here = computed(() => route.path)
const { category, documents } = useFinancialState()

const sendEvent = (subcategory: string) => AnalyticsService.selectSituation(category, subcategory)
</script>

<i18n>
{
  "en": {
    "employed": "Employee, self-employed, intermittent…",
    "social-aid": "Unemployment, family allowances, APL, RSA…",
    "pension": "Alimony, disability pension…",
    "annuity": "Rental income, life annuity…"
  },
  "fr": {
    "employed": "Salarié, indépendant, intermittent…",
    "social-aid": "Chômage, allocations familiales, APL, RSA…",
    "pension": "Pension alimentaire, d’invalidité…",
    "annuity": "Revenus locatifs, rente viagère…"
  }
}
</i18n>
