<script lang="ts" setup>
import type { ContactFormData } from '../../models/ContactFormData'
import type { User } from '../../models/User'
// not using dsfr components error messages because of "role=alert" and "aria-live=assertive"
import { DsfrButton, DsfrCheckbox, DsfrInput } from '@gouvminint/vue-dsfr'
import type { InvalidSubmissionContext } from 'vee-validate'
import { useForm, configure } from 'vee-validate'
import { nextTick, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import ErrorSummary from './ErrorSummary.vue'
import '../../validators/validationRules'

const { t } = useI18n()

interface Props {
  user?: User
  profile?: 'tenant' | 'owner'
}
const props = defineProps<Props>()

const emit = defineEmits<{
  'on-submit': [formData: ContactFormData]
}>()

const errorSummaryRef = useTemplateRef('errorSummaryRef')

// FORM SETUP
configure({
  bails: false,
  // only validate on submit
  validateOnBlur: false,
  validateOnChange: false,
  validateOnModelUpdate: false,
  // translate fields and errors
  generateMessage: (ctx) => {
    const ruleName = ctx.rule?.name || ''
    const params = ctx.rule?.params as any
    const value = Array.isArray(params) ? params[0] : params

    return t(`validation.${ruleName}`, {
      field: t(`fields.${ctx.field}`),
      // map 1st param to value for message interpolation
      [ruleName]: value,
      ...params
    })
  }
})

const { values, handleSubmit, defineField, errors, submitCount } = useForm({
  initialValues: {
    firstname: props.user?.firstName ?? '',
    lastname: props.user?.lastName ?? '',
    email: props.user?.email ?? '',
    profile: props.profile ?? 'tenant',
    subject: '',
    message: '',
    consent: false
  },
  validationSchema: {
    firstname: 'required',
    lastname: 'required',
    email: 'required|email',
    subject: 'required',
    message: 'required|max:2000',
    consent: 'required'
  },
  validateOnMount: false
})

const [firstname] = defineField('firstname')
const [lastname] = defineField('lastname')
const [email] = defineField('email')
const [subject] = defineField('subject')
const [message] = defineField('message')
const [consent] = defineField('consent')

// FORM DATA
type FormData = typeof values

// FORM LOGIC
const onSuccess = (values: FormData) => {
  // remove consent from sent values
  const { consent, ...contactData } = values
  emit('on-submit', contactData)
}

const onInvalidSubmit = async ({ errors }: InvalidSubmissionContext) => {
  // focus the error summary if there are errors
  if (errors) {
    if (errorSummaryRef.value) {
      await nextTick()
      errorSummaryRef.value.focusTitle()
    }
  } else
    try {
      throw new Error('Unexpected error')
    } catch (e) {
      // @ts-expect-error unknown type
      console.error(`${e.name}: ${e.message}`)
    }
}

const onSubmit = handleSubmit(onSuccess, onInvalidSubmit)
</script>

<template>
  <ErrorSummary
    v-if="submitCount > 0 && Object.entries(errors).length"
    :form-errors="errors"
    ref="errorSummaryRef"
  />
  <form novalidate @submit.prevent="onSubmit">
    <div class="fr-input-group" :class="{ 'fr-input-group--error': errors.firstname }">
      <DsfrInput
        id="input-firstname"
        v-model="firstname"
        :label="t('fields.firstname')"
        :name="t('fields.firstname')"
        label-visible
        :aria-invalid="errors.firstname ? true : undefined"
        :description-id="errors.firstname ? 'errors-firstname' : undefined"
        type="text"
        autocomplete="given-name"
        required
      >
        <template #required-tip> ({{ t('field-required') }})</template>
      </DsfrInput>
      <p v-if="errors.firstname" id="errors-firstname" class="fr-error-text">
        {{ errors.firstname }}
      </p>
    </div>
    <div class="fr-input-group" :class="{ 'fr-input-group--error': errors.lastname }">
      <DsfrInput
        id="input-lastname"
        v-model="lastname"
        :label="t('fields.lastname')"
        :name="t('fields.lastname')"
        label-visible
        :aria-invalid="errors.lastname ? true : undefined"
        :description-id="errors.lastname ? 'errors-lastname' : undefined"
        type="text"
        autocomplete="family-name"
        required
      >
        <template #required-tip> ({{ t('field-required') }})</template>
      </DsfrInput>
      <p v-if="errors.lastname" id="errors-lastname" class="fr-error-text">
        {{ errors.lastname }}
      </p>
    </div>
    <div class="fr-input-group" :class="{ 'fr-input-group--error': errors.email }">
      <DsfrInput
        id="input-email"
        v-model="email"
        :label="t('fields.email')"
        :name="t('fields.email')"
        label-visible
        :aria-invalid="errors.email ? true : undefined"
        :description-id="errors.email ? 'errors-email' : undefined"
        hint="format attendu: adresse@domaine.tld"
        type="email"
        autocomplete="email"
        required
      >
        <template #required-tip> ({{ t('field-required') }})</template>
      </DsfrInput>
      <p v-if="errors.email" id="errors-email" class="fr-error-text">
        {{ errors.email }}
      </p>
    </div>
    <div class="fr-input-group" :class="{ 'fr-input-group--error': errors.subject }">
      <DsfrInput
        id="input-subject"
        v-model="subject"
        :label="t('fields.subject')"
        :name="t('fields.subject')"
        label-visible
        :aria-invalid="errors.subject ? true : undefined"
        :description-id="errors.subject ? 'errors-subject' : undefined"
        type="text"
        autocomplete="off"
        required
      >
        <template #required-tip> ({{ t('field-required') }})</template>
      </DsfrInput>
      <p v-if="errors.subject" id="errors-subject" class="fr-error-text">
        {{ errors.subject }}
      </p>
    </div>
    <div class="fr-input-group" :class="{ 'fr-input-group--error': errors.message }">
      <label for="input-message" class="fr-label"
        >{{ t('fields.message') }} ({{ t('field-required') }})</label
      >
      <textarea
        id="input-message"
        v-model="message"
        class="form-control fr-input"
        :name="t('fields.message')"
        :aria-invalid="errors.message ? true : undefined"
        :description-id="errors.message ? 'errors-message' : 'description-message'"
        autocomplete="off"
        placeholder=""
        rows="6"
        maxlength="2000"
        required
      />
      <p>{{ message.length }}/2000</p>
      <p v-if="errors.message" id="errors-message" class="fr-error-text">
        {{ errors.message }}
      </p>
    </div>

    <div class="fr-input-group" :class="{ 'fr-input-group--error': errors.consent }">
      <DsfrCheckbox
        id="input-consent"
        v-model="consent"
        :label="t('fields.consent-label')"
        name="consent"
        value=""
        required
      >
        <template #required-tip>&nbsp;</template>
      </DsfrCheckbox>
      <p v-if="errors.consent" id="errors-consent" class="fr-error-text">
        {{ errors.consent }}
      </p>
    </div>

    <DsfrButton :label="t('fields.submit')" class="form__btn" />
  </form>
</template>

<style scoped>
textarea {
  resize: vertical;
}
.form__btn {
  display: block;
  margin-inline-start: auto;
}
</style>

<i18n lang="json">
{
  "en": {
    "field-required": "required",
    "field-optional": "optional",
    "validation": {
      "required": "{field} is required",
      "email": "Email address is incorrect. Example: john.wick{'@'}email.net",
      "max": "{field} is over {max} characters"
    },
    "fields": {
      "email": "Your email address",
      "firstname": "Your first name",
      "lastname": "Your family name",
      "subject": "The subject of your message",
      "message": "Your message",
      "consent": "Accepting our conditions",
      "consent-label": "You agree that this information may be shared with our support team and CRISP, our support tool, in order to respond to your request.",
      "submit": "Send my message"
    }
  },
  "fr": {
    "field-required": "obligatoire",
    "field-optional": "facultatif",
    "validation": {
      "required": "{field} est obligatoire",
      "email": "L'adresse email saisie est incorrecte. Exemple: francis.cabrel{'@'}email.net",
      "max": "{field} limité à {max} caractères"
    },
    "fields": {
      "email": "Votre adresse email",
      "firstname": "Votre prénom",
      "lastname": "Votre nom",
      "subject": "L'objet de votre message",
      "message": "Votre message",
      "consent": "Accepter les conditions",
      "consent-label": "Vous acceptez que ces informations soient transmises à notre équipe d'assistance et à CRISP, notre outil d'assistance, afin de répondre à votre demande.",
      "submit": "Envoyer mon message"
    }
  }
}
</i18n>
