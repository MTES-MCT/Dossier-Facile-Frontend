<template>
  <BackLinkRow label="Revenus du travail" @click="router.push(ancestor)" />
  <BackLinkRow label="Vous êtes indépendant" @click="router.push(grandparent)" />
  <BackLinkRow label="Vous êtes auto-entrepreneur" @click="router.push(parent)" />
  <p class="fr-mb-1w">
    Saisissez votre <strong>revenu mensuel net moyen avant prélèvement à la source</strong>, sans
    virgule :
  </p>
  <UploadFilesFinancial category="SALARY" step="SALARY_FREELANCE_AUTOENTREPRENEUR">
    <template #emptyIncome>
      <div class="fr-alert fr-alert--warning">
        <p>
          <strong>Le montant saisi doit être réaliste.</strong>
        </p>
        <p>
          Faites la moyenne de vos revenus de ces 3 derniers mois. N’oubliez pas de retrancher vos
          cotisations salariales.
        </p>
        <p><strong>Notre équipe refuse automatiquement les revenus surévalués.</strong></p>
      </div>
    </template>
    <template #incomeFilled>
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
