<template>
  <div class="bg-blue">
    <div class="fr-container">
      <section>
        <div class="fr-grid-row fr-grid-row--center">
          <div class="fr-col-12">
            <div class="main fr-p-4w">
              <div class="main-bar fr-grid-row">
                <div class="header-title mobile-margin">
                  <h1 class="fr-mr-2w fr-mb-0 fr-mt-0">
                    {{ t("title-contact") }}
                  </h1>
                </div>
              </div>
              <div class="main-description fr-mt-2w">
                <i18n-t keypath="contact-description" tag="p">
                  <template v-slot:doc_link>
                    <a
                      href="https://docs.dossierfacile.logement.gouv.fr"
                      title="Documentation DossierFacile"
                      target="_blank"
                      >{{ t("our-documentation") }}</a
                    >
                  </template>
                </i18n-t>
              </div>
              <div
                v-if="status == 'OK'"
                class="bg-white fr-px-md-14w mail-success-container"
              >
                <div class="fr-py-4w text-center green-title">
                  {{ t("message-sent-title") }}
                </div>
                <div class="fr-pb-4w fr-px-md-7w text-center">
                  {{ t("message-sent-text") }}
                </div>
                <div class="fr-pb-4w text-center">
                  <DfButton class="" :primary="true">
                    <a
                      class="fr-external-link"
                      href="https://docs.dossierfacile.logement.gouv.fr"
                      title="Documentation DossierFacile"
                      target="_blank"
                      rel="noreferrer noopener "
                      >{{ t("consult-our-documentation") }}</a
                    >
                  </DfButton>
                </div>
              </div>
              <div v-if="status === 'KO'" class="bg-white fr-p-4w fr-px-md-10w">
                <Modal @close="closeModal">
                  <template v-slot:body>
                    <div class="fr-container">
                      <div class="fr-grid-row justify-content-center">
                        <div class="fr-col-12">
                          <p>
                            {{ t("contact-submit-error") }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </template>
                </Modal>
              </div>
              <div v-if="status !== 'OK'" class="bg-white fr-p-4w fr-px-md-10w">
                <Form name="form" @submit="submitForm">
                  <div class="fr-grid-row fr-grid-row--center">
                    <div class="fr-col-12 fr-mb-3w">
                      <RequiredFieldsInstruction></RequiredFieldsInstruction>
                    </div>
                    <div class="fr-col-12 fr-col-md-6 fr-pr-md-3w fr-mb-3w">
                      <div class="fr-input-group">
                        <Field
                          id="firstname"
                          name="firstname"
                          v-model="contactFormData.firstname"
                          v-slot="{ field, meta }"
                          :rules="{
                            required: true,
                          }"
                        >
                          <FieldLabel :required="true" for-input="firstname">
                            {{ t("firstname") }}
                          </FieldLabel>
                          <input
                            id="firstname"
                            :class="{
                              'fr-input--valid': meta.valid,
                              'fr-input--error': !meta.valid,
                            }"
                            :placeholder="t('firstname')"
                            type="text"
                            v-bind="field"
                            name="firstname"
                            autocomplete="given-name"
                            class="validate-required form-control fr-input"
                          />
                          <ErrorMessage name="firstname" v-slot="{ message }">
                            <span role="alert" class="fr-error-text">{{
                              t(message || "")
                            }}</span>
                          </ErrorMessage>
                        </Field>
                      </div>
                    </div>
                    <div class="fr-col-12 fr-col-md-6 fr-mb-3w">
                      <div class="fr-input-group">
                        <Field
                          id="lastname"
                          name="lastname"
                          v-model="contactFormData.lastname"
                          v-slot="{ field, meta }"
                          :rules="{
                            required: true,
                          }"
                        >
                          <FieldLabel :required="true" for-input="lastname">
                            {{ t("lastname") }}
                          </FieldLabel>
                          <input
                            v-bind="field"
                            class="form-control fr-input validate-required"
                            :class="{
                              'fr-input--valid': meta.valid,
                              'fr-input--error': !meta.valid,
                            }"
                            id="lastname"
                            name="lastname"
                            autocomplete="family-name"
                            :placeholder="t('lastname')"
                            type="text"
                          />
                          <ErrorMessage name="lastname" v-slot="{ message }">
                            <span role="alert" class="fr-error-text">{{
                              t(message || "")
                            }}</span>
                          </ErrorMessage>
                        </Field>
                      </div>
                    </div>
                    <div class="fr-col-12 fr-mb-3w">
                      <Field
                        id="email"
                        name="email"
                        v-model="contactFormData.email"
                        v-slot="{ field, meta }"
                        :rules="{
                          email: true,
                          required: true,
                        }"
                      >
                        <FieldLabel :required="true" for-input="email">
                          {{ t("email") }}
                        </FieldLabel>
                        <input
                          v-bind="field"
                          class="validate-required form-control fr-input"
                          :class="{
                            'fr-input--valid': meta.valid,
                            'fr-input--error': !meta.valid,
                          }"
                          v-model="contactFormData.email"
                          id="email"
                          name="email"
                          autocomplete="email"
                          :placeholder="t('email')"
                          type="text"
                        />
                        <ErrorMessage name="email" v-slot="{ message }">
                          <span role="alert" class="fr-error-text">{{
                            t(message || "")
                          }}</span>
                        </ErrorMessage>
                      </Field>
                    </div>
                    <div class="fr-col-12 fr-mb-3w">
                      <Field
                        id="profile"
                        name="profile"
                        v-model="contactFormData.profile"
                        v-slot="{ meta }"
                        :rules="{
                          required: true,
                        }"
                      >
                        <fieldset
                          class="fr-radio-group-container"
                          aria-labelledby="radio-profile-legend"
                          role="group"
                          :class="{
                            'fr-fieldset--valid': meta.valid,
                            'fr-fieldset--error': !meta.valid,
                          }"
                        >
                          <legend id="radio-profile-legend">
                            {{ t("profile") }}
                            <span style="color: red"> *</span> :
                          </legend>
                          <input
                            v-model="contactFormData.profile"
                            id="profile-tenant"
                            type="radio"
                            name="profile"
                            value="profile-tenant"
                          />
                          <label
                            class="fr-ml-md-4w fr-px-8w fr-py-2w"
                            for="profile-tenant"
                            >{{ t("tenant") }}</label
                          >
                          <input
                            v-model="contactFormData.profile"
                            id="profile-owner"
                            type="radio"
                            name="profile"
                            value="profile-owner"
                          />
                          <label
                            class="fr-ml-md-2w fr-px-8w fr-py-2w"
                            for="profile-owner"
                            >{{ t("owner") }}</label
                          >
                        </fieldset>
                        <ErrorMessage name="profile" v-slot="{ message }">
                          <span role="alert" class="fr-error-text">{{
                            t(message || "")
                          }}</span>
                        </ErrorMessage>
                      </Field>
                    </div>
                    <div class="fr-col-12 fr-mb-3w">
                      <Field
                        id="subject"
                        name="subject"
                        v-model="contactFormData.subject"
                        v-slot="{ field, meta }"
                        :rules="{
                          required: true,
                        }"
                      >
                        <FieldLabel :required="true" for-input="subject">
                          {{ t("subject") }}
                        </FieldLabel>
                        <input
                          v-model="contactFormData.subject"
                          class="form-control fr-input validate-required"
                          :class="{
                            'fr-input--valid': meta.valid,
                            'fr-input--error': !meta.valid,
                          }"
                          id="subject"
                          name="subject"
                          autocomplete="off"
                          :placeholder="t('subject')"
                          type="text"
                        />
                        <ErrorMessage name="subject" v-slot="{ message }">
                          <span role="alert" class="fr-error-text">{{
                            t(message || "")
                          }}</span>
                        </ErrorMessage>
                      </Field>
                    </div>
                    <div class="fr-col-12 fr-mb-3w">
                      <Field
                        id="message"
                        name="message"
                        v-model="contactFormData.message"
                        v-slot="{ field, meta }"
                        :rules="{
                          required: true,
                        }"
                      >
                        <FieldLabel :required="true" for-input="message">
                          {{ t("message") }}
                        </FieldLabel>
                        <textarea
                          v-model="contactFormData.message"
                          class="form-control fr-input validate-required"
                          :class="{
                            'fr-input--valid': meta.valid,
                            'fr-input--error': !meta.valid,
                          }"
                          id="message"
                          name="message"
                          autocomplete="off"
                          :placeholder="t('message')"
                          type="textarea"
                        />
                        <ErrorMessage
                          class="fr-error-text"
                          name="message"
                          v-slot="{ message }"
                        >
                          <span role="alert" class="fr-error-text">{{
                            t(message || "")
                          }}</span>
                        </ErrorMessage>
                      </Field>
                    </div>
                    <div class="fr-col-12 fr-mb-3w">
                      <div class="bg-purple fr-checkbox-group">
                        <Field
                          name="acceptCgu"
                          id="acceptCgu"
                          type="checkbox"
                          rules="isTrue"
                          :value="true"
                        />
                        <label for="acceptCgu"
                          ><div v-html="t('accept-cgu')"></div
                        ></label>
                        <ErrorMessage
                          class="fr-error-text"
                          name="acceptCgu"
                          v-slot="{ message }"
                        >
                          <span role="alert" class="fr-error-text">{{
                            t(message || "")
                          }}</span>
                        </ErrorMessage>
                      </div>
                    </div>
                    <div class="fr-col-12 fr-mb-3w text-right">
                      <DfButton class="" :primary="true" type="submit">{{
                        t("submit")
                      }}</DfButton>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import Modal from "./Modal.vue";
