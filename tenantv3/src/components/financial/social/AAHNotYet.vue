<template>
  <BackLinkRow label="Aide sociale" :to="ancestor" />
  <BackLinkRow label="Vous touchez l’aide aux adultes handicapés (AAH)" :to="grandparent" />
  <BackLinkRow label="Vous ne touchez pas encore l’AAH" :to="parent" />
  <p class="fr-mb-1w">Saisissez le montant de vos revenus mensuels nets moyens&nbsp;:</p>
  <UploadFilesFinancial category="SOCIAL_SERVICE" step="SOCIAL_SERVICE_AAH_NOT_YET">
    <template #incomeFilled>
      <p>Veuillez fournir la notification de décision de la MDPH.</p>
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
