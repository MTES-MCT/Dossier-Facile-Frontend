<template>
  <BackLinkRow label="Rente" :to="ancestor" />
  <BackLinkRow label="Vous touchez des revenus locatifs" :to="grandparent" />
  <BackLinkRow label="Vous avez une quittance" :to="parent" />
  <p class="fr-mb-1w">Saisissez le montant de vos revenus mensuels nets moyens&nbsp;:</p>
  <UploadFilesFinancial category="RENT" step="RENT_RENTAL_RECEIPT">
    <template #incomeFilled>
      <p>Veuillez fournir <strong>une quittance de moins de 3 mois</strong>.</p>
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
