<template>
  <BackLinkRow label="Rente" @click="router.push(parent)" />
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
import RadioList from '../common/RadioList.vue'
import RadioListItem from '../common/RadioListItem.vue'
import BackLinkRow from '../common/BackLinkRow.vue'
import { AnalyticsService } from '@/services/AnalyticsService'
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import FinancialFooter from './FinancialFooter.vue'
import { useParentRoute } from '../guarantorResidency/useParentRoute'

const router = useRouter()
const route = useRoute()
const here = computed(() => route.path)
const parent = useParentRoute()

const sendEvent = (subCategory: string) =>
  AnalyticsService.selectSituation2('financial', 'pension', subCategory)
</script>
