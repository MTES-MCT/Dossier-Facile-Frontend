<template>
  <FooterContainer class="residency-footer">
    <RouterLink :to="previousStep" class="fr-btn fr-btn--secondary">
      <VIcon icon="ri:arrow-left-s-line" />
      <span class="desktop">{{ t('profilefooter.back') }}</span>
    </RouterLink>

    <DsfrButton
      data-cy="next-btn"
      :type="submit ? 'submit' : 'button'"
      :form="formId ?? null"
      :label="t('profilefooter.continue')"
      icon="ri:check-line"
      @click="handleSubmit"
    />
  </FooterContainer>
</template>

<script setup lang="ts">
import FooterContainer from '@/components/footer/FooterContainer.vue'
import { useI18n } from 'vue-i18n'
import { useResidencyState } from '../residency/residencyState'
import { DsfrButton, VIcon } from '@gouvminint/vue-dsfr'
import { useNextStep } from '../common/lib/useNextStep'

const props = withDefaults(
  defineProps<{ formId?: string; submit?: boolean; onSubmit?: () => Promise<boolean> }>(),
  {
    formId: undefined,
    submit: true,
    onSubmit: undefined
  }
)

const { t } = useI18n()
const { category, nextStep, previousStep } = useResidencyState()
const { goNext } = useNextStep(category, nextStep)

const handleSubmit = async () => {
  const canContinue = !!props.onSubmit ? await props.onSubmit() : true
  if (canContinue) {
    goNext()
  }
}
</script>
