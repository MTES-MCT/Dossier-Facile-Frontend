<template>
  <BackLinkRow label="Retraite ou autre pension" @click="router.push(ancestor)" />
  <BackLinkRow label="Vous touchez une retraite" @click="router.push(grandparent)" />
  <BackLinkRow label="Vous n’avez pas de bulletin de pension" @click="router.push(parent)" />
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
