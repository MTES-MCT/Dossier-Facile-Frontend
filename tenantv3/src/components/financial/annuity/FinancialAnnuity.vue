<template>
  <BackLinkRow label="Rente" :to="parent" />
  <p>Vous touchez :</p>
  <RadioList>
    <RadioListItem :to="here + '/revenus-locatifs'" @click="sendEvent('revenus-locatifs')"
      >des revenus locatifs</RadioListItem
    >
    <RadioListItem :to="here + '/viagere'" @click="sendEvent('viagere')"
      >une rente viagère</RadioListItem
    >
    <RadioListItem :to="here + '/autre'" @click="sendEvent('autre')"
      >un autre type de rente</RadioListItem
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
