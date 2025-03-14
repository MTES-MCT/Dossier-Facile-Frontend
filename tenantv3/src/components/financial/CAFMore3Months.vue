<template>
  <BackLinkRow label="Aide sociale" @click="router.push(ancestor)" />
  <BackLinkRow
    label="Vous touchez une aide de la CAF ou de la MSA"
    @click="router.push(grandparent)"
  />
  <BackLinkRow label="Depuis plus de 3 mois" @click="router.push(parent)" />
  <p class="fr-mb-1w">Saisissez le montant de vos revenus mensuels nets moyens&nbsp;:</p>
  <UploadFilesFinancial category="SOCIAL_SERVICE" step="SOCIAL_SERVICE_CAF_MORE_3_MONTHS">
    <template #incomeFilled>
      <p>
        Veuillez fournir les justificatifs de versement de
        <strong> septembre, octobre et novembre</strong>. Vous pouvez ajouter le justificatif de
        décembre si vous l’avez.
      </p>
      <div class="fr-alert fr-alert--warning fr-mb-2w">
        <p>Notre équipe refuse automatiquement les dossiers avec 1 ou 2 justificatifs seulement.</p>
      </div>
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
