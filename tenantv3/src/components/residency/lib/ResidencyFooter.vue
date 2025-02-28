<template>
  <FooterContainer class="residency-footer">
    <router-link :to="residencyState.previousStep" class="fr-btn fr-btn--secondary">
      <RiArrowLeftSLine size="1rem" class="color--primary mobile no-shrink" />
      <span class="desktop">{{ t('profilefooter.back') }}</span>
    </router-link>
    <form @submit.prevent="submit">
      <DfButton :disabled="disabled" primary data-cy="next-btn">{{
        t('validate-residency')
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
import { useResidencyState } from '../residencyState'

const { onSubmit, enabled = null } = defineProps<{
  onSubmit?: () => void
  enabled?: boolean
}>()

const { t } = useI18n()
const router = useRouter()
const residencyState = useResidencyState()
const disabled = computed(() =>
  enabled == null ? residencyState.document.value == undefined : !enabled
)

const submit = () => {
  AnalyticsService.validateFunnelStep('residency')
  if (onSubmit) {
    onSubmit()
  } else {
    router.push(residencyState.nextStep)
  }
}
</script>

<style scoped>
.residency-footer {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 1rem;
}
</style>

<i18n>
{
  "en": {
    "validate-residency": "Validate your housing situation",
  },
  "fr": {
    "validate-residency": "Valider votre situation d'hébergement"
  }
}
</i18n>
