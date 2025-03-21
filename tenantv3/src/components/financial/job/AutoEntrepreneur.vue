<template>
  <BackLinkRow label="Revenus du travail" :to="ancestor" />
  <BackLinkRow label="Vous êtes indépendant" :to="grandparent" />
  <BackLinkRow label="Vous êtes auto-entrepreneur" :to="parent" />
  <p class="fr-mb-1w">
    Saisissez votre <strong>revenu mensuel net moyen avant prélèvement à la source</strong>, sans
    virgule :
  </p>
  <UploadFilesFinancial category="SALARY" step="SALARY_FREELANCE_AUTOENTREPRENEUR">
    <template #emptyIncome>
      <AlertAutoEntrepreneur />
    </template>
    <template #incomeFilled>
      <AlertAutoEntrepreneur class="fr-mb-3w" />
      <p class="fr-mb-0">Veuillez fournir, au choix :</p>
      <ul>
        <li>vos <strong>3 dernières déclarations mensuelles</strong> de recettes</li>
        <li>votre <strong>dernière déclaration trimestrielle</strong> de recettes</li>
      </ul>
      <p>
        Ces documents se trouvent sur le
        <a href="https://www.autoentrepreneur.urssaf.fr/portail/accueil.html" target="_blank"
          >service auto-entrepreneur</a
        >
        du site de l’URSSAF.
      </p>
      <p>
        Note : vous pouvez fournir plus de documents (par exemple les 6 derniers mois) si vous le
        souhaitez.
      </p>
    </template>
  </UploadFilesFinancial>
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import { useParentRoute } from '../../guarantorResidency/useParentRoute'
import UploadFilesFinancial from '../lib/UploadFilesFinancial.vue'
import AlertAutoEntrepreneur from './AlertAutoEntrepreneur.vue'

const parent = useParentRoute()
const grandparent = useParentRoute(2)
const ancestor = useParentRoute(3)
</script>
