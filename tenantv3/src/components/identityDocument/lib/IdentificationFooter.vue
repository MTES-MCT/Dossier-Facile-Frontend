<template>
  <FooterContainer class="identification-footer">
    <RouterLink :to="{ name: 'TenantType' }" class="fr-btn fr-btn--secondary">
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
import { useResidencyLink } from '@/components/residency/lib/useResidencyLink'
import { AnalyticsService } from '@/services/AnalyticsService'
import { RiArrowLeftSLine } from '@remixicon/vue'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()
const residencyLink = useResidencyLink()

const submit = () => {
  AnalyticsService.validateFunnelStep('identification')
  router.push(residencyLink.value)
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
