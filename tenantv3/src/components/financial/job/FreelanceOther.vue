<template>
  <BackLinkRow label="Revenus du travail" :to="ancestor" />
  <BackLinkRow label="Vous êtes indépendant" :to="grandparent" />
  <BackLinkRow label="Vous n’êtes pas auto-entrepreneur" :to="parent" />
  <p class="fr-mb-1w">
    Saisissez votre <strong>revenu mensuel net moyen avant prélèvement à la source</strong>, sans
    virgule :
  </p>
  <UploadFilesFinancial category="SALARY" step="SALARY_FREELANCE_OTHER">
    <template #emptyIncome>
      <AlertRealisticAmount />
    </template>
    <template #incomeFilled>
      <AlertRealisticAmount class="fr-mb-3w" />
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
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import { useParentRoute } from '../../guarantorResidency/useParentRoute'
import UploadFilesFinancial from '../lib/UploadFilesFinancial.vue'
import AlertRealisticAmount from './AlertRealisticAmount.vue'

const parent = useParentRoute()
const grandparent = useParentRoute(2)
const ancestor = useParentRoute(3)
</script>
