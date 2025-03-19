<template>
  <BackLinkRow label="Retraite ou autre pension" :to="ancestor" />
  <BackLinkRow label="Vous touchez une pension d’invalidité" :to="grandparent" />
  <BackLinkRow label="Vous ne touchez pas encore de pension d’invalidité" :to="parent" />
  <p class="fr-mb-1w">Saisissez le montant de vos revenus mensuels nets moyens&nbsp;:</p>
  <UploadFilesFinancial category="PENSION" step="PENSION_DISABILITY_NOT_YET">
    <template #incomeFilled>
      <p>Veuillez fournir une attestation de pension d’invalidité.</p>
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
