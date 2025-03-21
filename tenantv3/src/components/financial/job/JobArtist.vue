<template>
  <BackLinkRow label="Revenus du travail" :to="grandparent" />
  <BackLinkRow label="Vous êtes artiste-auteur" :to="parent" />
  <p class="fr-mb-1w">
    Saisissez votre <strong>revenu mensuel net moyen avant prélèvement à la source</strong>, sans
    virgule :
  </p>
  <UploadFilesFinancial category="SALARY" step="SALARY_ARTIST_AUTHOR">
    <template #emptyIncome>
      <AlertAverageIncome />
    </template>
    <template #incomeFilled>
      <AlertAverageIncome class="fr-mb-3w" />
      <p>
        Veuillez fournir votre <strong>déclaration de revenus et d’activité</strong> la plus
        récente. Ce document se trouve sur
        <a href="https://www.artistes-auteurs.urssaf.fr/aa/accueil" target="_blank"
          >votre espace artiste-auteur du site de l’Urssaf</a
        >. Si vous ne l’avez pas, vous pouvez fournir votre dernier avis d’imposition.
      </p>
    </template>
  </UploadFilesFinancial>
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import { useParentRoute } from '../../guarantorResidency/useParentRoute'
import UploadFilesFinancial from '../lib/UploadFilesFinancial.vue'
import AlertAverageIncome from './AlertAverageIncome.vue'

const parent = useParentRoute()
const grandparent = useParentRoute(2)
</script>
