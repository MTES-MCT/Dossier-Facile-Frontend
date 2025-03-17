<template>
  <BackLinkRow label="Rente" @click="router.push(ancestor)" />
  <BackLinkRow label="Vous touchez des revenus locatifs" @click="router.push(grandparent)" />
  <BackLinkRow label="Vous avez une quittance" @click="router.push(parent)" />
  <p class="fr-mb-1w">Saisissez le montant de vos revenus mensuels nets moyens&nbsp;:</p>
  <UploadFilesFinancial category="RENT" step="RENT_RENTAL_RECEIPT">
    <template #incomeFilled>
      <p>Veuillez fournir <strong>une quittance de moins de 3 mois</strong>.</p>
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
const ancestor = useParentRoute(3)
</script>
