<template>
  <div class="bg-blue">
    <div class="fr-container">
      <nav
        role="navigation"
        class="fr-p-4w fr-breadcrumb"
        aria-label="vous êtes ici :"
      >
        <button
          class="fr-breadcrumb__button"
          aria-expanded="false"
          aria-controls="breadcrumb-1"
        >
          {{ $t("see-breadcrumb") }}
        </button>
        <div class="fr-collapse" id="breadcrumb-1">
          <ol class="fr-breadcrumb__list">
            <li>
              <a class="fr-breadcrumb__link" href="/">Accueil</a>
            </li>
            <li>
              <a class="fr-breadcrumb__link" aria-current="page">Contact</a>
            </li>
          </ol>
        </div>
      </nav>
      <section>
        <div class="fr-grid-row fr-grid-row--center">
          <div class="fr-col-12">
            <div class="main fr-p-4w">
              <div class="main-bar fr-grid-row">
                <div class="header-title mobile-margin">
                  <h1 class="fr-mr-2w fr-mb-0 fr-mt-0">
                    {{ $t("title-contact") }}
                  </h1>
                </div>
              </div>
              <div class="main-description fr-mt-2w">
                <i18n path="contact-description" tag="p">
                  <template v-slot:doc_link>
                    <a
                      href="https://docs.dossierfacile.fr"
                      title="Documentation DossierFacile"
                      target="_blank"
                      >{{ $t("our-documentation") }}</a
                    >
                  </template>
                </i18n>
              </div>
              <div
                v-if="status == 'OK'"
                class="bg-white fr-px-md-14w mail-success-container"
              >
                <div class="fr-py-4w text-center green-title">
                  {{ $t("message-sent-title") }}
                </div>
                <div class="fr-pb-4w fr-px-md-7w text-center">
                  {{ $t("message-sent-text") }}
                </div>
                <div class="fr-pb-4w text-center">
                  <DfButton class="" primary="true">
                    <a
                      href="https://docs.dossierfacile.fr"
                      title="Documentation DossierFacile"
                      target="_blank"
                      >{{ $t("consult-our-documentation") }}</a
                    >
                  </DfButton>
                </div>
              </div>
              <div v-if="status == 'KO'" class="bg-white fr-p-4w fr-px-md-10w">
                <Modal @close="closeModal">
                  <template v-slot:body>
                    <div class="fr-container">
                      <div class="fr-grid-row justify-content-center">
                        <div class="fr-col-12">
                          <p>
                            {{ $t("contact-submit-error") }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </template>
                </Modal>
              </div>
              <div v-if="status != 'OK'" class="bg-white fr-p-4w fr-px-md-10w">
                <ValidationObserver v-slot="{ handleSubmit }">
                  <form v-on:submit.prevent="handleSubmit(submitForm)">
                    <div class="fr-grid-row fr-grid-row--center">
                      <div class="fr-col-12 fr-mb-3w">
                        <i18n path="description-required-field">
                          <template v-slot:asterix>
                            <span style="color:red">*</span>
                          </template>
                        </i18n>
                      </div>
                      <div class="fr-col-12 fr-col-md-6 fr-pr-md-3w fr-mb-3w">
                        <div class="fr-input-group">
                          <label for="firstname" class="fr-label"
                            >{{ $t("firstname") }} :</label
                          >
                          <input
                            id="firstname"
                            :placeholder="$t('firstname')"
                            type="text"
                            v-model="contactFormData.firstname"
                            name="firstname"
                            class="validate-required form-control fr-input"
                          />
                        </div>
                      </div>
                      <div class="fr-col-12 fr-col-md-6 fr-mb-3w">
                        <div class="fr-input-group">
                          <label class="fr-label" for="lastname"
                            >{{ $t("lastname") }} :</label
                          >
                          <input
                            v-model="contactFormData.lastname"
                            class="form-control fr-input validate-required"
                            id="lastname"
                            name="lastname"
                            :placeholder="$t('lastname')"
                            type="text"
                          />
                        </div>
                      </div>
                      <div class="fr-col-12 fr-mb-3w">
                        <validation-provider
                          rules="required|email"
                          v-slot="{ errors }"
                        >
                          <div
                            class="fr-input-group"
                            :class="errors[0] ? 'fr-input-group--error' : ''"
                          >
                            <label class="fr-label" for="email"
                              >{{ $t("email") }} * :</label
                            >
                            <input
                              v-model="contactFormData.email"
                              class="form-control fr-input validate-required"
                              id="email"
                              name="email"
                              :placeholder="$t('email')"
                              type="text"
                            />
                            <span class="fr-error-text" v-if="errors[0]">{{
                              $t(errors[0])
                            }}</span>
                          </div>
                        </validation-provider>
                      </div>
                      <div class="fr-col-12 fr-mb-3w">
                        <validation-provider
                          rules="required"
                          v-slot="{ errors }"
                        >
                          <fieldset class="fr-radio-group-container">
                            <legend>{{ $t("profile") }} * :</legend>
                            <input
                              v-model="contactFormData.profile"
                              id="profile-tenant"
                              type="radio"
                              name="profile"
                              value="profile-tenant"
                              checked="checked"
                            />
                            <label
                              class="fr-ml-md-4w fr-px-8w fr-py-2w"
                              for="profile-tenant"
                              >{{ $t("tenant") }}</label
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
                              >{{ $t("owner") }}</label
                            >
                          </fieldset>
                          <span class="fr-error-text" v-if="errors[0]">{{
                            $t(errors[0])
                          }}</span>
                        </validation-provider>
                      </div>
                      <div class="fr-col-12 fr-mb-3w">
                        <validation-provider
                          rules="required"
                          v-slot="{ errors }"
                        >
                          <div
                            class="fr-input-group"
                            :class="errors[0] ? 'fr-input-group--error' : ''"
                          >
                            <label class="fr-label" for="subject"
                              >{{ $t("subject") }} * :</label
                            >
                            <input
                              v-model="contactFormData.subject"
                              class="form-control fr-input validate-required"
                              id="subject"
                              name="subject"
                              :placeholder="$t('subject')"
                              type="text"
                            />
                            <span class="fr-error-text" v-if="errors[0]">{{
                              $t(errors[0])
                            }}</span>
                          </div>
                        </validation-provider>
                      </div>
                      <div class="fr-col-12 fr-mb-3w">
                        <validation-provider
                          rules="required"
                          v-slot="{ errors }"
                        >
                          <div
                            class="fr-input-group"
                            :class="errors[0] ? 'fr-input-group--error' : ''"
                          >
                            <label class="fr-label" for="message"
                              >{{ $t("message") }} * :</label
                            >
                            <textarea
                              v-model="contactFormData.message"
                              class="form-control fr-input validate-required"
                              id="message"
                              name="message"
                              :placeholder="$t('message')"
                              type="textarea"
                            />
                            <span class="fr-error-text" v-if="errors[0]">{{
                              $t(errors[0])
                            }}</span>
                          </div>
                        </validation-provider>
                      </div>
                      <div class="fr-col-12 fr-mb-3w">
                        <validation-provider rules="is" v-slot="{ errors }">
                          <div
                            class="bg-purple fr-checkbox-group"
                            :class="errors[0] ? 'fr-input-group--error' : ''"
                          >
                            <input
                              type="checkbox"
                              id="acceptCgu"
                              v-model="acceptCgu"
                              value="false"
                            />
                            <label for="acceptCgu"
                              ><div v-html="$t('accept-cgu')"></div
                            ></label>
                            <span class="fr-error-text" v-if="errors[0]">{{
                              $t(errors[0])
                            }}</span>
                          </div>
                        </validation-provider>
                      </div>
                      <div class="fr-col-12 fr-mb-3w text-right">
                        <DfButton class="" primary="true">{{
                          $t("submit")
                        }}</DfButton>
                      </div>
                    </div>
                  </form>
                </ValidationObserver>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import Modal from "./Modal.vue";
import { extend } from "vee-validate";
import { is, required, email } from "vee-validate/dist/rules";
import DfButton from "df-shared/src/Button/Button.vue";
import { ContactFormData } from "df-shared/src/models/ContactFormData";
import { SupportService } from "df-shared/src/services/SupportService";
import { User } from "../models/User";

// No message specified.
extend("email", {
  ...email,
  message: "email-not-valid"
});

extend("required", {
  ...required,
  message: "field-required"
});

extend("is", {
  ...is,
  message: "require-accept",
  validate: value => !!value
});

@Component({
  components: {
    ValidationProvider,
    ValidationObserver,
    DfButton,
    Modal
  }
})
export default class ContactForm extends Vue {
  @Prop() user!: User;

  acceptCgu = false;
  contactFormData = new ContactFormData();
  status = "NEW"; // NEW, OK, KO

  mounted() {
    if (this.user) {
      this.contactFormData.firstname = this.user.firstName;
      this.contactFormData.lastname = this.user.lastName;
      this.contactFormData.email = this.user.email;
      this.contactFormData.profile = "profile-tenant";
    }
  }

  submitForm() {
    SupportService.sendMail(this.contactFormData)
      .then(() => {
        this.status = "OK";
      })
      .catch(error => {
        console.log(error);
        this.status = "KO";
      });
  }

  closeModal() {
    this.status = "NEW";
  }
}
</script>

<style scoped lang="scss">
.bg-blue {
  width: 100%;
  background-color: var(--bf100-g750);
}
.bg-white {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  border-radius: 10px;
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
    //margin-left: 4rem;
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
.green-title {
  color: green;
  font-weight: bold;
  font-size: 1rem;
  padding-top: 0 !important;
}
.mail-success-container:before {
  content: url("../assets/enveloppe.webp");;
  text-align: center;
  position: relative;
  margin: 0;
  padding: 0;
  top: -20px;
  left: calc(50% - 29px);
  font-size: 4rem;
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
"description-required-field" : "Fields with {asterix} are required.",
"contact-submit-error" : "Oops... Something wrong happened. May I ask you to contact us by mail at: contact@dossierFacile.fr",
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
"description-required-field" : "Les champs marqués d'un {asterix} sont obligatoires.",
"contact-submit-error" : "Oops... L'envoi du formulaire a échoué. Pourriez-vous nous contacter par mail ici: contact@dossierFacile.fr ?",
"consult-our-documentation" : "Consulter notre documentation",
"message-sent-title" : "C'est tout bon ! Votre message est bien arrivé !",
"message-sent-text" : "Nous nous efforçons de vous répondre dans les meilleurs délais. D'ici là n'hésitez pas à",
"see-breadcrumb": "Voir le fil d’Ariane"
}
}
</i18n>
