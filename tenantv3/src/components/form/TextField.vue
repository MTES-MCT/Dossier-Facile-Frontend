<template>
  <div class="fr-input-group">
    <FieldLabel :required :for-input="name">
      {{ fieldLabel }}
    </FieldLabel>
    <HintText v-if="hint" :id="`${name}-hint`">{{ hint }}</HintText>
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
        :type
        :required
        :disabled
        :readonly
        :autocomplete
        :aria-describedby="describedBy"
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
import HintText from '@/components/common/HintText.vue'
import { computed } from 'vue'

const { t } = useI18n()

const inputValue = defineModel<string>()

const props = withDefaults(
  defineProps<{
    fieldLabel: string
    name: string
    type?: 'text' | 'email'
    validationRules?: string
    disabled?: boolean
    readonly?: boolean
    autocomplete?: string
    hint?: string
  }>(),
  {
    type: 'text',
    validationRules: '',
    disabled: false,
    readonly: false,
    autocomplete: 'off',
    hint: ''
  }
)

const required = computed(() => props.validationRules.includes('required'))
const describedBy = computed(() => {
  const ids = [`${props.name}-errors`]
  if (props.hint) {
    ids.unshift(`${props.name}-hint`)
  }
  return ids.join(' ')
})
</script>
