<template>
  <BackLinkRow label="Revenus du travail" @click="router.push(grandparent)" />
  <BackLinkRow label="Vous êtes indépendant" @click="router.push(parent)" />
  <RadioList>
    <RadioListItem :to="here + '/auto-entrepreneur'">Vous êtes auto-entrepreneur</RadioListItem>
    <RadioListItem :to="here + '/autre'">Vous n’êtes pas auto-entrepreneur</RadioListItem>
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
