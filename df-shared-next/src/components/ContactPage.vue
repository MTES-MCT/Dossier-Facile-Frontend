<template>
  <section class="fr-background-default--grey fr-p-1w fr-p-md-4w">
    <h1>
      {{ t('title') }}
    </h1>
    <div class="fr-callout">
      <h2 class="fr-callout__title">{{ t('callout.title') }}</h2>
      <p class="fr-callout__text">{{ t('callout.list.title') }}</p>
      <ul class="fr-callout__text">
        <li>
          <i18n-t keypath="callout.list.item-1" tag="span">
            <template #link>
              <a
                href="https://aide.dossierfacile.logement.gouv.fr/fr/article/liste-des-documents-a-fournir-scnv25/"
                :title="`${t('callout.list.link-1')} - ${t('new-window')}`"
                rel="noopener"
                target="_blank"
                >{{ t('callout.list.link-1') }}</a
              >
            </template>
          </i18n-t>
        </li>
        <li>
          <i18n-t keypath="callout.list.item-2" tag="span">
            <template #link-1>
              <a
                href="https://aide.dossierfacile.logement.gouv.fr/fr/article/comment-constituer-un-dossier-de-location-en-couple-26ajqi/"
                :title="`${t('callout.list.link-2-1')} - ${t('new-window')}`"
                rel="noopener"
                target="_blank"
                >{{ t('callout.list.link-2-1') }}</a
              >
            </template>
            <template #link-2>
              <a
                href="https://aide.dossierfacile.logement.gouv.fr/fr/article/comment-constituer-un-dossier-de-location-en-famille-ou-entre-amies-ow7uhc/"
                :title="`${t('callout.list.link-2-2')} - ${t('new-window')}`"
                rel="noopener"
                target="_blank"
                >{{ t('callout.list.link-2-2') }}</a
              >
            </template>
          </i18n-t>
        </li>
        <li>
          <i18n-t keypath="callout.list.item-3" tag="span">
            <template #link>
              <a
                href="https://aide.dossierfacile.logement.gouv.fr/fr/article/gestion-des-donnees-et-securite-new-1d3d36d/"
                :title="`${t('callout.list.link-3')} - ${t('new-window')}`"
                rel="noopener"
                target="_blank"
                >{{ t('callout.list.link-3') }}</a
              >
            </template>
          </i18n-t>
        </li>
      </ul>
      <a
        class="fr-btn"
        href="https://aide.dossierfacile.logement.gouv.fr/fr/"
        :title="`${t('callout.CTA')} - ${t('new-window')}`"
        rel="noopener"
        target="_blank"
        @click="accordionClicked('contact_need_information')"
        >{{ t('callout.CTA') }}</a
      >
    </div>

    <div class="fr-background-alt--blue-france fr-px-1w fr-pt-2w fr-px-md-3w">
      <h2 class="fr-text-title--blue-france fr-h6">{{ t('choice.title') }}</h2>

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

    <div class="fr-mt-5w">
      <TenantHelpAccordion
        v-if="contactFormData.profile === 'tenant'"
        @accordion-clicked="accordionClicked"
      ></TenantHelpAccordion>
      <OwnerHelpAccordion
        v-if="contactFormData.profile === 'owner'"
        @accordion-clicked="accordionClicked"
      ></OwnerHelpAccordion>
    </div>

    <NakedCard class="fr-mt-3w fr-px-1v fr-px-md-3w">
      <h2 class="fr-h4">{{ t('form.title') }}</h2>
      <p>
        {{ t('form.subtitle') }}
      </p>
      <RequiredFieldsInstruction all-required />
      <ContactForm :profile :user @on-submit="submitForm" />
    </NakedCard>

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
        :title="`${t('consult-our-documentation')} - ${t('new-window')}`"
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
import { computed, onMounted, ref, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import type { DsfrRadioButtonOptions } from '@gouvminint/vue-dsfr'
import { DsfrRadioButtonSet } from '@gouvminint/vue-dsfr'
import ContactForm from './form/ContactForm.vue'

import tenantPicto from '@gouvfr/dsfr/dist/artwork/pictograms/document/document.svg'
import ownerPicto from '@gouvfr/dsfr/dist/artwork/pictograms/buildings/house.svg'
import RequiredFieldsInstruction from './form/RequiredFieldsInstruction.vue'
import DsfrModalPatch from './patches/DsfrModalPatch.vue'
import NakedCard from './NakedCard.vue'

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
  const searchParams = new URLSearchParams(globalThis.location.search)
  if (searchParams.get('open') === 'form') {
    isFormOpen.value = true
  }
})

const options: ComputedRef<DsfrRadioButtonOptions> = computed(() => [
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
])

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
/* radios auto layout */
:deep(.fr-fieldset__element--inline) {
  flex: 1;
}
</style>

<i18n lang="json">
{
  "en": {
    "title": "How can we help you ?",
    "callout": {
      "title": "Do you need information?",
      "list": {
        "title": "Our online help offers a lot of information:",
        "item-1": "documentation, such as {link} to create a DossierFacile",
        "link-1": "the list of documents to provide",
        "item-2": "tutorials: how to create a {link-1} How to create a {link-2}",
        "link-2-1": "DossierFacile as a couple?",
        "link-2-2": "DossierFacile with a cotenant?",
        "item-3": "more general information, like the {link} for example",
        "link-3": "security of your documents"
      },
      "CTA": "See our online help"
    },
    "choice": {
      "title": "What is your situation?",
      "legend": "You created…",
      "tenant": "A tenant file",
      "owner": "An owner account"
    },
    "form": {
      "title": "Can't find the answer to your question?",
      "subtitle": "If your question is not listed here, you can contact our support team using this form."
    },
    "message-error-title": "Something went wrong with the form.",
    "message-error-text": "Please send us an email at: contact{'@'}dossierFacile.fr",
    "consult-our-documentation": "Consult our documentation",
    "message-sent-title": "Thank you !",
    "message-sent-text": "We will do our best to answer you fast. Please consider to "
  },
  "fr": {
    "title": "Comment pouvons-nous vous aider ?",
    "callout": {
      "title": "Vous avez besoin de renseignements ?",
      "list": {
        "title": "Notre aide en ligne rassemble de nombreuses informations :",
        "item-1": "de la documentation, comme {link} pour créer un DossierFacile",
        "link-1": "la liste des documents à fournir",
        "item-2": "des tutoriels : comment créer un {link-1} Comment créer un {link-2}",
        "link-2-1": "DossierFacile en couple ?",
        "link-2-2": "DossierFacile en colocation ?",
        "item-3": "des informations plus générales, comme la {link} par exemple",
        "link-3": "sécurité de vos documents"
      },
      "CTA": "Consulter notre aide en ligne"
    },
    "choice": {
      "title": "Quelle est votre situation?",
      "legend": "Vous avez créé…",
      "tenant": "Un dossier locataire",
      "owner": "Un compte propriétaire"
    },
    "form": {
      "title": "Je ne trouve pas la réponse à ma question",
      "subtitle": "Si votre question ne figure pas dans cette liste, vous pouvez contacter notre équipe d’assistance en utilisant ce formulaire."
    },
    "message-error-title": "L'envoi du formulaire a échoué.",
    "message-error-text": "Contactez-nous par mail ici: contact{'@'}dossierFacile.fr",
    "consult-our-documentation": "Consulter notre documentation",
    "message-sent-title": "C'est tout bon. Votre message est bien arrivé !",
    "message-sent-text": "Nous nous efforçons de vous répondre dans les meilleurs délais. D'ici là n'hésitez pas à"
  }
}
</i18n>
