<template>
  <div class="fr-input-group">
    <FieldLabel :required="required" :for-input="name">
      {{ fieldLabel }}
    </FieldLabel>
    <div class="field-with-button">
      <div class="fr-input-wrap">
        <Field
          v-if="!textarea"
          :name="name"
          :value="modelValue"
          @input="updateModel($event)"
          v-slot="{ field, meta }"
          :rules="getValidationRules()"
        >
          <input
            v-bind="field"
            :id="name"
            class="validate-required form-control fr-input"
            :class="{
              'fr-input--valid': meta.valid,
              'fr-input--error': !meta.valid
            }"
            type="text"
            :disabled="disabled"
          />
          <ErrorMessage :name="name" v-slot="{ message }">
            <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
          </ErrorMessage>
        </Field>
        <Field
          v-else
          :name="name"
          :value="modelValue"
          @input="updateModel($event)"
          v-slot="{ field, meta }"
          :rules="{
            required: true
          }"
        >
          <textarea
            v-bind="field"
            :id="name"
            type="text"
            :value="modelValue"
            class="validate-required form-control fr-input"
            :class="{
              'fr-input--valid': meta.valid,
              'fr-input--error': !meta.valid
            }"
            :disabled="disabled"
            maxlength="2000"
            rows="4"
          />
          <ErrorMessage :name="name" v-slot="{ message }">
            <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
          </ErrorMessage>
        </Field>
      </div>
      <div class="fr-ml-1w" v-if="$slots.right">
        <slot name="right"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import FieldLabel from './FieldLabel.vue'
import { Field, ErrorMessage } from 'vee-validate'

const { t } = useI18n()

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const props = withDefaults(
  defineProps<{
    modelValue: string
    fieldLabel: string
    name: string
    validationRules?: string
    required?: boolean
    disabled?: boolean
    textarea?: boolean
  }>(),
  {
    validationRules: '',
    required: false,
    disabled: false,
    textarea: false
  }
)

function getValidationRules(): string {
  const requiredRule = 'required'
  if (props.required && !props.validationRules.includes(requiredRule)) {
    return [props.validationRules, requiredRule].filter((rule) => rule !== '').join('|')
  }
  return props.validationRules
}

function updateModel(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<style scoped lang="scss">
.field-with-button {
  display: flex;
  justify-content: space-between;
}

.fr-input-wrap {
  flex-grow: 1;
}
</style>
