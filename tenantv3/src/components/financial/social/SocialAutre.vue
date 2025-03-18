<template>
  <BackLinkRow label="Aide sociale" :to="grandparent" />
  <BackLinkRow label="une autre aide" :to="parent" />
  <p class="fr-mb-1w">Saisissez le montant de vos revenus mensuels nets moyens&nbsp;:</p>
  <UploadFilesFinancial category="SOCIAL_SERVICE" step="SOCIAL_SERVICE_OTHER">
    <template #incomeFilled>
      <p>
        Veuillez fournir un justificatif de cette aide. Le document doit indiquer
        <strong>le montant de l’aide</strong> et <strong>la fréquence des versements</strong>.
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
</script>
