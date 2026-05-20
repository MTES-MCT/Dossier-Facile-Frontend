<template>
  <textarea
    ref="textareaEl"
    v-bind="$attrs"
    v-model="model"
    :maxlength="max"
    :aria-describedby="describedBy"
    class="fr-input"
  />
  <p :id="counterId" class="fr-my-1w">
    {{ t('character-count', { n: model.length, max }) }}
  </p>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  max: number
  counterId: string
  extraAriaDescribedBy?: string
}>()

const model = defineModel<string>({ required: true })
const textareaEl = useTemplateRef<HTMLTextAreaElement>('textareaEl')
const { t } = useI18n()

const describedBy = computed(() =>
  props.extraAriaDescribedBy
    ? `${props.counterId} ${props.extraAriaDescribedBy}`
    : props.counterId
)

defineExpose({
  get textareaEl() {
    return textareaEl.value
  }
})
</script>

<i18n lang="json">
{
  "en": {
    "character-count": "{n}/{max} characters"
  },
  "fr": {
    "character-count": "{n}/{max} caractères"
  }
}
</i18n>
