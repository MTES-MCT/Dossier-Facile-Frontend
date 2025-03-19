<template>
  <BackLinkRow label="Rente" :to="grandparent" />
  <BackLinkRow label="Vous touchez un autre type de rente" :to="parent" />
  <p class="fr-mb-1w">Saisissez le montant de vos revenus mensuels nets moyens&nbsp;:</p>
  <UploadFilesFinancial category="RENT" step="RENT_OTHER">
    <template #incomeFilled>
      <p>Veuillez fournir <strong>une attestation de rente</strong>.</p>
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
