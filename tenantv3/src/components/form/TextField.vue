<template>
  <div class="fr-input-group">
    <FieldLabel :required :for-input="name">
      {{ fieldLabel }}
    </FieldLabel>
    <Field
      v-slot="{ field, meta }"
      v-model="inputValue"
      :name="name"
      :rules="validationRules"
      :validate-on-change="false"
      :validate-on-blur="true"
    >
      <input
        v-bind="field"
        :id="name"
        class="form-control fr-input"
        :class="{
          'fr-input--valid': meta.valid,
          'fr-input--error': !meta.valid
        }"
        type="text"
        :required
        :disabled="disabled"
        :autocomplete
        :aria-describedby="`${name}-errors`"
        :aria-invalid="!meta.valid"
      />
    </Field>
    <ErrorMessage v-slot="{ message }" :name="name">
      <span :id="`${name}-errors`" class="fr-error-text">{{ t(message || '') }}</span>
    </ErrorMessage>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Field, ErrorMessage } from 'vee-validate'
import FieldLabel from 'df-shared-next/src/components/form/FieldLabel.vue'
import { computed } from 'vue'

const { t } = useI18n()

const inputValue = defineModel<string>()

const props = withDefaults(
  defineProps<{
    fieldLabel: string
    name: string
    validationRules?: string
    disabled?: boolean
    autocomplete?: string
  }>(),
  {
    validationRules: '',
    disabled: false,
    autocomplete: ''
  }
)

const required = computed(() => props.validationRules.includes('required'))
</script>
