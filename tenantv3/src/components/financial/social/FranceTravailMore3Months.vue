<template>
  <BackLinkRow label="Aide sociale" :to="ancestor" />
  <BackLinkRow label="Vous touchez une aide de France Travail" :to="grandparent" />
  <BackLinkRow label="Depuis plus de 3 mois" :to="parent" />
  <p class="fr-mb-1w">
    Saisissez votre <strong>revenu mensuel net moyen avant prélèvement à la source</strong>, sans
    virgule&nbsp;:
  </p>
  <UploadFilesFinancial
    category="SOCIAL_SERVICE"
    step="SOCIAL_SERVICE_FRANCE_TRAVAIL_MORE_3_MONTHS"
  >
    <template #incomeFilled>
      <p>
        Veuillez fournir les attestations de paiement France Travail de <strong>septembre</strong>,
        <strong>octobre</strong> et <strong>novembre</strong>. Vous pouvez ajouter l’attestation de
        décembre si vous l’avez.
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
