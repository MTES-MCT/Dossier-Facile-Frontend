<template>
  <BackLinkRow label="Retraite ou autre pension" @click="router.push(grandparent)" />
  <BackLinkRow label="Vous touchez une retraite" @click="router.push(parent)" />
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
