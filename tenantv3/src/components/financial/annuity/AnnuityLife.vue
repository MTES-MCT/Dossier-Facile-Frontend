<template>
  <BackLinkRow label="Rente" @click="router.push(grandparent)" />
  <BackLinkRow label="Vous touchez une rente viagère" @click="router.push(parent)" />
  <p class="fr-mb-1w">Saisissez le montant de vos revenus mensuels nets moyens&nbsp;:</p>
  <UploadFilesFinancial category="RENT" step="RENT_ANNUITY_LIFE">
    <template #incomeFilled>
      <p>Veuillez fournir <strong>une attestation de rente viagère</strong>.</p>
    </template>
  </UploadFilesFinancial>
  <FinancialFooter />
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/common/BackLinkRow.vue'
import { useRouter } from 'vue-router'
import FinancialFooter from '../lib/FinancialFooter.vue'
import { useParentRoute } from '../../guarantorResidency/useParentRoute'
import UploadFilesFinancial from '../lib/UploadFilesFinancial.vue'

const router = useRouter()
const parent = useParentRoute()
const grandparent = useParentRoute(2)
</script>
