<template>
  <FooterContainer class="identification-footer">
    <RouterLink :to="previousStep" class="fr-btn fr-btn--secondary">
      <RiArrowLeftSLine size="1rem" class="color--primary mobile no-shrink" />
      <span class="desktop">{{ t('profilefooter.back') }}</span>
    </RouterLink>
    <form @submit.prevent="submit">
      <DfButton primary data-cy="next-btn">{{ t('profilefooter.continue') }}</DfButton>
    </form>
  </FooterContainer>
</template>

<script setup lang="ts">
import FooterContainer from '@/components/footer/FooterContainer.vue'
import { AnalyticsService } from '@/services/AnalyticsService'
import { RiArrowLeftSLine } from '@remixicon/vue'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useIdentificationState } from './identityDocumentState'

const { t } = useI18n()
const router = useRouter()
const { previousStep, nextStep, category } = useIdentificationState()

const submit = () => {
  AnalyticsService.validateFunnelStep(category)
  router.push(nextStep)
}
</script>

<style scoped>
.identification-footer {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 1rem;
}
</style>
