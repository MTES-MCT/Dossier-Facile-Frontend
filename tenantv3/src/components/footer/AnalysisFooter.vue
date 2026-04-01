<template>
  <FooterContainer class="footer">
    <RouterLink :to="previousStep" class="fr-btn fr-btn--secondary">
      <RiArrowLeftSLine size="1rem" class="color--primary mobile no-shrink" aria-hidden="true" />
      <span class="desktop">{{ t('profilefooter.back') }}</span>
    </RouterLink>
    <form @submit.prevent="submit">
      <DfButton
        ref="next-btn"
        primary
        data-cy="next-btn"
        :aria-disabled="nextDisabled || undefined"
        >{{ nextLabel || t('profilefooter.continue') }}</DfButton
      >
    </form>
  </FooterContainer>
</template>

<script setup lang="ts">
import FooterContainer from '@/components/footer/FooterContainer.vue'
import { RiArrowLeftSLine } from '@remixicon/vue'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import { computed, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import type { RouteLocationRaw } from 'vue-router'

const emit = defineEmits<{ 'on-next': [] }>()

const props = defineProps<{
  previousStep: RouteLocationRaw
  nextDisabled?: boolean
  nextLabel?: string
  beforeSubmit?: () => boolean
  onSubmitAction?: () => Promise<void> | void
  onError?: (error: unknown) => void
}>()

const { t } = useI18n()
const nextBtn = useTemplateRef('next-btn')

defineExpose({ button: computed(() => nextBtn.value?.button) })

const submit = async () => {
  if (props.beforeSubmit && !props.beforeSubmit()) {
    return
  }

  try {
    await props.onSubmitAction?.()
    emit('on-next')
  } catch (error) {
    props.onError?.(error)
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

.footer :deep(button[aria-disabled='true']) {
  opacity: 0.5;
  cursor: default;
}
</style>
