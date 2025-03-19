<template>
  <BackLinkRow label="Revenus du travail" :to="ancestor" />
  <BackLinkRow label="Vous êtes salarié" :to="grandparent" />
  <BackLinkRow label="Depuis moins de 3 mois" :to="parent" />
  <p class="fr-mb-1w">
    Saisissez votre <strong>revenu mensuel net moyen avant prélèvement à la source</strong>, sans
    virgule :
  </p>
  <UploadFilesFinancial category="SALARY" step="SALARY_EMPLOYED_LESS_3_MONTHS">
    <template #emptyIncome>
      <div class="fr-alert fr-alert--warning">
        <p>Le montant saisi doit être réaliste.</p>
        <p>Notre équipe refuse automatiquement les revenus surévalués.</p>
      </div>
    </template>
    <template #incomeFilled>
      <p>
        Veuillez fournir <strong>tous les bulletins de salaire dont vous disposez</strong> (un ou
        deux bulletins).
      </p>
    </template>
  </UploadFilesFinancial>
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import { useParentRoute } from '../../guarantorResidency/useParentRoute'
import UploadFilesFinancial from '../lib/UploadFilesFinancial.vue'

const parent = useParentRoute()
const grandparent = useParentRoute(2)
const ancestor = useParentRoute(3)
</script>
