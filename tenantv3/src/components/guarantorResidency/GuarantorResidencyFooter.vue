<template>
  <FooterContainer class="residency-footer">
    <form @submit.prevent="back">
      <DfButton>
        <RiArrowLeftSLine size="1rem" class="color--primary mobile no-shrink" />
        <span class="desktop">{{ t('backnext.back') }}</span>
      </DfButton>
    </form>
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
import { useRouter, type RouteLocationRaw } from 'vue-router'
import { useGuarantorId } from './useGuarantorId'

const { previousPage } = defineProps<{ previousPage: RouteLocationRaw }>()

const { t } = useI18n()
const router = useRouter()
const guarantorId = useGuarantorId()

const submit = () => {
  AnalyticsService.validateFunnelStep('guarantor-residency')
  router.push(`/info-garant/3/${guarantorId}`)
}

const back = () => {
  router.push(previousPage)
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
