<template>
  <BackLinkRow label="Retraite ou autre pension" :to="ancestor" />
  <BackLinkRow label="Vous touchez une pension d’invalidité" :to="grandparent" />
  <BackLinkRow label="Depuis moins de 3 mois" :to="parent" />
  <p class="fr-mb-1w">Saisissez le montant de vos revenus mensuels nets moyens&nbsp;:</p>
  <UploadFilesFinancial category="PENSION" step="PENSION_DISABILITY_LESS_3_MONTHS">
    <template #incomeFilled>
      <p>
        Veuillez fournir <strong>tous les justificatifs dont vous disposez</strong> (un ou deux
        justificatifs).
      </p>
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
