<template>
  <section class="fr-background-default--grey fr-p-2w fr-p-md-4w">
    <h1>
      {{ t('title') }}
    </h1>
    <div class="fr-callout">
      <h2 class="fr-callout__title">Vous avez besoin de renseignements ?</h2>
      <p class="fr-callout__text">Notre aide en ligne rassemble de nombreuses informations :</p>
      <ul class="fr-callout__text">
        <li>
          de la documentation, comme
          <a
            href="https://aide.dossierfacile.logement.gouv.fr/fr/article/liste-des-documents-a-fournir-scnv25/"
            title="Liste des documents à fournir - Ouvre une nouvelle fenêtre"
            rel="noopener"
            target="_blank"
            >la liste des documents à fournir</a
          >
          pour créer un DossierFacile
        </li>
        <li>
          des tutoriels : comment créer un
          <a
            href="https://aide.dossierfacile.logement.gouv.fr/fr/article/comment-constituer-un-dossier-de-location-en-couple-26ajqi/"
            title="Comment constituer un dossier de location en couple - Ouvre une nouvelle fenêtre"
            rel="noopener"
            target="_blank"
            >DossierFacile en couple ?</a
          >
          Comment créer un
          <a
            href="https://aide.dossierfacile.logement.gouv.fr/fr/article/comment-constituer-un-dossier-de-location-en-famille-ou-entre-amies-ow7uhc/"
            title="Comment constituer un dossier de location en colocation - Ouvre une nouvelle fenêtre"
            rel="noopener"
            target="_blank"
            >DossierFacile en colocation ?</a
          >
        </li>
        <li>
          des informations plus générales, à propos de la
          <a
            href="https://aide.dossierfacile.logement.gouv.fr/fr/article/gestion-des-donnees-et-securite-new-1d3d36d/"
            title="Sécurité de vos documents - Ouvre une nouvelle fenêtre"
            rel="noopener"
            target="_blank"
            >sécurité de vos documents</a
          >
          par exemple
        </li>
      </ul>
      <a
        class="fr-btn"
        href="https://aide.dossierfacile.logement.gouv.fr/fr/"
        title="Consulter notre aide en ligne - Ouvre une nouvelle fenêtre"
        rel="noopener"
        target="_blank"
        @click="accordionClicked('contact_need_information')"
        >Consulter notre aide en ligne</a
      >
    </div>

    <div class="fr-background-alt--blue-france fr-p-3w">
      <h2 class="fr-text-title--blue-france fr-h6">Quelle est votre situation ?</h2>
      <fieldset
        id="radio-rich-inline"
        class="fr-fieldset"
        aria-labelledby="radio-rich-inline-legend radio-rich-inline-messages"
      >
        <legend
          id="radio-rich-inline-legend"
          class="fr-fieldset__legend--regular fr-fieldset__legend"
        >
          Vous avez créé :
        </legend>
        <div class="fr-fieldset__element fr-fieldset__element--inline">
          <div class="fr-radio-group fr-radio-rich">
            <input
              id="radio-rich-inline-1"
              v-model="contactFormData.profile"
              type="radio"
              name="radio-rich-inline"
              value="tenant"
              @change="onProfileChange"
            />
            <label class="fr-label" for="radio-rich-inline-1"> Un dossier locataire </label>
            <div class="fr-radio-rich__img">
              <svg
                class="fr-artwork"
                aria-hidden="true"
                viewBox="0 0 80 80"
                width="80px"
                height="80px"
              >
                <use
                  class="fr-artwork-decorative"
                  xlink:href="@gouvfr/dsfr/dist/artwork/pictograms/document/document.svg#artwork-decorative"
                ></use>
                <use
                  class="fr-artwork-minor"
                  xlink:href="@gouvfr/dsfr/dist/artwork/pictograms/document/document.svg#artwork-minor"
                ></use>
                <use
                  class="fr-artwork-major"
                  xlink:href="@gouvfr/dsfr/dist/artwork/pictograms/document/document.svg#artwork-major"
                ></use>
              </svg>
            </div>
          </div>
        </div>
        <div class="fr-fieldset__element fr-fieldset__element--inline">
          <div class="fr-radio-group fr-radio-rich">
            <input
              id="radio-rich-inline-2"
              v-model="contactFormData.profile"
              type="radio"
              name="radio-rich-inline"
              value="owner"
              @change="onProfileChange"
            />
            <label class="fr-label" for="radio-rich-inline-2"> Un compte propriétaire </label>
            <div class="fr-radio-rich__img">
              <svg
                class="fr-artwork"
                aria-hidden="true"
                viewBox="0 0 80 80"
                width="80px"
                height="80px"
              >
                <use
                  class="fr-artwork-decorative"
                  xlink:href="@gouvfr/dsfr/dist/artwork/pictograms/buildings/house.svg#artwork-decorative"
                ></use>
                <use
                  class="fr-artwork-minor"
                  xlink:href="@gouvfr/dsfr/dist/artwork/pictograms/buildings/house.svg#artwork-minor"
                ></use>
                <use
                  class="fr-artwork-major"
                  xlink:href="@gouvfr/dsfr/dist/artwork/pictograms/buildings/house.svg#artwork-major"
                ></use>
              </svg>
            </div>
          </div>
        </div>
        <div id="radio-rich-inline-messages" class="fr-messages-group" aria-live="assertive"></div>
      </fieldset>
    </div>

    <div v-if="contactFormData.profile === 'tenant'" class="fr-mt-3w">
      <TenantHelpAccordion @accordion-clicked="accordionClicked"></TenantHelpAccordion>
    </div>
    <div v-if="contactFormData.profile === 'owner'" class="fr-mt-3w">
      <OwnerHelpAccordion @accordion-clicked="accordionClicked"></OwnerHelpAccordion>
    </div>

    <div
      v-if="contactFormData.profile === 'tenant' || contactFormData.profile === 'owner'"
      class="fr-mt-7w"
    >
      <div class="fr-accordions-group">
        <section class="fr-accordion fr-accordion--form">
          <h3 class="fr-accordion__title">
            <button
              class="fr-accordion__btn fr-background-default--grey fr-text-title--grey"
              :aria-expanded="isFormOpen"
              aria-controls="accordion-form"
              @click="accordionClicked('contact_dont_find_question')"
            >
              Je ne trouve pas la réponse à ma question
            </button>
          </h3>
          <div id="accordion-form" class="fr-collapse">
            <p>
              Si votre question ne figure pas dans cette liste, vous pouvez contacter notre équipe
              d’assistance en utilisant ce formulaire.
            </p>
            <Form name="form" @submit="submitForm" @invalid-submit="onInvalidSubmit">
              <div class="fr-grid-row fr-grid-row--center">
                <div class="fr-col-12 fr-mb-3w">
                  <RequiredFieldsInstruction></RequiredFieldsInstruction>
                </div>
                <div class="fr-col-12 fr-col-md-6 fr-pr-md-3w fr-mb-3w position--relative">
                  <Field
                    id="firstname"
                    v-slot="{ field, meta, errorMessage }"
                    v-model="contactFormData.firstname"
                    name="firstname"
                    rules="required"
                  >
                    <div
                      :class="{
                        'fr-input-group--valid': meta.valid && meta.touched,
                        'fr-input-group--error': !meta.valid && meta.touched
                      }"
                    >
                      <FieldLabel :required="true" for-input="firstname">
                        {{ t('firstname') }}
                      </FieldLabel>
                      <input
                        id="firstname"
                        :class="meta.valid ? 'fr-input--valid' : 'fr-input--error'"
                        :placeholder="t('firstname')"
                        type="text"
                        v-bind="field"
                        name="firstname"
                        autocomplete="given-name"
                        :aria-invalid="!meta.valid"
                        aria-describedby="firstname-error"
                        class="validate-required form-control fr-input"
                      />
                      <span
                        v-show="!meta.valid"
                        id="firstname-error"
                        :class="{ 'fr-error-text': !meta.valid && meta.touched }"
                        >{{ t(errorMessage || '') }}</span
                      >
                    </div>
                  </Field>
                </div>
                <div class="fr-col-12 fr-col-md-6 fr-mb-3w position--relative">
                  <Field
                    id="lastname"
                    v-slot="{ field, meta, errorMessage }"
                    v-model="contactFormData.lastname"
                    name="lastname"
                    rules="required"
                  >
                    <div
                      :class="{
                        'fr-input-group--valid': meta.valid && meta.touched,
                        'fr-input-group--error': !meta.valid && meta.touched
                      }"
                    >
                      <FieldLabel :required="true" for-input="lastname">
                        {{ t('lastname') }}
                      </FieldLabel>
                      <input
                        v-bind="field"
                        id="lastname"
                        class="form-control fr-input validate-required"
                        :class="meta.valid ? 'fr-input--valid' : 'fr-input--error'"
                        :aria-invalid="!meta.valid"
                        aria-describedby="lastname-error"
                        name="lastname"
                        autocomplete="family-name"
                        :placeholder="t('lastname')"
                        type="text"
                      />
                      <span
                        v-show="!meta.valid"
                        id="lastname-error"
                        :class="{ 'fr-error-text': !meta.valid && meta.touched }"
                        >{{ t(errorMessage || '') }}</span
                      >
                    </div>
                  </Field>
                </div>
                <div class="fr-col-12 fr-mb-3w position--relative">
                  <Field
                    id="email"
                    v-slot="{ field, meta, errorMessage }"
                    v-model="contactFormData.email"
                    name="email"
                    :rules="{
                      email: true,
                      required: true
                    }"
                  >
                    <div
                      :class="{
                        'fr-input-group--valid': meta.valid && meta.touched,
                        'fr-input-group--error': !meta.valid && meta.touched
                      }"
                    >
                      <FieldLabel :required="true" for-input="email">
                        {{ t('email') }}
                      </FieldLabel>
                      <input
                        v-bind="field"
                        id="email"
                        v-model="contactFormData.email"
                        class="validate-required form-control fr-input"
                        :class="meta.valid ? 'fr-input--valid' : 'fr-input--error'"
                        :aria-invalid="!meta.valid"
                        aria-describedby="email-error"
                        name="email"
                        autocomplete="email"
                        :placeholder="t('email-example')"
                        type="text"
                      />
                      <span
                        v-show="!meta.valid && meta.touched"
                        id="email-error"
                        class="fr-error-text"
                        >{{ t(errorMessage || '') }}</span
                      >
                    </div>
                  </Field>
                </div>
                <div class="fr-col-12 fr-mb-3w position--relative">
                  <Field
                    id="subject"
                    v-slot="{ field, meta, errorMessage }"
                    v-model="contactFormData.subject"
                    name="subject"
                    rules="required"
                  >
                    <div
                      :class="{
                        'fr-input-group--valid': meta.valid && meta.touched,
                        'fr-input-group--error': !meta.valid && meta.touched
                      }"
                    >
                      <FieldLabel :required="true" for-input="subject">
                        {{ t('subject') }}
                      </FieldLabel>
                      <input
                        v-bind="field"
                        id="subject"
                        class="form-control fr-input validate-required"
                        :class="meta.valid ? 'fr-input--valid' : 'fr-input--error'"
                        :aria-invalid="!meta.valid"
                        aria-describedby="subject-error"
                        name="subject"
                        autocomplete="off"
                        :placeholder="t('subject')"
                        type="text"
                      />
                      <span
                        v-show="!meta.valid"
                        id="subject-error"
                        :class="{ 'fr-error-text': !meta.valid && meta.touched }"
                        >{{ t(errorMessage || '') }}</span
                      >
                    </div>
                  </Field>
                </div>
                <div class="fr-col-12 fr-mb-3w position--relative">
                  <Field
                    id="message"
                    v-slot="{ field, meta, errorMessage }"
                    v-model="contactFormData.message"
                    name="message"
                    rules="required"
                  >
                    <div
                      :class="{
                        'fr-input-group--valid': meta.valid && meta.touched,
                        'fr-input-group--error': !meta.valid && meta.touched
                      }"
                    >
                      <FieldLabel :required="true" for-input="message">
                        {{ t('message') }}
                      </FieldLabel>
                      <textarea
                        v-bind="field"
                        id="message"
                        class="form-control fr-input validate-required"
                        :class="meta.valid ? 'fr-input--valid' : 'fr-input--error'"
                        :aria-invalid="!meta.valid"
                        aria-describedby="message-error"
                        name="message"
                        autocomplete="off"
                        :placeholder="t('message')"
                      />
                      <span
                        v-show="errorMessage"
                        id="message-error"
                        :class="{ 'fr-error-text': !meta.valid && meta.touched }"
                        >{{ t(errorMessage || '') }}</span
                      >
                    </div>
                  </Field>
                </div>
                <div class="fr-background-alt--blue-france fr-p-2w fr-col-12 fr-mb-3w">
                  <div class="fr-checkbox-group">
                    <Field
                      v-slot="{ field, meta }"
                      name="acceptCgu"
                      type="checkbox"
                      rules="required"
                      :value="true"
                      :unchecked-value="false"
                    >
                      <input
                        id="acceptCgu"
                        v-bind="field"
                        name="acceptCgu"
                        type="checkbox"
                        aria-describedby="acceptCgu-error"
                        :aria-invalid="!meta.valid"
                        :value="false"
                      />
                      <label for="acceptCgu">
                        <div>{{ t('accept-cgu') }} <span class="color--required"> *</span></div>
                      </label>
                      <span
                        v-show="!meta.valid && meta.touched"
                        id="acceptCgu-error"
                        class="fr-error-text"
                        >{{ t('field-required') }}</span
                      >
                    </Field>
                  </div>
                </div>
                <div class="fr-col-12 fr-mb-3w text-right">
                  <DfButton primary type="submit">{{ t('submit') }}</DfButton>
                </div>
              </div>
            </Form>
          </div>
        </section>
      </div>
    </div>

    <div v-if="status == 'OK'">
      <Modal @close="closeModal">
        <template #body>
          <div class="fr-px-md-14w mail-success-container">
            <div class="fr-py-4w text-center green-title">
              {{ t('message-sent-title') }}
            </div>
            <div class="fr-pb-4w fr-px-md-7w text-center">
              {{ t('message-sent-text') }}
            </div>
            <div class="fr-pb-4w text-center">
              <a
                class="fr-btn fr-external-link"
                href="https://aide.dossierfacile.logement.gouv.fr/fr/"
                title="Documentation DossierFacile - Ouvre une nouvelle fenêtre"
                target="_blank"
                rel="noreferrer noopener "
                >{{ t('consult-our-documentation') }}</a
              >
            </div>
          </div>
        </template>
      </Modal>
    </div>
    <div v-if="status === 'KO'">
      <Modal @close="closeModal">
        <template #body>
          <div class="fr-container">
            <div class="fr-grid-row justify-content-center">
              <div class="fr-col-12">
                <p>
                  {{ t('contact-submit-error') }}
                </p>
              </div>
            </div>
          </div>
        </template>
      </Modal>
    </div>
  </section>
