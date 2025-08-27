<template>
  <FooterContainer class="main-activity-footer">
    <router-link :to="state.previousStep" class="fr-btn fr-btn--secondary">
      <RiArrowLeftSLine size="1rem" class="color--primary mobile no-shrink" aria-hidden="true" />
      <span class="desktop">{{ t('profilefooter.back') }}</span>
    </router-link>
    <form @submit.prevent="submit">
      <DfButton :disabled="disabled" primary data-cy="next-btn">{{
        t('validate-main-activity')
      }}</DfButton>
    </form>
  </FooterContainer>
</template>

<script setup lang="ts">
import FooterContainer from '@/components/footer/FooterContainer.vue'
import { AnalyticsService } from '@/services/AnalyticsService'
import { RiArrowLeftSLine } from '@remixicon/vue'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useMainActivityState } from './mainActivityState'

const { t } = useI18n()
const router = useRouter()
const state = useMainActivityState()
const disabled = computed(() => state.document.value == undefined)

const submit = () => {
  AnalyticsService.validateFunnelStep(state.category)
  router.push(state.nextStep)
}
</script>

<style scoped>
.main-activity-footer {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 1rem;
}
</style>

<i18n>
{
  "en": {
    "validate-main-activity": "Validate your main activity",
  },
  "fr": {
    "validate-main-activity": "Valider votre activité principale"
  }
}
</i18n>
