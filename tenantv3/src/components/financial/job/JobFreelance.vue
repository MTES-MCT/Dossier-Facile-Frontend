<template>
  <BackLinkRow label="Revenus du travail" :to="grandparent" />
  <BackLinkRow label="Vous êtes indépendant" :to="parent" />
  <RadioList>
    <RadioListItem :to="here + '/auto-entrepreneur'">Vous êtes auto-entrepreneur</RadioListItem>
    <RadioListItem :to="here + '/autre'">Vous n’êtes pas auto-entrepreneur</RadioListItem>
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
