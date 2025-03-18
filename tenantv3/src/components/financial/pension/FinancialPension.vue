<template>
  <BackLinkRow label="Retraite ou autre pension" :to="parent" />
  <p>Vous touchez :</p>
  <RadioList>
    <RadioListItem :to="here + '/retraite'" @click="sendEvent('retraite')"
      >une retraite</RadioListItem
    >
    <RadioListItem :to="here + '/invalidite'" @click="sendEvent('invalidite')"
      >une pension d'invalidité</RadioListItem
    >
    <RadioListItem :to="here + '/alimentaire'" @click="sendEvent('alimentaire')"
      >une pension alimentaire</RadioListItem
    >
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

const route = useRoute()
const here = computed(() => route.path)
const parent = useParentRoute()

const sendEvent = (subCategory: string) =>
  AnalyticsService.selectSituation2('financial', 'pension', subCategory)
</script>
