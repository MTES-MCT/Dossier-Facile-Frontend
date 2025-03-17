<template>
  <BackLinkRow label="Aide sociale" @click="router.push(grandparent)" />
  <BackLinkRow label="Vous touchez une aide de France Travail" @click="router.push(parent)" />
  <RadioList>
    <RadioListItem :to="here + '/plus-3-mois'">Depuis plus de 3 mois</RadioListItem>
    <RadioListItem :to="here + '/moins-3-mois'">Depuis moins de 3 mois</RadioListItem>
    <RadioListItem :to="here + '/pas-encore'">Vous ne touchez pas encore l’aide</RadioListItem>
  </RadioList>
  <FinancialFooter />
</template>

<script setup lang="ts">
import RadioList from '@/components/common/RadioList.vue'
import RadioListItem from '@/components/common/RadioListItem.vue'
import BackLinkRow from '@/components/common/BackLinkRow.vue'
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import FinancialFooter from '../lib/FinancialFooter.vue'
import { useParentRoute } from '../../guarantorResidency/useParentRoute'

const router = useRouter()
const route = useRoute()
const here = computed(() => route.path)
const parent = useParentRoute()
const grandparent = useParentRoute(2)
</script>
