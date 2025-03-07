<template>
  <RadioList>
    <RadioListItem :to="here + '/travail'" @click="sendEvent('job')"
      >Revenus du travail
      <span class="fr-hint-text">Salarié, indépendant, intermittent…</span></RadioListItem
    >
    <RadioListItem :to="here + '/social'" @click="sendEvent('social')"
      >Aide sociale
      <span class="fr-hint-text">Chômage, allocations familiales, APL, RSA…</span>
    </RadioListItem>
    <RadioListItem :to="here + '/pension'" @click="sendEvent('pension')"
      >Retraite ou autre pension
      <span class="fr-hint-text">Pension alimentaire, d'invalidité…</span>
    </RadioListItem>
    <RadioListItem :to="here + '/rente'" @click="sendEvent('annuity')"
      >Rente
      <span class="fr-hint-text">Revenus locatifs, rente viagère…</span>
    </RadioListItem>
    <RadioListItem :to="here + '/bourse'" @click="sendEvent('grant')">Bourse</RadioListItem>
    <RadioListItem :to="here + '/pas-de-revenus'" @click="sendEvent('no-income')"
      >Pas de revenus</RadioListItem
    >
  </RadioList>
  <FinancialFooter />
</template>

<script setup lang="ts">
import RadioList from '../common/RadioList.vue'
import RadioListItem from '../common/RadioListItem.vue'
import { AnalyticsService } from '@/services/AnalyticsService'
import FinancialFooter from './FinancialFooter.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const here = computed(() => route.path)

const sendEvent = (subcategory: string) =>
  AnalyticsService.selectSituation('financial', subcategory)
</script>
