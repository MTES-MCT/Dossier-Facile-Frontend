<template>
  <div class="fr-grid-row fr-grid-row--center">
    <div class="fr-col-md-8 fr-col-lg-6">
      <Form name="form" @submit="handleRegister">
        <div class="fr-grid-row fr-grid-row--center">
          <div class="fr-col-12 fr-mb-3w">
            <Field
              v-slot="{ field, meta }"
              v-model="password"
              name="password"
              :rules="`required|strength:${score}`"
            >
              <label class="fr-label" for="password">{{ t('password') }}</label>
              <input
                id="password"
                :placeholder="t('example-prefix') + passwordExample"
                type="password"
                v-bind="field"
                name="password"
                class="validate-required form-control fr-input"
                :class="{
                  'fr-input--valid': meta.valid,
                  'fr-input--error': !meta.valid
                }"
                autocomplete="username"
                required
              />
              <PasswordMeter :password="password || ''" @score="setScore" />
            </Field>
            <ErrorMessage v-slot="{ message }" name="password">
              <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
            </ErrorMessage>
          </div>
          <div class="fr-col-12 fr-mb-3w">
            <Field
              v-slot="{ field, meta }"
              v-model="confirm"
              name="confirm-password"
              :rules="{
                required: true,
                confirm: [password, confirm]
              }"
            >
              <div class="fr-input-group">
                <label class="fr-label" for="confirm-password"> {{ t('confirm-password') }}</label>
                <input
                  id="confirm-password"
                  type="password"
                  v-bind="field"
                  name="confirm-password"
                  class="validate-required form-control fr-input"
                  :class="{
                    'fr-input--valid': meta.valid,
                    'fr-input--error': !meta.valid
                  }"
                  autocomplete="username"
                  required
                />
                <ErrorMessage v-slot="{ message }" name="confirm-password">
                  <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
                </ErrorMessage>
              </div>
            </Field>
          </div>

          <div class="fr-col-12 text-center fr-mb-5w">
            <button :disabled="isDisabled" class="fr-btn" type="submit">
              {{ t('submit') }}
            </button>
          </div>
        </div>
      </Form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PasswordMeter from '../components/PasswordMeter/PasswordMeter.vue'
import { Form, Field, ErrorMessage, defineRule } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import { generatePasswordPlaceholder } from '../services/UtilsService'
import '../validators/validationRules'

withDefaults(defineProps<{ isDisabled?: boolean }>(), { isDisabled: false })

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

const emit = defineEmits<{ 'on-init-password': [password: string] }>()

const score = ref(0)

const password = ref('')
const confirm = ref('')

const { t } = useI18n()

const passwordExample = generatePasswordPlaceholder()

function handleRegister() {
  emit('on-init-password', password.value)
}

function setScore(s: number) {
  score.value = s
}
</script>

<i18n>
{
  "en": {
    "password": "Password",
    "confirm-password": "Confirm password :",
    "confirm": "Confirm password",
    "password-not-confirmed": "Password not confirmed",
    "pwd-not-complex": "Password not secure enough",
    "field-required": "This field is required",
    "submit": "Submit"
  },
  "fr": {
    "password": "Mot de passe",
    "confirm-password": "Confirmation du mot de passe :",
    "confirm": "Confirmation du mot de passe",
    "password-not-confirmed": "Le mot de passe ne correspond pas",
    "pwd-not-complex": "Mot de passe trop simple",
    "field-required": "Ce champ est requis",
    "submit": "Valider"
  }
}
</i18n>
