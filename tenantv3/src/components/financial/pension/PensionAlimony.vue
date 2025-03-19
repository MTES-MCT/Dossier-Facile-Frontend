<template>
  <BackLinkRow label="Retraite ou autre pension" :to="grandparent" />
  <BackLinkRow label="Vous touchez une pension alimentaire" :to="parent" />
  <p class="fr-mb-1w">Saisissez le montant de vos revenus mensuels nets moyens&nbsp;:</p>
  <UploadFilesFinancial category="PENSION" step="PENSION_ALIMONY">
    <template #incomeFilled>
      <p>Veuillez fournir <strong>un justificatif de pension alimentaire</strong>.</p>
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
