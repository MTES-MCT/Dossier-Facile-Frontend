<template>
  <BackLinkRow :label="t('form.financial.annuity')" :to="parent" />
  <p>{{ t('you-receive') }}</p>
  <RadioList>
    <RadioListItem :to="here + '/revenus-locatifs'" @click="sendEvent('revenus-locatifs')">{{
      t('rental-income')
    }}</RadioListItem>
    <RadioListItem :to="here + '/viagere'" @click="sendEvent('viagere')">{{
      t('life-annuity')
    }}</RadioListItem>
    <RadioListItem :to="here + '/autre'" @click="sendEvent('autre')">{{
      t('other-pension')
    }}</RadioListItem>
  </RadioList>
  <FinancialFooter />
</template>

<script setup lang="ts">
import RadioList from '@/components/common/RadioList.vue'
import RadioListItem from '@/components/common/RadioListItem.vue'
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import { AnalyticsService } from '@/services/AnalyticsService'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import FinancialFooter from '../lib/FinancialFooter.vue'
import { useParentRoute } from '../../guarantorResidency/useParentRoute'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const parent = useParentRoute()
const here = computed(() => route.path)

const sendEvent = (subCategory: string) =>
  AnalyticsService.selectSituation2('financial', 'pension', subCategory)
</script>

<i18n>
{
  "en": {
    "you-receive": "You receive:",
    "rental-income": "rental income",
    "life-annuity": "a life annuity",
    "other-pension": "another type of pension"
  },
  "fr": {
    "you-receive": "Vous touchez :",
    "rental-income": "des revenus locatifs",
    "life-annuity": "une rente viagère",
    "other-pension": "un autre type de rente"
  }
}
</i18n>
