<template>
  <BackLinkRow label="Retraite ou autre pension" :to="ancestor" />
  <BackLinkRow label="Vous touchez une retraite" :to="grandparent" />
  <BackLinkRow label="Vous n’avez pas de bulletin de pension" :to="parent" />
  <p class="fr-mb-1w">Saisissez le montant de vos revenus mensuels nets moyens&nbsp;:</p>
  <UploadFilesFinancial category="PENSION" step="PENSION_NO_STATEMENT">
    <template #incomeFilled>
      <p>Veuillez fournir <strong>votre dernier avis d’imposition 2023-24</strong>.</p>
      <div class="fr-alert fr-alert--warning">
        <p class="bold">Le montant saisi doit être réaliste.</p>
        <p>
          Par exemple : si la ligne “pension, retraite, rente” de votre avis d’imposition indique
          18000€, le montant de vos revenus locatifs est de 18000÷12=1500€.
        </p>
        <p class="bold">Notre équipe refuse automatiquement les revenus surévalués.</p>
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
