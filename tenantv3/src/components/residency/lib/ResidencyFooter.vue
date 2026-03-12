<template>
  <FooterContainer class="residency-footer">
    <RouterLink :to="previousStep" class="fr-btn fr-btn--secondary">
      <VIcon icon="ri:arrow-left-s-line" />
      <span class="desktop">{{ t('profilefooter.back') }}</span>
    </RouterLink>

    <DsfrButton
      ref="submit-button"
      data-cy="next-btn"
      :disabled
      :type="submit ? 'submit' : 'button'"
      :form="formId ?? null"
      :label="t('validate-residency')"
      icon="ri:check-line"
      @click="handleSubmit"
    />
  </FooterContainer>
</template>

<script setup lang="ts">
import FooterContainer from '@/components/footer/FooterContainer.vue'
import { AnalyticsService } from '@/services/AnalyticsService'
import { computed, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useResidencyState } from '../residencyState'
import { DsfrButton, VIcon } from '@gouvminint/vue-dsfr'
import { useNextStep } from '@/components/common/lib/useNextStep'

const props = withDefaults(
  defineProps<{
    onSubmit?: () => void
    disabled?: boolean
    formId?: string
    submit?: boolean
  }>(),
  { onSubmit: undefined, disabled: true, formId: undefined, submit: false }
)

const { t } = useI18n()
const { nextStep, previousStep, document, category } = useResidencyState()
const disabled = computed(() => !document.value && props.disabled)
const { goNext } = useNextStep(category, nextStep)
const submitBtn = useTemplateRef<InstanceType<typeof DsfrButton>>('submit-button')
defineExpose({ submit: computed(() => submitBtn.value?.$el) })

const handleSubmit = () => {
  if (!!props.onSubmit) {
    AnalyticsService.validateFunnelStep(category)
    props.onSubmit()
  } else {
    goNext()
  }
}
</script>

<i18n lang="json">
{
  "en": {
    "validate-residency": "Validate your housing situation"
  },
  "fr": {
    "validate-residency": "Valider votre situation d'hébergement"
  }
}
</i18n>
