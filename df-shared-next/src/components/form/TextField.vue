<template>
  <div class="fr-input-group">
    <FieldLabel :required :for-input="name" :class="{ 'fr-sr-only': visuallyHidden }">
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
        :type
        :required
        :disabled="disabled"
        :autocomplete
        :aria-describedby="`${name}-errors ${name}-hint`"
        :aria-invalid="!meta.valid"
      />
    </Field>
    <ErrorMessage v-slot="{ message }" :name="name">
      <span :id="`${name}-errors`" class="fr-error-text">{{ t(message || '') }}</span>
    </ErrorMessage>
    <div v-if="$slots.hint" :id="`${name}-hint`" :class="`${name}-hint fr-mt-1w`">
      <slot name="hint" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Field, ErrorMessage } from 'vee-validate'
import FieldLabel from './FieldLabel.vue'
import { computed } from 'vue'

const { t } = useI18n()

const inputValue = defineModel<string>()

defineSlots<{
  /**
   * Slot pour une description complémentaire du champ
   * Sera dans `<div :class="`${name}-hint`">`
   */
  hint: () => unknown
}>()

const props = withDefaults(
  defineProps<{
    fieldLabel: string
    name: string
    type?: 'text' | 'email'
    validationRules?: string
    disabled?: boolean
    autocomplete: HTMLInputElement['autocomplete']
    visuallyHidden?: boolean
  }>(),
  {
    type: 'text',
    validationRules: '',
    disabled: false,
    visuallyHidden: false
  }
)

const required = computed(() => props.validationRules.includes('required'))
</script>

<i18n lang="json">
{
  "en": {
    "strength-not-valid": "The password is too weak",
    "confirm-not-valid": "The password does not match",
    "email-not-valid": "Invalid email",
    "zipcode-not-valid": "Invalid postal code.",
    "only-alpha": "Only alphabetic characters, [ , -, '] are allowed",
    "same-email-not-valid": "The email cannot be the same as your address",
    "regex-not-valid": "Field not valid",
    "field-required": "This field is required",
    "select-is-empty": "Selection required"
  },
  "fr": {
    "strength-not-valid": "Le mot de passe est trop simple",
    "confirm-not-valid": "Le mot de passe ne correspond pas",
    "email-not-valid": "Email non valide",
    "zipcode-not-valid": "Code postal non valide.",
    "only-alpha": "Seuls les caractères alphabétiques ainsi que [ , -, '] sont autorisés",
    "same-email-not-valid": "L'email ne peut pas être la même que votre adresse",
    "regex-not-valid": "Champ non valide",
    "field-required": "Ce champ est requis",
    "select-is-empty": "Sélection requise"
  }
}
</i18n>
