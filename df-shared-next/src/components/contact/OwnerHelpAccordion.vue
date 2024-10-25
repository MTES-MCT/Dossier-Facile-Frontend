<template>
  <HelpAccordion @accordion-clicked="emit('accordion-clicked', $event)" :elements="elements" />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import HelpAccordion from './HelpAccordion.vue'
import { AccordionHelpModel } from '../../models/AccordionHelpModel'
import { computed } from 'vue'

const { t } = useI18n()
const emit = defineEmits<{ 'accordion-clicked': [tag: string] }>()

const elements = computed(
  () =>
    [
      {
        id: 'element-1',
        title: t('title-1'),
        content: t('content-1'),
        highlight: t('highlight-1'),
        tag: 'contact_why_no_view_folder'
      },
      {
        id: 'element-2',
        title: t('title-2'),
        content: t('content-2'),
        highlight: t('highlight-2'),
        tag: 'contact_where_folder'
      },
      {
        id: 'element-3',
        title: t('title-3'),
        content: t('content-3'),
        highlight: t('highlight-3'),
        tag: 'contact_connect_owner'
      }
    ] satisfies AccordionHelpModel[]
)
</script>

<i18n>
{
  "en": {
    "title-1": "Why can't I view the files sent by candidates?",
    "content-1": "You can only view files that have been validated by our team.<br>You cannot view files that are being filled out, being processed, or have been rejected.",
    "highlight-1": "Need more information? Check out the <a href='https://aide.dossierfacile.logement.gouv.fr/fr/category/proprietaire-cyzg3f/' target='_blank'>FAQ</a> in our <a href='https://aide.dossierfacile.logement.gouv.fr/fr/' target='_blank'>online help</a> for landlords.",
    "title-2": "A candidate sent me their validated file but I can't see it on the site?",
    "content-2": "The candidate needs to join your landlord space. You can send them the link to <a href='https://dossierfacile.helpscoutdocs.com/article/39-candidater-au-bien-dun-proprietaire' target='_blank'>our help page on this topic</a>.",
    "highlight-2": "Need more information? Check out the <a href='https://aide.dossierfacile.logement.gouv.fr/fr/category/proprietaire-cyzg3f/' target='_blank'>FAQ</a> in our <a href='https://aide.dossierfacile.logement.gouv.fr/fr/' target='_blank'>online help</a> for landlords.",
    "title-3": "I can't log into my landlord account.",
    "content-3": "Go to the <a href='https://proprietaire.dossierfacile.logement.gouv.fr/' target='_blank'>landlord space</a> and log in. You can enter the email address and password of your landlord space on the site and click the <a href='https://proprietaire.dossierfacile.logement.gouv.fr/home' target='_blank'>log in</a> button at the top of the page.",
    "highlight-3": "Your email address and password not working? We recommend <a href='https://proprietaire.dossierfacile.logement.gouv.fr/mot-de-passe-oublie' target='_blank'>resetting your password</a>."
  },
  "fr": {
    "title-1" : "Pourquoi ne puis-je pas consulter les dossiers envoyés par les candidats ?",
    "content-1": "Vous ne pouvez consulter que les dossiers validés par notre équipe.<br>Vous ne pouvez pas consulter les dossiers en cours de remplissage, en cours de traitement ou refusés.",
    "highlight-1": "Vous avez besoin de plus d’informations ? Consultez la <a href='https://aide.dossierfacile.logement.gouv.fr/fr/category/proprietaire-cyzg3f/' target='_blank'>FAQ</a> de notre <a href='https://aide.dossierfacile.logement.gouv.fr/fr/' target='_blank'>aide en ligne</a> destinée aux propriétaires.",
    "title-2" : "Un candidat m’a envoyé son dossier validé mais je ne le vois pas sur le site ?",
    "content-2": "Le candidat doit rejoindre votre espace propriétaire. Vous pouvez lui envoyer le lien vers <a href='https://dossierfacile.helpscoutdocs.com/article/39-candidater-au-bien-dun-proprietaire' target='_blank'>notre page d’aide à ce sujet</a>.",
    "highlight-2": "Vous avez besoin de plus d’informations ? Consultez la <a href='https://aide.dossierfacile.logement.gouv.fr/fr/category/proprietaire-cyzg3f/' target='_blank'>FAQ</a> de notre <a href='https://aide.dossierfacile.logement.gouv.fr/fr/' target='_blank'>aide en ligne</a> destinée aux propriétaires.",
    "title-3" : "Je n’arrive pas à me connecter à mon compte propriétaire.",
    "content-3": "Rendez-vous dans l’<a href='https://proprietaire.dossierfacile.logement.gouv.fr/' target='_blank'>espace propriétaire</a> et connectez-vous. Vous pouvez laisser l’adresse e-mail et le mot de passe de votre espace propriétaire du site et cliquez sur le bouton <a href='https://proprietaire.dossierfacile.logement.gouv.fr/home' target='_blank'>se connecter</a> en haut de la page.",
    "highlight-3": "Votre adresse e-mail et votre mot de passe ne fonctionnent pas ? Nous vous recommandons de <a href='https://proprietaire.dossierfacile.logement.gouv.fr/mot-de-passe-oublie' target='_blank'>réinitialiser votre mot de passe</a>.",
  }
}
</i18n>
