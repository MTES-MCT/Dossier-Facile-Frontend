<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'

const { t } = useI18n()
</script>

<template>
  <NakedCard class="fr-pl-3w fr-pr-3w">
    <h2 class="fr-h6">{{ t('feedback-request.title') }}</h2>
    <div class="fr-grid-row">
      <div class="fr-col-md-8 fr-col-sm">
        <p class="fr-text--sm">
          {{ t('feedback-request.content') }}
        </p>
      </div>
      <div class="fr-col-md-4 fr-col-sm">
        <a
          href="https://jedonnemonavis.numerique.gouv.fr/Demarches/3452?&view-mode=formulaire-avis&nd_source=button&key=811716eccd9bb2bc74f20052b0015c53"
        >
          <img src="../assets/button-je-donne-mon-avis.svg" alt="Je donne mon avis" />
        </a>
      </div>
    </div>
  </NakedCard>
</template>
