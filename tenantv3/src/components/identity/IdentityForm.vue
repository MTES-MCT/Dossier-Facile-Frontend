<template>
  <h2 class="fr-h6">{{ t(textKey + '.title') }}</h2>
  <Form v-slot="{ meta }" @submit="onSubmit">
    <div>
      <label class="fr-label" for="lastname">{{ t('common.last-name-label') }}</label>
      <Field
        v-slot="{ field }"
        v-model.trim="lastname"
        name="lastname"
        :rules="{
          required: true
        }"
      >
        <input
          v-bind="field"
          id="lastname"
          class="validate-required form-control fr-input"
          :class="{
            'fr-input--valid': meta.valid,
            'fr-input--error': !meta.valid
          }"
          :disabled="isInputDisabled"
          type="text"
        />
      </Field>
      <ErrorMessage v-slot="{ message }" name="lastname">
        <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
      </ErrorMessage>
    </div>
    <div class="fr-mt-1w">
      <button
        v-if="!displayPreferrednameField"
        class="fr-link fr-icon-add-line fr-link--icon-right"
        href="#"
        @click="displayPreferrednameField = true"
      >
        {{ t('common.add-prefered-name') }}
      </button>
    </div>
    <div v-if="displayPreferrednameField" class="fr-mt-3w">
      <label class="fr-label" for="preferredName">{{ t('common.preferred-name-label') }}</label>
      <div class="field-with-button fr-mt-1w">
        <div class="fr-input-wrap">
          <Field v-slot="{ field }" v-model.trim="preferredname" name="preferredName">
            <input v-bind="field" id="preferredName" class="form-control fr-input" type="text" />
          </Field>
        </div>
        <div class="fr-ml-1w">
          <button
            class="fr-btn fr-btn--tertiary fr-icon-close-line"
            type="button"
            @click="onDeletePreferredName"
          >
            {{ t('common.delete-preferred-name') }}
          </button>
        </div>
      </div>
    </div>
    <div class="fr-mt-3w">
      <label class="fr-label" for="firstname">{{ t('common.first-name-label') }}</label>
      <Field
        v-slot="{ field }"
        v-model.trim="firstname"
        name="firstName"
        :rules="{
          required: true
        }"
      >
        <input
          v-bind="field"
          id="firstname"
          class="validate-required form-control fr-input"
          :class="{
            'fr-input--valid': meta.valid,
            'fr-input--error': !meta.valid
          }"
          :disabled="isInputDisabled"
          type="text"
        />
      </Field>
      <ErrorMessage v-slot="{ message }" name="firstName">
        <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
      </ErrorMessage>
    </div>
    <div class="fr-mt-3w">
      <label class="fr-label" for="postalCode">{{ t(textKey + '.postal-code-label') }}</label>
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
        <Field
          v-model.trim="thirdPartyConsent"
          type="checkbox"
          name="thirdPartyConsent"
          :rules="{
            required: true
          }"
        >
          <div class="fr-fieldset__element">
            <div class="fr-checkbox-group">
              <input
                id="third-party-consent-checkbox"
                name="third-party-consent-checkbox"
                type="checkbox"
                aria-describedby="third-party-consent-checkbox-message"
                @change="onCheckboxChange"
              />
              <label class="fr-label" for="third-party-consent-checkbox">
                {{ t('third-party.checkbox-label', { lastName: lastname, firstName: firstname }) }}
              </label>
            </div>
          </div>
        </Field>
      </fieldset>
    </div>
    <ProfileFooter :show-back="false" :disabled="!meta.valid"></ProfileFooter>
  </Form>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import ProfileFooter from '../footer/ProfileFooter.vue'
import { useI18n } from 'vue-i18n'
import { useTenantStore } from '@/stores/tenant-store'
import { UtilsService } from '@/services/UtilsService'
import { AnalyticsService } from '@/services/AnalyticsService'
import { router } from '@/router'
import { useLoading } from 'vue-loading-overlay'

const props = defineProps<{
  textKey: 'self' | 'third-party'
}>()

const $loading = useLoading({})
const { t } = useI18n()
const store = useTenantStore()

