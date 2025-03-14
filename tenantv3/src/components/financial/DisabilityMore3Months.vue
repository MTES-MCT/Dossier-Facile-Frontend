<template>
  <BackLinkRow label="Retraite ou autre pension" @click="router.push(ancestor)" />
  <BackLinkRow label="Vous touchez une pension d’invalidité" @click="router.push(grandparent)" />
  <BackLinkRow label="Depuis plus de 3 mois" @click="router.push(parent)" />
  <p class="fr-mb-1w">Saisissez le montant de vos revenus mensuels nets moyens&nbsp;:</p>
  <UploadFilesFinancial category="PENSION" step="PENSION_DISABILITY_MORE_3_MONTHS">
    <template #incomeFilled>
      <p>Veuillez fournir <strong>vos 3 derniers justificatifs de versement</strong>.</p>
    </template>
  </UploadFilesFinancial>
  <FinancialFooter />
</template>

<script setup lang="ts">
import BackLinkRow from '../common/BackLinkRow.vue'
import { useRouter } from 'vue-router'
import FinancialFooter from './FinancialFooter.vue'
import { useParentRoute } from '../guarantorResidency/useParentRoute'
import UploadFilesFinancial from './UploadFilesFinancial.vue'

const router = useRouter()
const parent = useParentRoute()
const grandparent = useParentRoute(2)
const ancestor = useParentRoute(3)
</script>
