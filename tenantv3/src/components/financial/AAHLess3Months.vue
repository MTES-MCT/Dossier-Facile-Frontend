<template>
  <BackLinkRow label="Aide sociale" @click="router.push(ancestor)" />
  <BackLinkRow
    label="Vous touchez l’aide aux adultes handicapés (AAH)"
    @click="router.push(grandparent)"
  />
  <BackLinkRow label="Depuis moins de 3 mois" @click="router.push(parent)" />
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
