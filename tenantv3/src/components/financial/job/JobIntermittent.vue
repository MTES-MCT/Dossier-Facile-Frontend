<template>
  <BackLinkRow label="Revenus du travail" :to="grandparent" />
  <BackLinkRow label="Vous êtes intermittent" :to="parent" />
  <p class="fr-mb-1w">
    Saisissez votre <strong>revenu mensuel net moyen avant prélèvement à la source</strong>, sans
    virgule :
  </p>
  <UploadFilesFinancial category="SALARY" step="SALARY_INTERMITTENT">
    <template #emptyIncome>
      <AlertAverageIncome />
    </template>
    <template #incomeFilled>
      <AlertAverageIncome class="fr-mb-3w" />
      <p>
        Veuillez fournir vos
        <strong>3 derniers justificatifs de déclaration de situation mensuelle</strong>. Si vous ne
        les avez pas, vous pouvez fournir vos 3 dernières attestations de paiement France Travail et
        vos bulletins de salaire de ces 3 derniers mois. Veuillez noter que ces documents sont plus
        difficiles à lire pour un propriétaire lorsqu’ils sont trop nombreux.
      </p>
    </template>
  </UploadFilesFinancial>
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import { useParentRoute } from '../../guarantorResidency/useParentRoute'
import UploadFilesFinancial from '../lib/UploadFilesFinancial.vue'
import AlertAverageIncome from './AlertAverageIncome.vue'

const parent = useParentRoute()
const grandparent = useParentRoute(2)
</script>
