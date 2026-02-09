<script lang="ts" setup>
import type { ContactFormData } from '../../models/ContactFormData'
import type { User } from '../../models/User'
import { DsfrButton, DsfrCheckbox, DsfrInput } from '@gouvminint/vue-dsfr'
import { defineRegleConfig } from '@regle/core'
import { required, email, maxLength, checked, withMessage } from '@regle/rules'
import { useI18n } from 'vue-i18n'
import ErrorSummary from './ErrorSummary.vue'
import { nextTick, ref, useTemplateRef } from 'vue'
import FieldErrors from './FieldErrors.vue'

interface Props {
  user?: User
  profile?: 'tenant' | 'owner'
}
const props = defineProps<Props>()

const emit = defineEmits<{
  'on-submit': [formData: ContactFormData]
}>()

const { t } = useI18n()

const errorSummary = useTemplateRef('errorSummary')
const hasSubmitted = ref(false)

const { useRegle: useCustomRegle } = defineRegleConfig({
  rules: () => ({
    required: withMessage(required, t('validation.required')),
    email: withMessage(email, t('validation.emailValidation')),
    checked: withMessage(email, t('validation.consent'))
  })
})

// FORM SETUP
const { r$ } = useCustomRegle(
  // initial values
  {
    firstname: props.user?.firstName ?? '',
    lastname: props.user?.lastName ?? '',
    email: props.user?.email ?? '',
    profile: props.profile ?? 'tenant',
    subject: '',
    message: '',
    consent: false
  },
  // validation rules
  {
    firstname: { required },
    lastname: { required },
    email: { required, email },
    profile: { required },
    subject: { required },
    message: { required, minLength: maxLength(2) },
    consent: { checked, $rewardEarly: true }
  }
)

// FORM LOGIC
const onSubmit = async () => {
  hasSubmitted.value = true
  const { valid, data } = await r$.$validate()

  if (valid) {
    // remove consent from sent values
    const { consent, ...contactData } = data
    emit('on-submit', contactData)
  } else if (r$.$errors) {
    // focus the error summary if there are errors
    const errorSummaryTitle = errorSummary.value?.$el.querySelector('#error-summary-title')

    if (errorSummaryTitle) {
      await nextTick()
      errorSummaryTitle.focus()
    }
  } else
    try {
      throw new Error('Unexpected error')
    } catch (e) {
      console.error(`${e.name}: ${e.message}`)
    }
}
</script>