const user = computed(() => store.user)

const placeHolderIdentity = {
  lastName: user.value?.lastName || '',
  firstName: user.value?.firstName || '',
  preferredName: UtilsService.capitalize(user.value?.preferredName || ''),
  postalCode: user.value?.zipCode || ''
}

// If we show the form for self identity and the user is france connected we have to set the form
if (props.textKey === 'self' && user.value?.franceConnectIdentity) {
  placeHolderIdentity.lastName = user.value.franceConnectIdentity.lastName
  placeHolderIdentity.firstName = user.value.franceConnectIdentity.firstName
  placeHolderIdentity.preferredName = user.value.franceConnectIdentity.preferredName || ''
}

// If we show the form for third party but before we have the self identity we remove all data from the form
if (props.textKey === 'third-party' && user.value?.ownerType === 'SELF') {
  placeHolderIdentity.lastName = ''
  placeHolderIdentity.firstName = ''
  placeHolderIdentity.preferredName = ''
  placeHolderIdentity.postalCode = ''
}

// If we show the form for self identity but before we have third party identity we remove all data from the form
if (
  props.textKey === 'self' &&
  user.value?.ownerType === 'THIRD_PARTY' &&
  !user.value.franceConnect
) {
  placeHolderIdentity.lastName = ''
  placeHolderIdentity.firstName = ''
  placeHolderIdentity.preferredName = ''
  placeHolderIdentity.postalCode = ''
}

const lastname = ref(placeHolderIdentity.lastName)
const firstname = ref(placeHolderIdentity.firstName)
const preferredname = ref(placeHolderIdentity.preferredName)

const postalCode = ref(placeHolderIdentity.postalCode)

const thirdPartyConsent = ref(false)
const displayPreferrednameField = ref(false)

const isInputDisabled = computed(() => {
  const franceConnect = user.value?.franceConnect
  if (props.textKey === 'self') {
    return franceConnect || false
  }
  return false
})

const onCheckboxChange = () => {
  thirdPartyConsent.value = !thirdPartyConsent.value
}

const onDeletePreferredName = () => {
  preferredname.value = ''
  displayPreferrednameField.value = false
}

const onSubmit = () => {
  if (!lastname.value || !firstname.value) {
    return
  }
  const loader = $loading.show()

  store.user.firstName = firstname.value
  store.user.lastName = lastname.value
  store.user.preferredName = preferredname.value
  store.user.zipCode = postalCode.value
  if (props.textKey === 'self') {
    store.user.ownerType = 'SELF'
  } else {
    store.user.ownerType = 'THIRD_PARTY'
  }

  store
    .setNames(user.value)
    .then(
      () => {
        AnalyticsService.confirmName()
        router.push({ name: 'TenantType' })
      },
      (error) => {
        console.dir(error)
      }
    )
    .finally(() => {
      loader.hide()
    })
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
    },
    self: {
      title: "Your Identity",
      postal-code-label: "Postal Code (only if you reside in France)"
    },
    third-party: {
      title: "Beneficiary's Identity",
      checkbox-label: "I certify that I have obtained {lastName}'s consent to create and submit this file on their behalf. I attest that the information provided is accurate and that the documents submitted were obtained with their consent.*",
      postal-code-label: "Postal Code (only if he reside in France)"
    }
  },
  "fr": {
    common: {
      last-name-label: "Nom de naissance *",
      add-prefered-name: "Ajouter un nom d'usage",
      preferred-name-label: "Nom d'usage",
      delete-preferred-name: "Supprimer le nom d'usage",
      first-name-label: "Prénom *",
    },
    self: {
      title: "Votre identité",
      postal-code-label: "Code postal (uniquement si vous résidez en France)"
    },
    third-party: {
      title: "Identité du bénéficiaire",
      checkbox-label: "Je certifie avoir obtenu l'accord de {lastName} {firstName} pour constituer et soumettre ce dossier en son nom. J'atteste que les informations fournies sont exactes et que les documents transmis ont été obtenus avec son consentement.*",
      postal-code-label: "Code postal (uniquement si il réside en France)"
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
