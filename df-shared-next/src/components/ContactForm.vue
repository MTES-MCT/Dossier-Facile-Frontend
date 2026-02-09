<template>
  <section class="fr-background-default--grey fr-p-1w fr-p-md-4w">
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

    <div class="fr-background-alt--blue-france fr-px-1w fr-pt-2w fr-px-md-3w">
      <h2 class="fr-text-title--blue-france fr-h6">Quelle est votre situation&nbsp;?</h2>

      <DsfrRadioButtonSet
        :legend="t('choice.legend')"
        v-model="contactFormData.profile"
        name="profile-choice"
        :options="options"
        inline
        small
        @update:model-value="onProfileChange"
      />
    </div>

    <div v-if="contactFormData.profile === 'tenant'" class="fr-mt-3w">
      <TenantHelpAccordion @accordion-clicked="accordionClicked"></TenantHelpAccordion>
    </div>
    <div v-if="contactFormData.profile === 'owner'" class="fr-mt-3w">
      <OwnerHelpAccordion @accordion-clicked="accordionClicked"></OwnerHelpAccordion>
    </div>

    <div class="fr-mt-7w">
      <h2 class="fr-h4">Je ne trouve pas la réponse à ma question</h2>
      <p>
        Si votre question ne figure pas dans cette liste, vous pouvez contacter notre équipe
        d’assistance en utilisant ce formulaire.
      </p>
      <RequiredFieldsInstruction all-required />
      <FormWithValidation :profile :user @on-submit="submitForm" />
    </div>

    <DsfrModalPatch
      v-model:is-opened="isValidModalOpened"
      :title="t('message-sent-title')"
      size="xl"
      icon="fr-icon-success-line"
    >
      <p>{{ t('message-sent-text') }}</p>

      <a
        class="fr-btn fr-external-link"
        href="https://aide.dossierfacile.logement.gouv.fr/fr/"
        :title="`${t('consult-our-documentation')} - Ouvre une nouvelle fenêtre`"
        target="_blank"
        rel="noreferrer noopener "
      >
        {{ t('consult-our-documentation') }}
      </a>
    </DsfrModalPatch>

    <DsfrModalPatch
      v-model:is-opened="isErrorModalOpened"
      :title="t('message-error-title')"
      size="xl"
      icon="fr-icon-error-line"
    >
      <p>{{ t('message-error-text') }}</p>
    </DsfrModalPatch>
  </section>
</template>

<script setup lang="ts">
import OwnerHelpAccordion from './contact/OwnerHelpAccordion.vue'
import TenantHelpAccordion from './contact/TenantHelpAccordion.vue'
import type { ContactFormData } from '../models/ContactFormData'
import { SupportService } from '../services/SupportService'
import type { User } from '../models/User'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { DsfrRadioButtonOptions } from '@gouvminint/vue-dsfr'
import { DsfrRadioButtonSet } from '@gouvminint/vue-dsfr'
import FormWithValidation from './form/FormWithValidation.vue'

import tenantPicto from '@gouvfr/dsfr/dist/artwork/pictograms/document/document.svg'
import ownerPicto from '@gouvfr/dsfr/dist/artwork/pictograms/buildings/house.svg'
import RequiredFieldsInstruction from './form/RequiredFieldsInstruction.vue'
import DsfrModalPatch from './patches/DsfrModalPatch.vue'

const { t } = useI18n()

interface Props {
  user?: User
  profile?: 'tenant' | 'owner'
}
const { user, profile = 'tenant' } = defineProps<Props>()

const isFormOpen = ref(false)
const isValidModalOpened = ref(false)
const isErrorModalOpened = ref(false)

const emit = defineEmits<{
  'on-profile-change': [profile: string]
  'on-send-message': [profile: string]
  'on-accordion-clicked': [tag: string]
}>()

onMounted(() => {
  contactFormData.value.profile = profile
  const searchParams = new URLSearchParams(window.location.search)
  if (searchParams.get('open') === 'form') {
    isFormOpen.value = true
  }
})

const options: DsfrRadioButtonOptions = [
  {
    label: t('choice.tenant'),
    id: 'choice-tenant',
    value: 'tenant',
    svgPath: tenantPicto
  },
  {
    label: t('choice.owner'),
    id: 'choice-owner',
    value: 'owner',
    svgPath: ownerPicto
  }
]

const contactFormData = ref<ContactFormData>({} as ContactFormData)

function accordionClicked(tag: string) {
  emit('on-accordion-clicked', tag)
}

function onProfileChange() {
  emit('on-profile-change', contactFormData.value.profile)
}

function submitForm(payload: ContactFormData) {
  contactFormData.value = payload
  emit('on-send-message', contactFormData.value.profile)
  SupportService.sendMail(contactFormData.value)
    .then(() => {
      isValidModalOpened.value = true
      contactFormData.value.subject = ''
      contactFormData.value.message = ''
    })
    .catch((error) => {
      console.log(error)
      isErrorModalOpened.value = true
    })
}
</script>

<style scoped>
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

:deep(.fr-accordion::before) {
  box-shadow: none;
}
:deep(.fr-fieldset__element--inline) {
  flex: 1;
}
:deep(.fr-accordion .fr-collapse) {
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
		"choice": {	
			"tenant": "A tenant file",
			"owner": "An owner account",
			"legend": "You created…"
		},
		"choice-tenant": "A tenant file",
		"choice-owner": "An owner account",
    "accept-cgu" : "I agree with DossierFacile's Conditions and Terms",
    "field-required" : "Field is required",
    "require-accept" : "Accept is required",
    "email-not-valid" : "Email not valid",
    "our-documentation": "our documentation",
    "contact-description" : "If you have any trouble to create your DossierFacile or if your have question which have not response in {doc_link}, you can fill the following form.",
    "message-error-title" : "Something went wrong with the form.",
		"message-error-text": "Please send us an email at: contact{'@'}dossierFacile.fr",
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
		"choice": {
			"tenant": "Un dossier locataire",
			"owner": "Un compte propriétaire",
			"legend": "Vous avez créé…"
		},
    "accept-cgu" : "Vous acceptez que ces informations soient transmises à notre équipe d'assistance et à CRISP, notre outil d’assistance, afin de répondre à votre demande.",
    "field-required" : "Ce champ est requis",
    "require-accept" : "L'acception est requise",
    "email-not-valid" : "Email non-valide",
    "our-documentation": "notre documentation",
    "contact-description" : "Que vous éprouviez des difficultés à créer votre DossierFacile, que vous souhaitiez obtenir des renseignements plus précis que ce qui est disponible au sein de {doc_link}, ou que ce soit pour glisser un mot sympathique à notre équipe de choc qui traite vos dossiers avec attention, vous pouvez renseigner le formulaire ci-dessous. Nous faisons de notre mieux afin de répondre à tous, dans des délais acceptables.",
    "message-error-title" : "L'envoi du formulaire a échoué.",
		"message-error-text" : "Contactez-nous par mail ici: contact{'@'}dossierFacile.fr",
    "consult-our-documentation" : "Consulter notre documentation",
    "message-sent-title" : "C'est tout bon ! Votre message est bien arrivé !",
    "message-sent-text" : "Nous nous efforçons de vous répondre dans les meilleurs délais. D'ici là n'hésitez pas à",
    "see-breadcrumb": "Voir le fil d’Ariane"
  }
}
</i18n>
