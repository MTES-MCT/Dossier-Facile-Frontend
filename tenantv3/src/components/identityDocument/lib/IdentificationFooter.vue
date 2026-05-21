<template>
  <FooterContainer class="identification-footer">
    <RouterLink :to="previousStep" class="fr-btn fr-btn--secondary">
      <VIcon icon="ri:arrow-left-s-line" />
      <span class="desktop">{{ t('profilefooter.back') }}</span>
    </RouterLink>

    <DsfrButton
      data-cy="next-btn"
      :type="submit ? 'submit' : 'button'"
      :form="formId ?? null"
      :disabled
      :label="t('profilefooter.continue')"
      icon="ri:check-line"
      @click="goNext"
    />
  </FooterContainer>
</template>

<script setup lang="ts">
import FooterContainer from '@/components/footer/FooterContainer.vue'
import { useI18n } from 'vue-i18n'
import { useIdentificationState } from './identityDocumentState'
import { DsfrButton, VIcon } from '@gouvminint/vue-dsfr'
import { useNextStep } from '@/components/common/lib/useNextStep'

withDefaults(defineProps<{ formId?: string; submit?: boolean; disabled?: boolean }>(), {
  formId: undefined,
  submit: true,
  disabled: false
})

const { t } = useI18n()
const { previousStep, nextStep, category } = useIdentificationState()
const { goNext } = useNextStep(category, nextStep)
</script>
