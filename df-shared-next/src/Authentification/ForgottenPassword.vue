<template>
  <section class="fr-grid-row fr-grid-row--center">
    <div class="fr-col-md-8 fr-col-lg-6">
      <h2 class="fr-h2 text-center fr-mt-7w fr-mb-5w">
        {{ t('title') }}
      </h2>
      <Form name="form" @submit="handleSubmit">
        <div class="fr-grid-row fr-grid-row--center">
          <div class="fr-col-12 fr-mb-3w">
            <div class="fr-input-group">
              <label class="fr-label" for="email">{{ t('email') }}</label>
              <Field
                name="email"
                v-model="user.email"
                v-slot="{ field, meta }"
                :rules="{
                  email: true,
                  required: true
                }"
              >
                <input
                  v-bind="field"
                  id="email"
                  class="validate-required form-control fr-input"
                  :class="{
                    'fr-input--valid': meta.valid,
                    'fr-input--error': !meta.valid
                  }"
                  :placeholder="t('placeholder')"
                  type="email"
                />
              </Field>
              <ErrorMessage name="email" v-slot="{ message }">
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
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { User } from '../models/User'
import { Form, Field, ErrorMessage, defineRule } from 'vee-validate'

defineRule('email', (value: string | null | undefined) => {
  if (!value || !value.length) {
    return true
  }
  if (!/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/.test(value)) {
    return 'email-not-valid'
  }
  return true
})

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

const emit = defineEmits<{ 'on-forgotten-password': [user: User] }>()

const { t } = useI18n()

const user = new User()

function handleSubmit() {
  emit('on-forgotten-password', user)
  user.email = ''
}
</script>

<style lang="scss">
.text-center {
  text-align: center;
}
</style>

<i18n>
{
  "en": {
    "title": "Forgotten password ?",
    "email": "Enter the email address used when creating the account (attention to case sensitivity) :",
    "submit": "Submit",
    "placeholder": "E.g. : example{'@'}example.fr",
    "email-not-valid": "Email not valid",
    "field-required": "This field is required"
  },
  "fr": {
    "title": "Mot de passe perdu ?",
    "email": "Entrez l'email utilisé lors de la création du compte (attention aux majuscules) :",
    "submit": "Valider",
    "placeholder": "Ex : exemple{'@'}exemple.fr",
    "email-not-valid": "Email non valide",
    "field-required": "Ce champ est requis"
  }
}
</i18n>
