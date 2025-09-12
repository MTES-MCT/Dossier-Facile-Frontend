<template>
  <DsfrAccordionsGroup @update:model-value="accordionClicked">
    <AccordionItem :title="t('title-1')">
      <p class="fr-mb-0">{{ t('content-1-1') }}</p>
      <p>{{ t('content-1-2') }}</p>
      <div class="fr-highlight">
        <i18n-t tag="p" keypath="need-more-information">
          <template #faq>
            <a :href="`${HELP_URL}category/proprietaire-cyzg3f/`" target="_blank">FAQ</a>
          </template>
          <template #online-help>
            <a :href="HELP_URL" target="_blank">{{ t('online-help') }}</a>
          </template>
        </i18n-t>
      </div>
    </AccordionItem>
    <AccordionItem :title="t('title-2')">
      <i18n-t tag="p" keypath="content-2">
        <a
          :href="`${HELP_URL}article/candidater-au-bien-dun-proprietaire-1u59jkz/`"
          target="_blank"
          >{{ t('our-help-page') }}</a
        >
      </i18n-t>
      <div class="fr-highlight">
        <i18n-t tag="p" keypath="need-more-information">
          <template #faq>
            <a :href="`${HELP_URL}category/proprietaire-cyzg3f/`" target="_blank">FAQ</a>
          </template>
          <template #online-help>
            <a :href="HELP_URL" target="_blank">{{ t('online-help') }}</a>
          </template>
        </i18n-t>
      </div>
    </AccordionItem>
    <AccordionItem :title="t('title-3')">
      <i18n-t tag="p" keypath="content-3">
        <template #owner-area>
          <a href="https://proprietaire.dossierfacile.logement.gouv.fr/" target="_blank">{{
            t('owner-area')
          }}</a>
        </template>
        <template #sign-in>
          <a href="https://proprietaire.dossierfacile.logement.gouv.fr/home" target="_blank">{{
            t('sign-in')
          }}</a>
        </template>
      </i18n-t>
      <div class="fr-highlight">
        <i18n-t tag="p" keypath="highlight-3">
          <a
            href="https://proprietaire.dossierfacile.logement.gouv.fr/mot-de-passe-oublie"
            target="_blank"
            >{{ t('reset-password') }}</a
          >
        </i18n-t>
      </div>
    </AccordionItem>
  </DsfrAccordionsGroup>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { DsfrAccordionsGroup } from '@gouvminint/vue-dsfr'
import AccordionItem from './AccordionItem.vue'

const HELP_URL = 'https://aide.dossierfacile.logement.gouv.fr/fr/'
const TAGS = ['contact_why_no_view_folder', 'contact_where_folder', 'contact_connect_owner']

const { t } = useI18n()
const emit = defineEmits<{ 'accordion-clicked': [tag: string] }>()

function accordionClicked(index: number) {
  emit('accordion-clicked', TAGS[index])
}
</script>

<i18n>
{
  "en": {
    "title-1": "Why can't I view the files sent by candidates?",
    "content-1-1": "You can only view files that have been validated by our team.",
    "content-1-2": "You cannot view files that are being filled out, being processed, or have been rejected.",
    "need-more-information": "Need more information? Check out the {faq} in our {online-help} for landlords.",
    "online-help": "online-help",
    "title-2": "A candidate sent me their validated file but I can't see it on the site?",
    "content-2": "The candidate needs to join your landlord space. You can send them the link to {0}.",
    "our-help-page": "our help page on this topic",
    "title-3": "I can't log into my landlord account.",
    "content-3": "Go to the {owner-area} and click the {sign-in} button at the top of the page.",
    "owner-area": "Owner area",
    "sign-in": "Sign-in",
    "highlight-3": "Your email address and password are not working? We recommend {0}.",
    "reset-password": "resetting your password"
  },
  "fr": {
    "title-1" : "Pourquoi ne puis-je pas consulter les dossiers envoyés par les candidats ?",
    "content-1-1": "Vous ne pouvez consulter que les dossiers validés par notre équipe.",
    "content-1-2": "Vous ne pouvez pas consulter les dossiers en cours de remplissage, en cours de traitement ou refusés.",
    "need-more-information": "Vous avez besoin de plus d’informations ? Consultez la {faq} de notre {online-help} destinée aux propriétaires.",
    "online-help": "aide en ligne",
    "title-2" : "Un candidat m’a envoyé son dossier validé mais je ne le vois pas sur le site ?",
    "content-2": "Le candidat doit rejoindre votre espace propriétaire. Vous pouvez lui envoyer le lien vers {0}.",
    "our-help-page": "notre page d’aide à ce sujet",
    "title-3" : "Je n’arrive pas à me connecter à mon compte propriétaire.",
    "content-3": "Rendez-vous dans l’{owner-area} du site et cliquez sur le bouton {sign-in} en haut de la page.",
    "owner-area": "espace propriétaire",
    "sign-in": "Se connecter",
    "highlight-3": "Votre adresse e-mail et votre mot de passe ne fonctionnent pas ? Nous vous recommandons de {0}.",
    "reset-password": "réinitialiser votre mot de passe"
  }
}
</i18n>
