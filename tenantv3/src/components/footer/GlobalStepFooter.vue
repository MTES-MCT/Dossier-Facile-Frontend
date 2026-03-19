<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { computed, useTemplateRef } from 'vue'
import { DsfrButton } from '@gouvminint/vue-dsfr'
import { useRouter } from 'vue-router'
import BackNext from './BackNext.vue'

const { t } = useI18n()
const router = useRouter()

interface Props {
  showBack?: boolean
  disabled?: boolean
  nextLabel?: string
  formId?: string
  backAction?: () => void
  submit?: boolean
}

const {
  showBack = true,
  disabled = false,
  nextLabel = undefined,
  formId = undefined,
  backAction = undefined,
  submit = undefined
} = defineProps<Props>()

const emit = defineEmits<{ 'on-next': []; 'on-back': [] }>()
const backNext = useTemplateRef<InstanceType<typeof BackNext>>('back-next')
defineExpose({ nextBtn: computed(() => backNext.value?.btnEl) })

function nextAction() {
  emit('on-next')
}

const handleBack = () => backAction ?? router.go(-1)
</script>

<template>
  <footer id="footer-navigation" class="footer-container fr-mt-2w">
    <DsfrButton
      ref="next-btn"
      data-cy="next-btn"
      :type="submit"
      :form="formId ?? null"
      :label="nextLabel ? nextLabel : t('backnext.continue')"
      :aria-disabled="disabled"
      icon="ri:check-line"
      @click="nextAction"
    />
    <DsfrButton
      v-if="showBack"
      secondary
      type="button"
      :label="t('backnext.back')"
      icon="ri:arrow-left-s-line"
      @click="handleBack"
    />
  </footer>
</template>

<style scoped>
.footer-container {
  padding-inline: 1rem;
  display: flex;
  flex-flow: row-reverse wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.footer-container > * {
  flex: 1 1 48%;
  justify-content: center;
}
@media screen and (width >= 48rem) {
  /* remove padding if parent element is a card */
  [class*='card'] .footer-container {
    padding: 0;
  }
  .footer-container > * {
    max-inline-size: fit-content;
  }
}
@media screen and (width < 48rem) {
  .footer-container {
    padding: 1rem;
    position: fixed;
    inset-inline-start: 0;
    inset-block-end: 0;
    inline-size: 100%;
    background-color: white;
    box-shadow:
      0 -5px 5px -2.5px rgba(0, 0, 0, 0.04),
      0 -10px 12.5px -2.5px rgba(0, 0, 0, 0.1);
    z-index: 999;
  }
}
</style>