</template>

<script setup lang="ts">
import Modal from './ModalComponent.vue'
import DfButton from '../Button/DfButton.vue'
import RequiredFieldsInstruction from './form/RequiredFieldsInstruction.vue'
import OwnerHelpAccordion from './contact/OwnerHelpAccordion.vue'
import TenantHelpAccordion from './contact/TenantHelpAccordion.vue'
import FieldLabel from './form/FieldLabel.vue'
import { ContactFormData } from '../models/ContactFormData'
import { SupportService } from '../services/SupportService'
import { User } from '../models/User'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Form, Field, type InvalidSubmissionHandler } from 'vee-validate'
import '../validators/validationRules'

const { t } = useI18n()
const props = defineProps<{
  user?: User
  profile?: string
}>()

const contactFormData = ref(new ContactFormData())
const status = ref<'NEW' | 'OK' | 'KO'>('NEW')
const isFormOpen = ref(false)

const emit = defineEmits<{
  'on-profile-change': [profile: string]
  'on-send-message': [profile: string]
  'on-accordion-clicked': [tag: string]
}>()

onMounted(() => {
  if (props.user) {
    if (props.user.firstName) {
      contactFormData.value.firstname = props.user.firstName
    }
    if (props.user.lastName) {
      contactFormData.value.lastname = props.user.lastName
    }
    contactFormData.value.email = props.user.email
    contactFormData.value.profile = props.profile || ''
  }
  const searchParams = new URLSearchParams(window.location.search)
  if (searchParams.get('open') === 'form') {
    isFormOpen.value = true
  }
})

