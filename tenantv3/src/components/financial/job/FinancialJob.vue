<template>
  <BackLinkRow label="Revenus du travail" @click="router.push(parent)" />
  <p>Vous êtes :</p>
  <RadioList>
    <RadioListItem :to="here + '/salarie'" @click="sendEvent('employed')">salarié</RadioListItem>
    <RadioListItem :to="here + '/independant'" @click="sendEvent('freelance')"
      >indépendant</RadioListItem
    >
    <RadioListItem :to="here + '/intermittent'" @click="sendEvent('intermittent')"
      >intermittent</RadioListItem
    >
    <RadioListItem :to="here + '/artiste-auteur'" @click="sendEvent('artist-author')"
      >artiste-auteur</RadioListItem
    >
  </RadioList>
  <FinancialFooter />
</template>

<script setup lang="ts">
import RadioList from '@/components/common/RadioList.vue'
import RadioListItem from '@/components/common/RadioListItem.vue'
import BackLinkRow from '@/components/common/BackLinkRow.vue'
import { AnalyticsService } from '@/services/AnalyticsService'
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import FinancialFooter from '../lib/FinancialFooter.vue'
import { useParentRoute } from '../../guarantorResidency/useParentRoute'

const router = useRouter()
const route = useRoute()
const here = computed(() => route.path)
const parent = useParentRoute()

const sendEvent = (subCategory: string) =>
  AnalyticsService.selectSituation2('financial', 'travail', subCategory)
</script>
