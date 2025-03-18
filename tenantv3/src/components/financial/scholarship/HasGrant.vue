<template>
  <BackLinkRow label="Vous êtes boursier" :to="parent" />
  <p class="fr-mb-1w">Saisissez votre <strong>revenu mensuel net :</strong></p>
  <UploadFilesFinancial category="SCHOLARSHIP">
    <template #incomeFilled>
      <p>Veuillez fournir votre <strong>dernier avis d’attribution de bourse</strong>.</p>
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
</script>
