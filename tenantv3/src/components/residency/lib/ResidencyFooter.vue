<template>
  <FooterContainer class="residency-footer">
    <form @submit.prevent="back">
      <DfButton>
        <RiArrowLeftSLine size="1rem" class="color--primary mobile no-shrink" />
        <span class="desktop">{{ t('profilefooter.back') }}</span>
      </DfButton>
    </form>
    <form @submit.prevent="submit">
      <DfButton :disabled="disabled" primary>{{ t('validate-residency') }}</DfButton>
    </form>
  </FooterContainer>
</template>

<script setup lang="ts">
import FooterContainer from '@/components/footer/FooterContainer.vue'
import { DocumentService } from '@/services/DocumentService'
import { RiArrowLeftSLine } from '@remixicon/vue'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter, type RouteLocationRaw } from 'vue-router'

const {
  onSubmit,
  previousPage,
  enabled = null
} = defineProps<{
  onSubmit?: () => void
  previousPage: RouteLocationRaw
  enabled?: boolean
}>()

const { t } = useI18n()
const router = useRouter()
const disabled = computed(() =>
  enabled == null ? DocumentService.getUserDocs('RESIDENCY').length === 0 : !enabled
)

const submit = () => {
  if (onSubmit) {
    onSubmit()
  } else {
    router.push({ name: 'TenantProfessional' })
  }
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
