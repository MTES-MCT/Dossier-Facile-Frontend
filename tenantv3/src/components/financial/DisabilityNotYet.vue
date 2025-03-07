<template>
  <BackLinkRow label="Retraite ou autre pension" @click="router.push(ancestor)" />
  <BackLinkRow label="Vous touchez une pension d’invalidité" @click="router.push(grandparent)" />
  <BackLinkRow
    label="Vous ne touchez pas encore de pension d’invalidité"
    @click="router.push(parent)"
  />
  <p class="fr-mb-1w">Saisissez le montant de vos revenus mensuels nets moyens&nbsp;:</p>
  <input placeholder="Montant en euros" name="monthlySum" class="fr-input fr-mb-2w" required />
  <FinancialFooter />
</template>

<script setup lang="ts">
import BackLinkRow from '../common/BackLinkRow.vue'
import { useRouter } from 'vue-router'
import FinancialFooter from './FinancialFooter.vue'
import { useParentRoute } from '../guarantorResidency/useParentRoute'

const router = useRouter()
const parent = useParentRoute()
const grandparent = useParentRoute(2)
const ancestor = useParentRoute(3)
</script>
