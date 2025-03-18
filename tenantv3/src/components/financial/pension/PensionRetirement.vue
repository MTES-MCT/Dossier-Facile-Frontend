<template>
  <BackLinkRow label="Retraite ou autre pension" :to="grandparent" />
  <BackLinkRow label="Vous touchez une retraite" :to="parent" />
  <RadioList>
    <RadioListItem :to="here + '/bulletin'"
      >Vous avez un bulletin de pension
      <span class="fr-hint-text">Info retraite, AGIRC-ARCO, Carsat</span>
    </RadioListItem>
    <RadioListItem :to="here + '/pas-de-bulletin'"
      >Vous n’avez pas de bulletin de pension</RadioListItem
    >
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
