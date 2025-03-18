<template>
  <BackLinkRow label="Revenus du travail" :to="ancestor" />
  <BackLinkRow label="Vous êtes salarié" :to="grandparent" />
  <BackLinkRow label="Pas encore commencé ou depuis moins d’un mois" :to="parent" />
  <p class="fr-mb-1w">
    Saisissez votre <strong>revenu mensuel net moyen avant prélèvement à la source</strong>, sans
    virgule :
  </p>
  <UploadFilesFinancial category="SALARY" step="SALARY_EMPLOYED_NOT_YET">
    <template #emptyIncome>
      <div class="fr-alert fr-alert--warning">
        <p>Le montant saisi doit être réaliste.</p>
        <p>
          Par exemple : si votre contrat indique un montant de 30000€ par an, votre salaire net
          mensuel est de 30000/12x0,75=1875€ net par mois.
        </p>
        <p><strong>Notre équipe refuse automatiquement les revenus surévalués.</strong></p>
      </div>
    </template>
    <template #incomeFilled>
      <p>
        Veuillez fournir
        <strong>la page de votre contrat qui indique votre rémunération à venir</strong>.
      </p>
      <div class="fr-alert fr-alert--info fr-mb-3w">
        <p>
          Si vous ne savez pas extraire une page de votre contrat, vous pouvez fournir une copie
          d’écran de cette page.
        </p>
      </div>
    </template>
  </UploadFilesFinancial>
  <FinancialFooter />
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import FinancialFooter from '../lib/FinancialFooter.vue'
import { useParentRoute } from '../../guarantorResidency/useParentRoute'
import UploadFilesFinancial from '../lib/UploadFilesFinancial.vue'

const parent = useParentRoute()
const grandparent = useParentRoute(2)
const ancestor = useParentRoute(3)
</script>
