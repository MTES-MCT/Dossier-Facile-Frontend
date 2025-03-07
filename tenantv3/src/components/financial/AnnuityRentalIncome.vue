<template>
  <BackLinkRow label="Rente" @click="router.push(grandparent)" />
  <BackLinkRow label="Vous touchez des revenus locatifs" @click="router.push(parent)" />
  <RadioList>
    <RadioListItem :to="here + '/quittance'">Vous avez une quittance</RadioListItem>
    <RadioListItem :to="here + '/pas-de-quittance'">Vous n’avez pas de quittance</RadioListItem>
  </RadioList>
  <FinancialFooter />
</template>

<script setup lang="ts">
import RadioList from '../common/RadioList.vue'
import RadioListItem from '../common/RadioListItem.vue'
import BackLinkRow from '../common/BackLinkRow.vue'
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import FinancialFooter from './FinancialFooter.vue'
import { useParentRoute } from '../guarantorResidency/useParentRoute'

const router = useRouter()
const route = useRoute()
const here = computed(() => route.path)
const parent = useParentRoute()
const grandparent = useParentRoute(2)
</script>
