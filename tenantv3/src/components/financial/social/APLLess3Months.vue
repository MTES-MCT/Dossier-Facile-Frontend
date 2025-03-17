<template>
  <BackLinkRow label="Aide sociale" @click="router.push(ancestor)" />
  <BackLinkRow
    label="Vous touchez l’aide personnalisée au logement (APL)"
    @click="router.push(grandparent)"
  />
  <BackLinkRow label="Depuis moins de 3 mois" @click="router.push(parent)" />
  <p class="fr-mb-1w">Saisissez le montant de vos revenus mensuels nets moyens&nbsp;:</p>
  <UploadFilesFinancial category="SOCIAL_SERVICE" step="SOCIAL_SERVICE_APL_LESS_3_MONTHS">
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
