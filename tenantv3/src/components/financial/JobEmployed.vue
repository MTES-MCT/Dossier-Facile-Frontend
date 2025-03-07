<template>
  <BackLinkRow label="Revenus du travail" @click="router.push(grandparent)" />
  <BackLinkRow label="Vous êtes salarié" @click="router.push(parent)" />
  <RadioList>
    <RadioListItem :to="here + '/plus-3-mois'">Depuis plus de 3 mois</RadioListItem>
    <RadioListItem :to="here + '/moins-3-mois'">Depuis moins de 3 mois</RadioListItem>
    <RadioListItem :to="here + '/pas-encore'"
      >Vous n’avez pas encore pris votre poste ou vous avez commencé depuis moins d’un
      mois</RadioListItem
    >
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
