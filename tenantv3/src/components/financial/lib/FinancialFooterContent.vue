<template>
  <FooterContainer class="footer">
    <router-link to="/documents-locataire/3" class="fr-btn fr-btn--secondary">
      <RiArrowLeftSLine size="1rem" class="color--primary mobile no-shrink" />
      <span class="desktop">{{ t('back') }}</span>
    </router-link>
    <DfButton primary data-cy="next-btn">{{ t('next') }}</DfButton>
  </FooterContainer>
</template>

<script setup lang="ts">
import FooterContainer from '@/components/footer/FooterContainer.vue'
import { RiArrowLeftSLine } from '@remixicon/vue'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped>
.footer {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 1rem;
}
</style>

<i18n>
{
  "en": {
    "back": "Back",
    "next": "Next"
  },
  "fr": {
    "back": "Retour",
    "next": "Continuer"
  }
}
</i18n>
