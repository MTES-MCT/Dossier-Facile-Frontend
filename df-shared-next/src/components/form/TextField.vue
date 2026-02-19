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
      :validate-on-blur="false"
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
import FieldLabel from './FieldLabel.vue'
import { computed } from 'vue'

const { t } = useI18n()

const inputValue = defineModel<string>()

const props = withDefaults(
  defineProps<{
    fieldLabel: string
    name: string
    validationRules?: string
    disabled?: boolean
    autocomplete: HTMLInputElement['autocomplete']
  }>(),
  {
    validationRules: '',
    disabled: false,
    autocomplete: 'off'
  }
)

const required = computed(() => props.validationRules.includes('required'))
</script>

<i18n>
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
