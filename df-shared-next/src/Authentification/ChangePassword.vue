<template>
  <div class="fr-grid-row fr-grid-row--center">
    <div class="fr-col-md-8 fr-col-lg-6">
      <h2 class="fr-h2 text-center fr-mt-7w fr-mb-5w">
        {{ t('title') }}
      </h2>
      <Form @submit="handleRegister">
        <div class="fr-grid-row fr-grid-row--center">
          <div class="fr-col-12 fr-mb-3w">
            <div class="fr-input-group">
              <label class="fr-label" for="password">{{ t('password') }}</label>
              <Field
                v-slot="{ field, meta }"
                v-model="password"
                name="password"
                :rules="{ required: true, strength: score }"
              >
                <input
                  v-bind="field"
                  id="password"
                  class="form-control validate-required fr-input"
                  :class="{
                    'fr-input--valid': meta.valid,
                    'fr-input--error': !meta.valid
                  }"
                  placeholder="DF-DC520!x"
                  type="password"
                  autocomplete="new-password"
                />
              </Field>
              <PasswordMeter :password="password || ''" @score="setScore" />
              <ErrorMessage v-slot="{ message }" name="password">
                <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
              </ErrorMessage>
            </div>
          </div>
          <div class="fr-col-12 fr-mb-3w">
            <div class="fr-input-group">
              <label class="fr-label" for="confirm-password"> {{ t('confirm-password') }}</label>
              <Field
                v-slot="{ field, meta }"
                v-model="confirm"
                name="confirm-password"
                :rules="{
                  required: true,
                  confirm: [password, confirm]
                }"
              >
                <input
                  v-bind="field"
                  id="confirm-password"
                  class="validate-required form-control fr-input"
                  :class="{
                    'fr-input--valid': meta.valid,
                    'fr-input--error': !meta.valid
                  }"
                  type="password"
                  autocomplete="new-password"
                />
              </Field>
              <ErrorMessage v-slot="{ message }" name="confirm-password">
                <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
              </ErrorMessage>
            </div>
          </div>

          <div class="fr-col-12 text-center fr-mb-5w">
            <button class="fr-btn" type="submit">
              {{ t('submit') }}
            </button>
          </div>
        </div>
      </Form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Form, Field, ErrorMessage, defineRule } from 'vee-validate'
import PasswordMeter from '../components/PasswordMeter/PasswordMeter.vue'
import { ref } from 'vue'

defineRule('required', (value: unknown) => {
  if (typeof value === 'number') {
    if (!value) {
      return 'field-required'
    }
    return true
  }
  if (!value || (Array.isArray(value) && !value.length)) {
    return 'field-required'
  }
  return true
})

defineRule('strength', (_value: unknown, [score]: number[]) => {
  if (score < 2) {
    return 'strength-not-valid'
  }
  return true
})

defineRule('confirm', (_value: unknown, [password, confirm]: string[]) => {
  if (password !== confirm) {
    return 'confirm-not-valid'
  }
  return true
})

const emit = defineEmits<{ 'on-change-password': [password: string] }>()
const { t } = useI18n()

const password = ref('')
const confirm = ref('')
const score = ref(0)

function handleRegister() {
  emit('on-change-password', password.value)
}

function setScore(s: number) {
  score.value = s
}
</script>

<i18n>
{
  "en": {
    "title": "Password update",
    "password": "Password",
    "confirm-password": "Confirm password :",
    "confirm": "Confirm password",
    "password-not-confirmed": "Password not confirmed",
    "field-required": "This field is required",
    "submit": "Submit",
    "strength-not-valid": "Password is too easy",
    "confirm-not-valid": "Password not valid"
  },
  "fr": {
    "title": "Modification du mot de passe",
    "password": "Nouveau mot de passe",
    "confirm-password": "Confirmation du mot de passe :",
    "confirm": "Confirmation du mot de passe",
    "password-not-confirmed": "Le mot de passe ne correspond pas",
    "field-required": "Ce champ est requis",
    "submit": "Valider",
    "strength-not-valid": "Le mot de passe est trop simple",
    "confirm-not-valid": "Le mot de passe ne correspond pas"
  }
}
</i18n>
