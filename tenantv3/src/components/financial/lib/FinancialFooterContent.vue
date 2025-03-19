<template>
  <FooterContainer class="footer">
    <router-link to="/documents-locataire/3" class="fr-btn fr-btn--secondary">
      <RiArrowLeftSLine size="1rem" class="color--primary mobile no-shrink" />
      <span class="desktop">Retour</span>
    </router-link>
    <DfButton primary data-cy="next-btn">Continuer</DfButton>
  </FooterContainer>
</template>

<script setup lang="ts">
import FooterContainer from '@/components/footer/FooterContainer.vue'
import { RiArrowLeftSLine } from '@remixicon/vue'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
</script>

<style scoped>
.footer {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 1rem;
}
</style>
