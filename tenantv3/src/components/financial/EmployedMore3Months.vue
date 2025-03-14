<template>
  <BackLinkRow label="Revenus du travail" @click="router.push(ancestor)" />
  <BackLinkRow label="Vous êtes salarié" @click="router.push(grandparent)" />
  <BackLinkRow label="Depuis plus de 3 mois" @click="router.push(parent)" />
  <p class="fr-mb-1w">
    Saisissez votre <strong>revenu mensuel net moyen avant prélèvement à la source</strong>, sans
    virgule :
  </p>
  <UploadFilesFinancial category="SALARY" step="SALARY_EMPLOYED_MORE_3_MONTHS">
    <template #emptyIncome>
      <div class="fr-alert fr-alert--warning">
        <p>Le montant saisi doit être réaliste.</p>
        <p>Notre équipe refuse automatiquement les revenus surévalués.</p>
      </div>
    </template>
    <template #incomeFilled>
      <p class="fr-mb-0">
        Veuillez fournir vos <strong>3 derniers bulletins de salaire</strong>&nbsp;:
      </p>
      <ul class="bold">
        <li>septembre</li>
        <li>octobre</li>
        <li>novembre</li>
      </ul>
      <p>Vous pouvez ajouter le bulletin de décembre si vous l’avez.</p>
    </template>
  </UploadFilesFinancial>
  <FinancialFooter />
</template>

<script setup lang="ts">
import BackLinkRow from '../common/BackLinkRow.vue'
import { useRouter } from 'vue-router'
import FinancialFooter from './FinancialFooter.vue'
import { useParentRoute } from '../guarantorResidency/useParentRoute'
import UploadFilesFinancial from './UploadFilesFinancial.vue'

const router = useRouter()
const parent = useParentRoute()
const grandparent = useParentRoute(2)
const ancestor = useParentRoute(3)
</script>
