<template>
  <BackLinkRow :label="t('form.financial.social-aid')" :to="grandparent" category="social" />
  <BackLinkRow
    :label="t('form.financial.you-receive.' + textKey, [t('form.financial.social.caf')])"
    :to="parent"
    category="social"
    step="caf"
  />
  <RadioList>
    <RadioListItem :to="here + '/plus-3-mois'" @click="sendEvent('plus-3-mois')">{{
      t('form.financial.more-3-months')
    }}</RadioListItem>
    <RadioListItem :to="here + '/moins-3-mois'" @click="sendEvent('moins-3-mois')">{{
      t('form.financial.less-3-months')
    }}</RadioListItem>
  </RadioList>
  <FinancialFooter />
</template>

<script setup lang="ts">
import RadioList from '@/components/common/RadioList.vue'
import RadioListItem from '@/components/common/RadioListItem.vue'
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import FinancialFooter from '../lib/FinancialFooter.vue'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import { useI18n } from 'vue-i18n'
import { useFinancialState } from '../financialState'
import { AnalyticsService } from '@/services/AnalyticsService'

const route = useRoute()
const here = computed(() => route.path)
const parent = useParentRoute()
const grandparent = useParentRoute(2)
const { t } = useI18n()
const { category, textKey } = useFinancialState()

const sendEvent = (subCategory: string) =>
  AnalyticsService.selectSituation3(category, 'social', 'caf', subCategory)
</script>
