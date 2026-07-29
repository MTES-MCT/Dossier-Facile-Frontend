<template>
  <div class="fr-input-group fr-mt-2w">
    <label class="fr-label" :for="textAreaID">
        <slot name="label">
        {{ t('label') }}
      </slot>
        (<span v-if="isRequired">{{ t('required') }}</span>
        <span v-else-if="!isRequired"">{{ t('optional') }}</span>)
      </label>
    <textarea
      :id="textAreaID"
      ref="textareaEl"
      v-bind="$attrs"
      v-model="model"
      :maxlength="max"
      :aria-describedby="describedBy"
      :required="isRequired"
      class="fr-input"
    />
    <p :id="counterId" class="fr-my-1w">
      {{ t('character-count', { n: model.length, max }) }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRandomId } from '@gouvminint/vue-dsfr'

defineOptions({ inheritAttrs: false })

interface Props {
    max: number
  counterId: string
  extraAriaDescribedBy?: string
  id?: string
  isRequired?: boolean
}

const {max, counterId, extraAriaDescribedBy, id, isRequired = false} = defineProps<Props>()

const model = defineModel<string>({ required: true })
const textareaEl = useTemplateRef<HTMLTextAreaElement>('textareaEl')
const { t } = useI18n()
const textAreaID = id ?? useRandomId()

const describedBy = computed(() =>
  extraAriaDescribedBy ? `${counterId} ${extraAriaDescribedBy}` : counterId
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
    "label": "Situation explanation",
    "required": "required",
    "optional": "optional",
    "character-count": "{n}/{max} characters"
  },
  "fr": {
    "label": "Explication de la situation",
    "required": "obligatoire",
    "optional": "facultatif",
    "character-count": "{n}/{max} caractères"
  }
}
</i18n>
