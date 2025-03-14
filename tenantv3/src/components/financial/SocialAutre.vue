<template>
  <BackLinkRow label="Aide sociale" @click="router.push(grandparent)" />
  <BackLinkRow label="une autre aide" @click="router.push(parent)" />
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
import BackLinkRow from '../common/BackLinkRow.vue'
import { useRouter } from 'vue-router'
import FinancialFooter from './FinancialFooter.vue'
import { useParentRoute } from '../guarantorResidency/useParentRoute'
import UploadFilesFinancial from './UploadFilesFinancial.vue'

const router = useRouter()
const parent = useParentRoute()
const grandparent = useParentRoute(2)
</script>
