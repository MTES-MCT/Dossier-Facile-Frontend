<template>
  <BackLinkRow label="Vous êtes boursier" @click="router.push(parent)" />
  <p class="fr-mb-1w">Saisissez votre <strong>revenu mensuel net :</strong></p>
  <UploadFilesFinancial category="SCHOLARSHIP">
    <template #incomeFilled>
      <p>Veuillez fournir votre <strong>dernier avis d’attribution de bourse</strong>.</p>
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
</script>
