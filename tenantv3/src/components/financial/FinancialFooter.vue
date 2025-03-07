<template>
  <FooterContainer class="footer">
    <router-link to="/documents-locataire/3" class="fr-btn fr-btn--secondary">
      <RiArrowLeftSLine size="1rem" class="color--primary mobile no-shrink" />
      <span class="desktop">Retour</span>
    </router-link>
    <form @submit.prevent="submit">
      <DfButton primary data-cy="next-btn">Continuer</DfButton>
    </form>
  </FooterContainer>
</template>

<script setup lang="ts">
import FooterContainer from '@/components/footer/FooterContainer.vue'
import { AnalyticsService } from '@/services/AnalyticsService'
import { RiArrowLeftSLine } from '@remixicon/vue'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import { useRouter } from 'vue-router'

const { onSubmit } = defineProps<{ onSubmit?: () => void }>()

const router = useRouter()

const submit = () => {
  AnalyticsService.validateFunnelStep('financial')
  if (onSubmit) {
    onSubmit()
  } else {
    router.push({ name: 'TenantTax' })
  }
}
</script>

<style scoped>
.footer {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 1rem;
}
</style>