function accordionClicked(tag: string) {
  emit('on-accordion-clicked', tag)
}

function onProfileChange() {
  emit('on-profile-change', contactFormData.value.profile)
}

function submitForm() {
  emit('on-send-message', contactFormData.value.profile)
  SupportService.sendMail(contactFormData.value)
    .then(() => {
      status.value = 'OK'
      contactFormData.value.subject = ''
      contactFormData.value.message = ''
    })
    .catch((error) => {
      console.log(error)
      status.value = 'KO'
    })
}

const onInvalidSubmit: InvalidSubmissionHandler = (data) => {
  const firstError = Object.keys(data.errors)[0]
  const input = document.querySelector<HTMLElement>(`#accordion-form [name="${firstError}"]`)
  input?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  input?.focus()
}

function closeModal() {
  status.value = 'NEW'
}
</script>

<style scoped lang="scss">
.text-right {
  text-align: right;
}

textarea {
  height: 12rem;
}

.green-title {
  color: green;
  font-weight: bold;
  font-size: 1rem;
  padding-top: 0 !important;
}

.mail-success-container:before {
  content: url(../assets/enveloppe.webp);
  text-align: center;
  position: relative;
  margin: 0;
  padding: 0;
  top: -20px;
  left: calc(50% - 29px);
  font-size: 4rem;
}

