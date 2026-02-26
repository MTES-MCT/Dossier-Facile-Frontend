<template>
  <h2 class="fr-h6">{{ t(textKey + '.title') }}</h2>
  <Form v-slot="{ meta }" class="fr-input-group" @submit="onSubmit">
    <TextField
      v-model.trim="lastname"
      :field-label="t('common.last-name-label')"
      name="lastname"
      autocomplete="family-name"
      validation-rules="required|onlyAlpha"
      :disabled="isInputDisabled"
    />

    <TextField
      v-model.trim="preferredname"
      :field-label="t('common.preferred-name-label')"
      name="preferredName"
      autocomplete="additional-name"
      validation-rules="onlyAlpha"
    />
    <TextField
      v-model.trim="firstname"
      :field-label="t('common.first-name-label')"
      name="firstName"
      autocomplete="given-name"
      validation-rules="required|onlyAlpha"
      :disabled="isInputDisabled"
    />

    <TextField
      v-model.trim="postalCode"
      :field-label="t(textKey + '.postal-code-label')"
      name="postalCode"
      autocomplete="postal-code"
      validation-rules="zipcode"
    />

    <div v-if="textKey === 'third-party'" class="fr-mt-3w">
      <Field
        v-model.trim="thirdPartyConsent"
        type="checkbox"
        name="thirdPartyConsent"
        :rules="{
          required: true
        }"
      >
        <DsfrCheckbox
          v-model="thirdPartyConsent"
          value=""
          name="third-party-consent-checkbox"
          :label="t('third-party.checkbox-label', { lastName: lastname, firstName: firstname })"
        />
      </Field>
    </div>
    <ProfileFooter :show-back="false" :disabled="!meta.valid" />
  </Form>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Form, Field } from 'vee-validate'
import ProfileFooter from '../footer/ProfileFooter.vue'
import { useI18n } from 'vue-i18n'
import { useTenantStore } from '@/stores/tenant-store'
import { UtilsService } from '@/services/UtilsService'
import { AnalyticsService } from '@/services/AnalyticsService'
import { router } from '@/router'
import { useLoading } from 'vue-loading-overlay'
import TextField from 'df-shared-next/src/components/form/TextField.vue'
import { DsfrCheckbox } from '@gouvminint/vue-dsfr'

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

const lastname = ref(placeHolderIdentity.lastName)
const firstname = ref(placeHolderIdentity.firstName)
const preferredname = ref(placeHolderIdentity.preferredName)

const postalCode = ref(placeHolderIdentity.postalCode)

const thirdPartyConsent = ref(
  user.value?.ownerType === 'THIRD_PARTY' && placeHolderIdentity.firstName !== ''
)

const isInputDisabled = computed(() => {
  const franceConnect = user.value?.franceConnect
  if (props.textKey === 'self') {
    return franceConnect || false
  }
  return false
})

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
