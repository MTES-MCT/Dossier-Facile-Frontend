<template>
  <BackLinkRow label="Revenus du travail" @click="router.push(ancestor)" />
  <BackLinkRow label="Vous êtes indépendant" @click="router.push(grandparent)" />
  <BackLinkRow label="Vous n’êtes pas auto-entrepreneur" @click="router.push(parent)" />
  <p class="fr-mb-1w">
    Saisissez votre <strong>revenu mensuel net moyen avant prélèvement à la source</strong>, sans
    virgule :
  </p>
  <UploadFilesFinancial category="SALARY" step="SALARY_FREELANCE_OTHER">
    <template #emptyIncome>
      <div class="fr-alert fr-alert--warning">
        <p>Le montant saisi doit être réaliste.</p>
        <p>Notre équipe refuse automatiquement les revenus surévalués.</p>
      </div>
    </template>
    <template #incomeFilled>
      <p class="fr-mb-0">Veuillez fournir, au choix :</p>
      <ul>
        <li>
          une <strong>attestation de votre comptable</strong> indiquant vos revenus les plus récents
        </li>
        <li>votre <strong>bilan comptable le plus récent</strong></li>
      </ul>
      <p>
        Si vous n’avez pas ces documents, veuillez transmettre des documents qui permettent de
        comprendre le calcul de vos revenus. Vous pouvez ajouter une
        <a href="https://www.service-public.fr/simulateur/calcul/AttestationHonneur" target="_blank"
          >attestation sur l’honneur</a
        >
        pour expliquer votre calcul.
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
