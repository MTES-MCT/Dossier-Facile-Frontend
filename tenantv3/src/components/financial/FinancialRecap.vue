<template>
  <h2>Vos revenus</h2>
  <NakedCard class="fr-p-md-5w fr-mb-3w fr-grid-col">
    <div class="fr-highlight">
      <p>
        Les documents fournis permettent aux propriétaires de
        <strong>connaître vos moyens financiers</strong>.
      </p>
      <p>
        Vous pouvez ajouter <strong>autant de revenus que vous le souhaitez</strong> : revenus du
        travail, aides sociales, retraite, bourse...
      </p>
      <p>
        Soyez réaliste :
        <strong>notre équipe refuse automatiquement les montants surévalués</strong>.
      </p>
    </div>
    <router-link to="4/ajouter" class="fr-btn fr-ml-auto fr-mt-3w"
      >Ajouter un revenu <RiAddFill class="tr-5"
    /></router-link>
  </NakedCard>
  <SimulationCaf />
</template>

<script setup lang="ts">
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import SimulationCaf from '../documents/share/SimulationCaf.vue'
import { RiAddFill } from '@remixicon/vue'
</script>

<style scoped>
.tr-5 {
  translate: 5px;
}
</style>
