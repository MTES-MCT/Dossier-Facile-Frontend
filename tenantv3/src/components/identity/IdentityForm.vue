<template>
  <h2 class="fr-h6">{{ t(textKey + '.title') }}</h2>
  <DsfrAlert
    v-if="isInputDisabled"
    id="form-description"
    small
    :description="t('self.france-connected')"
  />
  <form novalidate @submit.prevent="onSubmit">
    <InputWrapper
      v-model:input-value="r$.$value.lastName"
      input-name="lastName"
      :input-label="t('common.last-name-label')"
      :field="r$.lastName"
      autocomplete="family-name"
    />
    <InputWrapper
      v-model:input-value="r$.$value.preferredName"
      input-name="preferredName"
      :input-label="t('common.preferred-name-label')"
      :field="r$.preferredName"
      autocomplete="new-password"
    />
    <InputWrapper
      v-model:input-value="r$.$value.firstName"
      input-name="firstName"
      :input-label="t('common.first-name-label')"
      :field="r$.firstName"
      autocomplete="given-name"
    />
    <InputWrapper
      v-model:input-value="r$.$value.postalCode"
      input-name="postalCode"
      :input-label="t(textKey + '.postal-code-label')"
      :field="r$.postalCode"
      autocomplete="postal-code"
      inputmode="numeric"
    />
    <InputWrapper
      v-if="needConsent"
      v-model:input-value="r$.$value.thirdPartyConsent"
      input-name="thirdPartyConsent"
      :input-label="
        t('third-party.checkbox-label', {
          lastName: r$.$value.lastName,
          firstName: r$.$value.firstName
        })
      "
      :field="r$.thirdPartyConsent"
    />
    <GlobalStepFooter :disabled="r$.$invalid" />
  </form>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRegle } from '@regle/core'
import { required, requiredIf } from '@regle/rules'
import { useCustomRules } from 'df-shared-next/src/validators/validationRules'
import { useI18n } from 'vue-i18n'
import { useTenantStore } from '@/stores/tenant-store'
import { AnalyticsService } from '@/services/AnalyticsService'
import { router } from '@/router'
import { useLoading } from 'vue-loading-overlay'
import { DsfrAlert } from '@gouvminint/vue-dsfr'
import GlobalStepFooter from '../footer/GlobalStepFooter.vue'
import InputWrapper from 'df-shared-next/src/components/form/InputWrapper.vue'
import { useTrimValues } from '@/composables/useTrimValues'

const props = defineProps<{
  textKey: 'self' | 'third-party'
}>()

const $loading = useLoading({})
const { t } = useI18n()
const { trimValues } = useTrimValues()
const store = useTenantStore()
const user = computed(() => store.user)

const needConsent = computed(() => props.textKey === 'third-party')

const { frenchPostalCode, nameFormat } = useCustomRules()

// Define form fields with initial values
const placeHolderIdentity = {
  lastName: user.value?.lastName || '',
  firstName: user.value?.firstName || '',
  preferredName: user.value?.preferredName || '',
  postalCode: user.value?.zipCode || '',
  thirdPartyConsent: false
}
// Create form with validation rules for the fields
const { r$ } = useRegle(placeHolderIdentity, {
  lastName: { required, nameFormat },
  preferredName: { nameFormat },
  firstName: { required, nameFormat },
  postalCode: { frenchPostalCode },
  thirdPartyConsent: { required: requiredIf(needConsent.value) }
})

// If we show the form for self identity and the user is france connected we have to set the form
if (props.textKey === 'self' && user.value?.franceConnectIdentity) {
  placeHolderIdentity.lastName = user.value.franceConnectIdentity.lastName
  placeHolderIdentity.firstName = user.value.franceConnectIdentity.firstName
  placeHolderIdentity.preferredName = user.value.franceConnectIdentity.preferredName || ''
}

if (
  // If we show the form for third party but before we have the self identity we remove all data from the form
  (props.textKey === 'third-party' && user.value?.ownerType === 'SELF') ||
  // If we show the form for self identity but before we have third party identity we remove all data from the form
  (props.textKey === 'self' &&
    user.value?.ownerType === 'THIRD_PARTY' &&
    !user.value.franceConnect) ||
  // If for the first time we show the form for third party identity we remove the data
  (props.textKey === 'third-party' && user.value?.ownerType === undefined)
) {
  placeHolderIdentity.lastName = ''
  placeHolderIdentity.firstName = ''
  placeHolderIdentity.preferredName = ''
  placeHolderIdentity.postalCode = ''
}

const isInputDisabled = computed(() => {
  const franceConnect = user.value?.franceConnect
  if (props.textKey === 'self') {
    return franceConnect || false
  }
  return false
})

const onSubmit = async () => {
  // trim the values before validation
  trimValues(r$.$value)

  const { valid, data } = await r$.$validate()

  if (!valid) return

  const loader = $loading.show()

  store.user.firstName = data.firstName
  store.user.lastName = data.lastName
  store.user.preferredName = data.preferredName
  store.user.zipCode = data.postalCode

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

<i18n lang="json">
{
  "en": {
    "common": {
      "last-name-label": "Last Name",
      "add-prefered-name": "Add a preferred name",
      "preferred-name-label": "Preferred Name",
      "delete-preferred-name": "Delete preferred name",
      "first-name-label": "First Name"
    },
    "self": {
      "title": "Your Identity",
      "france-connected": "You cannot change your identity while connected with France Connect.",
      "postal-code-label": "Postal Code (only if you reside in France)"
    },
    "third-party": {
      "title": "Beneficiary's Identity",
      "checkbox-label": "I certify that I have obtained {lastName}'s consent to create and submit this file on their behalf. I attest that the information provided is accurate and that the documents submitted were obtained with their consent.",
      "postal-code-label": "Postal Code (only if he reside in France)"
    }
  },
  "fr": {
    "common": {
      "last-name-label": "Nom de naissance",
      "add-prefered-name": "Ajouter un nom d'usage",
      "preferred-name-label": "Nom d'usage",
      "delete-preferred-name": "Supprimer le nom d'usage",
      "first-name-label": "Prénom"
    },
    "self": {
      "title": "Votre identité",
      "france-connected": "Vous ne pouvez pas modifier votre identité en étant connecté via France Connect.",
      "postal-code-label": "Code postal (uniquement si vous résidez en France)"
    },
    "third-party": {
      "title": "Identité du bénéficiaire",
      "checkbox-label": "Je certifie avoir obtenu l'accord de {lastName} {firstName} pour constituer et soumettre ce dossier en son nom. J'atteste que les informations fournies sont exactes et que les documents transmis ont été obtenus avec son consentement.",
      "postal-code-label": "Code postal (uniquement si il réside en France)"
    }
  }
}
</i18n>
