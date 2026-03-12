<template>
  <DsfrButton
    v-if="showBack"
    secondary
    type="button"
    :label="t('backnext.back')"
    icon="ri:arrow-left-s-line"
    @click="backAction()"
  />
  <DsfrButton
    ref="next-btn"
    data-cy="next-btn"
    :type="submit"
    :form="formId ?? null"
    :label="nextLabel ? nextLabel : t('backnext.continue')"
    :disabled
    icon="ri:check-line"
    @click="nextAction()"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, useTemplateRef } from 'vue'
import { DsfrButton } from '@gouvminint/vue-dsfr'

const { t } = useI18n()

withDefaults(
  defineProps<{
    showBack?: boolean
    disabled?: boolean
    nextLabel?: string
    formId?: string
    submit?: boolean
  }>(),
  {
    showBack: true,
    disabled: false,
    nextLabel: undefined,
    formId: undefined,
    submit: undefined
  }
)

const emit = defineEmits<{ 'on-back': []; 'on-next': [] }>()

const nextBtnRef = useTemplateRef<InstanceType<typeof DsfrButton>>('next-btn')
const btnEl = computed(() => nextBtnRef.value?.$el)

defineExpose({ btnEl })

function backAction() {
  emit('on-back')
}

function nextAction() {
  emit('on-next')
}
</script>
