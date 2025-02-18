<template>
  <FooterContainer class="residency-footer">
    <router-link :to="`/info-garant/1/${guarantorId}`" class="fr-btn fr-btn--secondary">
      <RiArrowLeftSLine size="1rem" class="color--primary mobile no-shrink" />
      <span class="desktop">{{ t('backnext.back') }}</span>
    </router-link>
    <form @submit.prevent="submit">
      <DfButton primary>{{ t('backnext.continue') }}</DfButton>
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
import { useGuarantorId } from './useGuarantorId'

const { onSubmit } = defineProps<{ onSubmit?: () => Promise<boolean> }>()

const { t } = useI18n()
const router = useRouter()
const guarantorId = useGuarantorId()

const submit = async () => {
  AnalyticsService.validateFunnelStep('guarantor-residency')
  const goNext = onSubmit ? await onSubmit() : true
  if (goNext) {
    router.push(`/info-garant/3/${guarantorId.value}`)
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
