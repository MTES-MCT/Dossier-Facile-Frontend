<template>
  <BackLinkRow label="Revenus du travail" :to="grandparent" />
  <BackLinkRow label="Vous êtes intermittent" :to="parent" />
  <p class="fr-mb-1w">
    Saisissez votre <strong>revenu mensuel net moyen avant prélèvement à la source</strong>, sans
    virgule :
  </p>
  <UploadFilesFinancial category="SALARY" step="SALARY_INTERMITTENT">
    <template #emptyIncome>
      <div class="fr-alert fr-alert--warning">
        <p>
          <strong>Le montant saisi doit être réaliste.</strong>
        </p>
        <p>Veuillez faire une moyenne honnête de vos revenus.</p>
        <p>
          <strong>Notre équipe refuse automatiquement les revenus surévalués.</strong>
        </p>
      </div>
    </template>
    <template #incomeFilled>
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

const parent = useParentRoute()
const grandparent = useParentRoute(2)
</script>
