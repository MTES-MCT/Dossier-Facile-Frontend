<template>
  <BackLinkRow label="Revenus du travail" @click="router.push(ancestor)" />
  <BackLinkRow label="Vous êtes indépendant" @click="router.push(grandparent)" />
  <BackLinkRow label="Vous êtes auto-entrepreneur" @click="router.push(parent)" />
  <p class="fr-mb-1w">
    Saisissez votre <strong>revenu mensuel net moyen avant prélèvement à la source</strong>, sans
    virgule :
  </p>
  <input placeholder="Montant en euros" name="monthlySum" class="fr-input fr-mb-2w" required />
  <div class="fr-alert fr-alert--warning">
    <p>
      <strong>Le montant saisi doit être réaliste.</strong>
    </p>
    <p>
      Faites la moyenne de vos revenus de ces 3 derniers mois. N’oubliez pas de retrancher vos
      cotisations salariales.
    </p>
    <p><strong>Notre équipe refuse automatiquement les revenus surévalués.</strong></p>
  </div>
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