import DfButton from "df-shared-next/src/Button/Button.vue";
import RequiredFieldsInstruction from "df-shared-next/src/components/form/RequiredFieldsInstruction.vue";
import FieldLabel from "df-shared-next/src/components/form/FieldLabel.vue";
import { ContactFormData } from "df-shared-next/src/models/ContactFormData";
import { SupportService } from "df-shared-next/src/services/SupportService";
import { User } from "../models/User";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { Form, Field, ErrorMessage } from "vee-validate";
import "../validators/validationRules";

const { t } = useI18n();
const props = defineProps<{
  user?: User;
}>();

const contactFormData = new ContactFormData();
const status = ref("NEW"); // NEW, OK, KO

onMounted(() => {
  if (props.user) {
    if (props.user.firstName) {
      contactFormData.firstname = props.user.firstName;
    }
    if (props.user.lastName) {
      contactFormData.lastname = props.user.lastName;
    }
    contactFormData.email = props.user.email;
    contactFormData.profile = "profile-owner";
  }
});

function submitForm() {
  SupportService.sendMail(contactFormData)
    .then(() => {
      status.value = "OK";
    })
    .catch((error: any) => {
      console.log(error);
      status.value = "KO";
    });
}

function closeModal() {
  status.value = "NEW";
}
</script>

