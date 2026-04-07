<template>
  <FooterContainer class="financial-footer">
    <RouterLink :to="previousStep" class="fr-btn fr-btn--secondary">
      <VIcon icon="ri:arrow-left-s-line" />
      <span class="desktop">{{ t('profilefooter.back') }}</span>
    </RouterLink>

    <DsfrButton
      data-cy="next-btn"
      :type="submit ? 'submit' : 'button'"
      :form="formId ?? null"
      :label="t('profilefooter.continue')"
      :disabled
      icon="ri:check-line"
    />
  </FooterContainer>
</template>

<script setup lang="ts">
import FooterContainer from '@/components/footer/FooterContainer.vue'
import { DsfrButton, VIcon } from '@gouvminint/vue-dsfr'
import { useI18n } from 'vue-i18n'
import type { RouteLocationRaw } from 'vue-router'

withDefaults(
  defineProps<{
    previousStep: RouteLocationRaw
    disabled?: boolean
    submit?: boolean
    formId?: string
  }>(),
  { disabled: false, formId: undefined, submit: true }
)

const { t } = useI18n()
</script>