<template>
  <ErrorSummary v-if="hasSubmitted && r$.$errors" :form-errors="r$.$errors" ref="errorSummary" />
  <form novalidate @submit.prevent="onSubmit">
    <div class="fr-input-group" :class="{ 'fr-input-group--error': r$.firstname.$error }">
      <DsfrInput
        id="input-firstname"
        v-model="r$.$value.firstname"
        :label="t('fields.firstname')"
        :name="t('fields.firstname')"
        label-visible
        :aria-invalid="r$.firstname.$error ? true : undefined"
        :description-id="r$.firstname.$error ? 'errors-firstname' : undefined"
        type="text"
        autocomplete="given-name"
        required
      >
        <template #required-tip> ({{ t('field-required') }})</template>
      </DsfrInput>
      <FieldErrors
        v-if="r$.firstname.$error"
        :errors="r$.firstname.$errors"
        id="errors-firstname"
      />
    </div>
    <div class="fr-input-group" :class="{ 'fr-input-group--error': r$.lastname.$error }">
      <DsfrInput
        id="input-lastname"
        v-model="r$.$value.lastname"
        :label="t('fields.lastname')"
        :name="t('fields.lastname')"
        label-visible
        :aria-invalid="r$.lastname.$error ? true : undefined"
        :description-id="r$.lastname.$error ? 'errors-lastname' : undefined"
        type="text"
        autocomplete="family-name"
        required
      >
        <template #required-tip> ({{ t('field-required') }})</template>
      </DsfrInput>
      <FieldErrors v-if="r$.lastname.$error" :errors="r$.lastname.$errors" id="errors-lastname" />
    </div>
    <div class="fr-input-group" :class="{ 'fr-input-group--error': r$.email.$error }">
      <DsfrInput
        id="input-email"
        v-model="r$.$value.email"
        :label="t('fields.email')"
        :name="t('fields.email')"
        label-visible
        :aria-invalid="r$.email.$error ? true : undefined"
        :description-id="r$.email.$error ? 'errors-email' : undefined"
        type="email"
        autocomplete="email"
        required
      >
        <template #required-tip> ({{ t('field-required') }})</template>
      </DsfrInput>
      <FieldErrors v-if="r$.email.$error" :errors="r$.email.$errors" id="errors-email" />
    </div>
    <div class="fr-input-group" :class="{ 'fr-input-group--error': r$.subject.$error }">
      <DsfrInput
        id="input-subject"
        v-model="r$.$value.subject"
        :label="t('fields.subject')"
        :name="t('fields.subject')"
        label-visible
        :aria-invalid="r$.subject.$error ? true : undefined"
        :description-id="r$.subject.$error ? 'errors-subject' : undefined"
        type="texxt"
        required
      >
        <template #required-tip> ({{ t('field-required') }})</template>
      </DsfrInput>
      <FieldErrors v-if="r$.subject.$error" :errors="r$.subject.$errors" id="errors-subject" />
    </div>

    <div class="fr-input-group" :class="{ 'fr-input-group--error': r$.message.$error }">
      <label for="input-message" class="fr-label"
        >{{ t('fields.message') }} ({{ t('field-required') }})</label
      >
      <textarea
        id="input-message"
        v-model="r$.$value.message"
        class="form-control fr-input"
        :name="t('fields.message')"
        :aria-invalid="r$.message.$error ? true : undefined"
        :description-id="r$.message.$error ? 'errors-message' : 'description-message'"
        autocomplete="off"
        placeholder=""
        rows="6"
        maxlength="2000"
        required
      />
      <p>{{ r$.message.$value?.length }} /2000</p>
      <FieldErrors v-if="r$.message.$error" :errors="r$.message.$errors" id="errors-message" />
    </div>

    <div class="fr-input-group" :class="{ 'fr-input-group--error': r$.consent.$error }">
      <DsfrCheckbox
        id="input-consent"
        v-model="r$.$value.consent"
        :label="t('fields.consent')"
        name="consent"
        value=""
        required
      >
        <template #required-tip>&nbsp;</template>
      </DsfrCheckbox>
      <FieldErrors v-if="r$.consent.$error" :errors="r$.consent.$errors" id="errors-consent" />
    </div>
    <DsfrButton label="Envoyer mon message" />
  </form>
</template>

<style scoped>
textarea {
  resize: vertical;
}
</style>

<i18n>
{
  "en": {
		"field-required": "required",
		"field-optional": "optional",
		"validation": {
			"required": "This field is required",
			"emailValidation": "Email address is malformatted",
			"max": "{field} is over {max} characters",
			"consent": "Please accept our conditions"
		},
		"fields": {
			"email": "Your email address",
			"firstname": "Your first name",
			"lastname": "Your family name",
			"subject": "The subject of your message",
			"message": "Your message",
			"consent": "You agree that this information may be shared with our support team and CRISP, our support tool, in order to respond to your request.",
    },
  },
  "fr": {
		"field-required": "obligatoire",
		"field-optional": "facultatif",
		"validation": {
			"required": "Ce champ est obligatoire",
			"emailValidation": "L'adresse saisie est malformée",
			"max": "{field} limité à {max} caractères",
			"consent": "Veuillez accepter les conditions"
		},
		"fields": {
			"email": "Votre adresse email",
			"firstname": "Votre prénom",
			"lastname": "Votre nom",
			"subject": "L'objet de votre message",
			"message": "Votre message",
			"consent": "Vous acceptez que ces informations soient transmises à notre équipe d'assistance et à CRISP, notre outil d'assistance, afin de répondre à votre demande.",
    },
  }
}
</i18n>
