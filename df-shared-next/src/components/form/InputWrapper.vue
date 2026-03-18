<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { DsfrCheckbox, DsfrInput } from '@gouvminint/vue-dsfr'
import FieldErrors from './FieldErrors.vue'
import type { RegleFieldStatus } from '@regle/core'
import { computed } from 'vue'

const { t } = useI18n()

interface Props {
  inputName: string
  inputLabel: string
  inputType?: HTMLInputElement['type']
  autocomplete?: HTMLInputElement['autocomplete']
  inputmode?: 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search'
  required?: boolean
  field: RegleFieldStatus
}
const props = defineProps<Props>()

type TextModel = string | number | undefined
type CheckboxModel = boolean | undefined
const inputModel = defineModel<TextModel | CheckboxModel>('input-value')
// typeguard to set the type of the input
const isCheckboxModel = (value: TextModel | CheckboxModel): value is CheckboxModel => {
  return props.inputType === 'checkbox'
}

const isRequired = computed(() => {
  return props.required || (props.field?.$rules?.required?.$active ?? false)
})
</script>

<template>
  <div class="fr-input-group" :class="{ 'fr-input-group--error': field.$error }">
    <DsfrCheckbox
      v-if="isCheckboxModel(inputModel)"
      v-model="inputModel"
      :name="inputName"
      :label="inputLabel"
      value=""
    />

    <DsfrInput
      v-else
      :id="`input-${inputName}`"
      v-model="inputModel"
      :label="inputLabel"
      :name="inputName"
      label-visible
      :aria-invalid="field.$error ? true : undefined"
      :description-id="field.$error ? `errors-${inputName}` : undefined"
      :type="inputType ?? 'text'"
      :autocomplete="autocomplete ?? undefined"
      :required="isRequired"
      :inputmode
    >
      <template #required-tip>
        <span v-if="isRequired"> ({{ t('required') }})</span>
        <span v-else> ({{ t('optional') }})</span>
        <span>&nbsp;:</span></template
      >
    </DsfrInput>
    <FieldErrors v-if="field.$error" :id="`errors-${inputName}`" :errors="field.$errors" />
  </div>
</template>

<i18n lang="json">
{
  "en": {
    "required": "required",
    "optional": "optional"
  },
  "fr": {
    "required": "obligatoire",
    "optional": "facultatif"
  }
}
</i18n>
