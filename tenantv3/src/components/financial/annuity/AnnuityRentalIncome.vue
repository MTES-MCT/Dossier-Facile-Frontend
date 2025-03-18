<template>
  <BackLinkRow label="Rente" :to="grandparent" />
  <BackLinkRow label="Vous touchez des revenus locatifs" :to="parent" />
  <RadioList>
    <RadioListItem :to="here + '/quittance'">Vous avez une quittance</RadioListItem>
    <RadioListItem :to="here + '/pas-de-quittance'">Vous n’avez pas de quittance</RadioListItem>
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
import { useParentRoute } from '../../guarantorResidency/useParentRoute'

const route = useRoute()
const here = computed(() => route.path)
const parent = useParentRoute()
const grandparent = useParentRoute(2)
</script>