.fr-external-link::after {
  content: '';
}

.fr-accordion--form::before {
  box-shadow: 0px 0 0 1px var(--border-default-grey);
}
</style>

<style lang="scss">
.fr-accordion::before {
  box-shadow: none;
}

.fr-fieldset__element--inline {
  flex: 1;
}

.fr-accordion .fr-collapse {
  margin: 0;
}
</style>

<i18n>
{
  "en": {
    "title": "How can we help you ?",
    "firstname": "Firstname",
    "lastname": "Lastname",
    "email": "Email",
    "email-example": "nom.prenom{'@'}mail.fr",
    "profile": "User's profile",
    "subject": "Subject",
    "message": "Message",
    "cancel": "Cancel",
    "submit" : "Send my message",
    "owner": "Owner",
    "tenant": "Tenant",
    "accept-cgu" : "I agree with DossierFacile's Conditions and Terms",
    "field-required" : "Field is required",
    "require-accept" : "Accept is required",
    "email-not-valid" : "Email not valid",
    "our-documentation": "our documentation",
    "contact-description" : "If you have any trouble to create your DossierFacile or if your have question which have not response in {doc_link}, you can fill the following form.",
    "contact-submit-error" : "Oops... Something wrong happened. May I ask you to contact us by mail at: contact{'@'}dossierFacile.fr",
    "consult-our-documentation" : "Consult our documentation",
    "message-sent-title" : "Thank you !",
    "message-sent-text" : "We will do our best to answer you fast. Please consider to ",
    "see-breadcrumb": "See breadcrumb"
  },
  "fr": {
    "title": "Comment pouvons-nous vous aider ?",
    "firstname": "Prénom",
    "lastname": "Nom",
    "email": "Votre adresse e-mail",
    "email-example": "nom.prenom{'@'}mail.fr",
    "profile": "Votre profil",
    "subject": "L'objet de votre message",
    "message": "Votre message",
    "cancel": "Annuler",
    "submit" : "Envoyer mon message",
    "owner": "Propriétaire",
    "tenant": "Locataire",
    "accept-cgu" : "Vous acceptez que ces informations soient transmises à notre équipe d'assistance et à CRISP, notre outil d’assistance, afin de répondre à votre demande.",
    "field-required" : "Ce champ est requis",
    "require-accept" : "L'acception est requise",
    "email-not-valid" : "Email non-valide",
    "our-documentation": "notre documentation",
    "contact-description" : "Que vous éprouviez des difficultés à créer votre DossierFacile, que vous souhaitiez obtenir des renseignements plus précis que ce qui est disponible au sein de {doc_link}, ou que ce soit pour glisser un mot sympathique à notre équipe de choc qui traite vos dossiers avec attention, vous pouvez renseigner le formulaire ci-dessous. Nous faisons de notre mieux afin de répondre à tous, dans des délais acceptables.",
    "contact-submit-error" : "Oops... L'envoi du formulaire a échoué. Pourriez-vous nous contacter par mail ici: contact{'@'}dossierFacile.fr ?",
    "consult-our-documentation" : "Consulter notre documentation",
    "message-sent-title" : "C'est tout bon ! Votre message est bien arrivé !",
    "message-sent-text" : "Nous nous efforçons de vous répondre dans les meilleurs délais. D'ici là n'hésitez pas à",
    "see-breadcrumb": "Voir le fil d’Ariane"
  }
}
</i18n>
