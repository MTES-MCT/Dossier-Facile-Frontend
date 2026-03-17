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
      v-if="showBack"
      secondary
      type="button"
      :label="t('backnext.back')"
      icon="ri:arrow-left-s-line"
      @click="handleBack"
    />
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
  </footer>
</template>

<style scoped>
.footer-container {
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.footer-container > * {
  flex: 1 1 48%;
  justify-content: center;
}
@media screen and (width >= 48rem) {
  .footer-container > * {
    max-inline-size: fit-content;
  }
}
</style>
