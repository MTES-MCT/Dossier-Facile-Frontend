<template>
  <BackLinkRow label="Aide sociale" @click="router.push(ancestor)" />
  <BackLinkRow label="Vous touchez une aide de France Travail" @click="router.push(grandparent)" />
  <BackLinkRow label="Vous ne touchez pas encore l’aide" @click="router.push(parent)" />
  <p class="fr-mb-1w">
    Saisissez votre <strong>revenu mensuel net moyen avant prélèvement à la source</strong>, sans
    virgule&nbsp;:
  </p>
  <UploadFilesFinancial category="SOCIAL_SERVICE" step="SOCIAL_SERVICE_FRANCE_TRAVAIL_NOT_YET">
    <template #incomeFilled>
      <p>
        Veuillez fournir le document France Travail
        <strong>Ouverture de droit à l’allocation d’Aide au Retour à l’Emploi (ARE)</strong>.
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
const ancestor = useParentRoute(3)
</script>
