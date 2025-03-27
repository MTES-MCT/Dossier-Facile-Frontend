<template>
  <h6>{{ t(textKey + '.title') }}</h6>
  <Form @submit="onSubmit">
    <div>
      <label class="fr-label" for="lastname">{{ t('common.last-name-label') }}</label>
      <Field
        v-slot="{ field, meta }"
        v-model.trim="lastName"
        name="lastname"
        :rules="{
          required: true
        }"
      >
        <input
          v-bind="field"
          class="validate-required form-control fr-input"
          :class="{
            'fr-input--valid': meta.valid,
            'fr-input--error': !meta.valid
          }"
          type="text"
        />
      </Field>
      <ErrorMessage v-slot="{ message }" name="lastname">
        <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
      </ErrorMessage>
    </div>
    <div class="fr-mt-1w">
      <button
        v-if="!displayPreferredNameField"
        class="fr-link fr-icon-add-line fr-link--icon-right"
        href="#"
        @click="displayPreferredNameField = true"
      >
        {{ t('common.add-prefered-name') }}
      </button>
    </div>
    <div v-if="displayPreferredNameField" class="fr-mt-3w">
      <label class="fr-label" for="preferredName">{{ t('common.preferred-name-label') }}</label>
      <div class="field-with-button fr-mt-1w">
        <div class="fr-input-wrap">
          <Field v-slot="{ field }" v-model.trim="preferredName" name="preferredName">
            <input v-bind="field" class="form-control fr-input" type="text" />
          </Field>
        </div>
        <div class="fr-ml-1w">
          <button
            class="fr-btn fr-btn--tertiary fr-icon-close-line"
            type="button"
            @click="displayPreferredNameField = false"
          >
            {{ t('common.delete-preferred-name') }}
          </button>
        </div>
      </div>
    </div>
    <div class="fr-mt-3w">
      <label class="fr-label" for="firstName">{{ t('common.first-name-label') }}</label>
      <Field
        v-slot="{ field, meta }"
        v-model.trim="firstName"
        name="firstName"
        :rules="{
          required: true
        }"
      >
        <input
          v-bind="field"
          class="validate-required form-control fr-input"
          :class="{
            'fr-input--valid': meta.valid,
            'fr-input--error': !meta.valid
          }"
          type="text"
        />
      </Field>
      <ErrorMessage v-slot="{ message }" name="firstName">
        <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
      </ErrorMessage>
    </div>
    <div class="fr-mt-3w">
      <label class="fr-label" for="postalCode">{{ t('common.postal-code-label') }}</label>
      <Field v-slot="{ field }" v-model.trim="postalCode" name="postalCode">
        <input v-bind="field" class="form-control fr-input" type="text" />
      </Field>
    </div>
    <div class="fr-mt-3w">
      <fieldset
        v-if="textKey === 'third-party'"
        id="third-party-consent"
        class="fr-fieldset"
        aria-labelledby="checkboxes-legend checkboxes-messages"
      >
        <div class="fr-fieldset__element">
          <div class="fr-checkbox-group">
            <input
              id="third-party-consent-checkbox"
              name="third-party-consent-checkbox"
              type="checkbox"
              aria-describedby="third-party-consent-checkbox-message"
            />
            <label class="fr-label" for="third-party-consent-checkbox">
              {{ t('third-party.checkbox-label', { lastName: lastName }) }}
            </label>
          </div>
        </div>
      </fieldset>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { useI18n } from 'vue-i18n'

defineProps<{
  textKey: 'self' | 'third-party'
}>()

const { t } = useI18n()

const lastName = ref('')
const firstName = ref('')
const preferredName = ref('')
const postalCode = ref('')
const displayPreferredNameField = ref(false)

const onSubmit = () => {
  console.log('submit')
}
</script>

<i18n>
{
  "en": {
    common: {
      last-name-label: "Last Name *",
      add-prefered-name: "Add a preferred name",
      preferred-name-label: "Preferred Name",
      delete-preferred-name: "Delete preferred name",
      first-name-label: "First Name *",
      postal-code-label: "Postal Code (only if you reside in France)"
    },
    self: {
      title: "Your Identity"
    },
    third-party: {
      title: "Beneficiary's Identity",
      checkbox-label: "I certify that I have obtained {lastName}'s consent to create and submit this file on their behalf. I attest that the information provided is accurate and that the documents submitted were obtained with their consent.*"
    }
  },
  "fr": {
    common: {
      last-name-label: "Nom de naissance *",
      add-prefered-name: "Ajouter un nom d'usage",
      preferred-name-label: "Nom d'usage",
      delete-preferred-name: "Supprimer le nom d'usage",
      first-name-label: "Prénom *",
      postal-code-label: "Code postal (uniquement si vous résidez en France)"
    },
    self: {
      title: "Votre identité"
    },
    third-party: {
      title: "Identité du bénéficiaire",
      checkbox-label: "Je certifie avoir obtenu l'accord de {lastName} pour constituer et soumettre ce dossier en son nom. J'atteste que les informations fournies sont exactes et que les documents transmis ont été obtenus avec son consentement.*"
    }
  }
}
</i18n>

<style scoped lang="scss">
.field-with-button {
  display: flex;
  justify-content: space-between;
}

.fr-input-wrap {
  flex-grow: 1;
}
</style>
