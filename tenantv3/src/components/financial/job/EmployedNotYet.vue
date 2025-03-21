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
      <AlertEmployedNotYet />
    </template>
    <template #incomeFilled>
      <AlertEmployedNotYet class="fr-mb-3w" />
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
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import { useParentRoute } from '../../guarantorResidency/useParentRoute'
import UploadFilesFinancial from '../lib/UploadFilesFinancial.vue'
import AlertEmployedNotYet from './AlertEmployedNotYet.vue'

const parent = useParentRoute()
const grandparent = useParentRoute(2)
const ancestor = useParentRoute(3)
</script>
