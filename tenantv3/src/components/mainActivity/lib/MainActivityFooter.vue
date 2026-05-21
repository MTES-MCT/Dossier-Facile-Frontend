<template>
  <FooterContainer class="main-activity-footer">
    <RouterLink :to="previousStep" class="fr-btn fr-btn--secondary">
      <VIcon icon="ri:arrow-left-s-line" />
      <span class="desktop">{{ t('profilefooter.back') }}</span>
    </RouterLink>

    <DsfrButton
      data-cy="next-btn"
      :type="submit ? 'submit' : 'button'"
      :form="formId ?? null"
      :label="t('validate-main-activity')"
      :disabled
      icon="ri:check-line"
      @click="goNext"
    />
  </FooterContainer>
</template>

<script setup lang="ts">
import FooterContainer from '@/components/footer/FooterContainer.vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMainActivityState } from './mainActivityState'
import { DsfrButton, VIcon } from '@gouvminint/vue-dsfr'
import { useNextStep } from '@/components/common/lib/useNextStep'

withDefaults(
  defineProps<{
    formId?: string
    submit?: boolean
  }>(),
  { formId: undefined, submit: false }
)

const { t } = useI18n()
const { category, nextStep, previousStep, document } = useMainActivityState()
const disabled = computed(() => document.value == undefined)
const { goNext } = useNextStep(category, nextStep)
</script>

<i18n lang="json">
{
  "en": {
    "validate-main-activity": "Validate your main activity"
  },
  "fr": {
    "validate-main-activity": "Valider votre activité principale"
  }
}
</i18n>
