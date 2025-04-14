<template>
  <div class="fr-input-group">
    <FieldLabel :required="required" :for-input="name">
      {{ fieldLabel }}
    </FieldLabel>
    <div class="field-with-button">
      <div class="fr-input-wrap">
        <Field
          v-slot="{ field, meta }"
          :name="name"
          :value="modelValue"
          :rules="getValidationRules()"
          @input="updateModel($event)"
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
          <ErrorMessage v-slot="{ message }" :name="name">
            <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
          </ErrorMessage>
        </Field>
      </div>
      <div v-if="$slots.right" class="fr-ml-1w">
        <slot name="right"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Field, ErrorMessage } from 'vee-validate'
import FieldLabel from 'df-shared-next/src/components/form/FieldLabel.vue'

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
  }>(),
  {
    validationRules: '',
    required: false,
    disabled: false
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
