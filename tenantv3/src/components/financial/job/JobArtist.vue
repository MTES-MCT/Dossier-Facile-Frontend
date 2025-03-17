<template>
  <BackLinkRow label="Revenus du travail" @click="router.push(grandparent)" />
  <BackLinkRow label="Vous êtes artiste-auteur" @click="router.push(parent)" />
  <p class="fr-mb-1w">
    Saisissez votre <strong>revenu mensuel net moyen avant prélèvement à la source</strong>, sans
    virgule :
  </p>
  <UploadFilesFinancial category="SALARY" step="SALARY_ARTIST_AUTHOR">
    <template #emptyIncome>
      <div class="fr-alert fr-alert--warning">
        <p>
          <strong>Le montant saisi doit être réaliste.</strong>
        </p>
        <p>Veuillez faire une moyenne honnête de vos revenus.</p>
        <p>
          <strong>Notre équipe refuse automatiquement les revenus surévalués.</strong>
        </p>
      </div>
    </template>
    <template #incomeFilled>
      <p>
        Veuillez fournir votre <strong>déclaration de revenus et d’activité</strong> la plus
        récente. Ce document se trouve sur
        <a href="https://www.artistes-auteurs.urssaf.fr/aa/accueil" target="_blank"
          >votre espace artiste-auteur du site de l’Urssaf</a
        >. Si vous ne l’avez pas, vous pouvez fournir votre dernier avis d’imposition.
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
</script>