<style scoped lang="scss">
.bg-blue {
  width: 100%;
  background-color: var(--bf100-g750);
}
.bg-white {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  background: var(--background-default-grey);
}
.text-right {
  text-align: right;
}
.fr-breadcrumb {
  margin-top: 0;
  margin-bottom: 0;
}
textarea {
  height: 12rem;
}
fieldset.fr-radio-group-container {
  border: none;
  padding: 0;
  margin: 0;
  text-align: left;
  input[type="radio"] {
    clip: rect(1px, 1px, 1px, 1px);
    position: absolute !important;
  }
  input[type="radio"]:checked + label {
    background: var(--blue-france-925);
    outline-color: #0a76f6;
    outline-offset: -1px;
    outline-style: auto;
    outline-width: 1px;
    text-shadow: 0 0 1px rgba(0, 0, 0, 0.7);
  }
  input[type="radio"]:focus + label {
    outline-color: #0a76f6;
    outline-offset: 2px;
    outline-style: auto;
    outline-width: 2px;
  }
  label {
    @media all and (min-width: 768px) {
      display: inline-block;
    }
    @media all and (max-width: 767px) {
      margin-right: 0;
      display: flex;
      margin-bottom: 1rem;
    }
    background-color: var(--background-contrast-grey);
    border-radius: 10px;
  }
  legend {
    @media all and (min-width: 992px) {
      display: contents;
    }
    margin-bottom: 1rem;
  }
}
.fr-fieldset--error {
  legend {
    color: var(--text-default-error);
  }
}
.green-title {
  color: green;
  font-weight: bold;
  font-size: 1rem;
  padding-top: 0 !important;
}
.mail-success-container:before {
  content: url("../assets/enveloppe.webp");
  text-align: center;
  position: relative;
  margin: 0;
  padding: 0;
  top: -20px;
  left: calc(50% - 29px);
  font-size: 4rem;
}
.fr-external-link::after {
  content: "";
}

fieldset.fr-radio-group-container {
  border: none;
  padding: 0;
  margin: 0;
  text-align: left;
  input[type="radio"] {
    clip: rect(1px, 1px, 1px, 1px);
    position: absolute !important;
  }
  input[type="radio"]:checked + label {
    background: var(--blue-france-925);
    outline-color: #0a76f6;
    outline-offset: -1px;
    outline-style: auto;
    outline-width: 1px;
    text-shadow: 0 0 1px rgba(0, 0, 0, 0.7);
  }
  input[type="radio"]:focus + label {
    outline-color: #0a76f6;
    outline-offset: 2px;
    outline-style: auto;
    outline-width: 2px;
  }
  label {
    @media all and (min-width: 768px) {
      display: inline-block;
    }
    @media all and (max-width: 767px) {
      margin-right: 0;
      display: flex;
      margin-bottom: 1rem;
    }
    background-color: var(--background-contrast-grey);
    border-radius: 10px;
  }
  legend {
    @media all and (min-width: 992px) {
      display: contents;
    }
    margin-bottom: 1rem;
  }
}
</style>

<i18n>
{
  "en": {
    "title-contact": "Contact Us",
    "firstname": "Firstname",
    "lastname": "Lastname",
    "email": "Email",
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
    "title-contact": "Contactez notre support",
    "firstname": "Prénom",
    "lastname": "Nom",
    "email": "Votre adresse e-mail",
    "profile": "Votre profil",
    "subject": "L'objet de votre message",
    "message": "Votre message",
    "cancel": "Annuler",
    "submit" : "Envoyer mon message",
    "owner": "Propriétaire",
    "tenant": "Locataire",
    "accept-cgu" : "Le support DossierFacile est assuré par des humains travaillant directement pour DossierFacile et qui utilisent le logiciel Helpscout. En contactant le support DossierFacile, je consens à l'utilisation de toutes les données transmises par ce biais à DossierFacile et Helpscout dans le but de répondre à ma demande de support.",
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
