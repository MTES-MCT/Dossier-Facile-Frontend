<template>
  <BackLinkRow label="Retraite ou autre pension" @click="router.push(parent)" />
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
