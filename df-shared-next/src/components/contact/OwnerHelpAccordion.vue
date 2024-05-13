<template>
<HelpAccordion :elements="elements"></HelpAccordion>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import HelpAccordion from './HelpAccordion.vue';


const { t } = useI18n();

const elements = [
    {
        id: 'element-1',
        title: t('title-1'),
        content: t('content-1'),
        highlight: t('highlight-1'),
    },
    {
        id: 'element-2',
        title: t('title-2'),
        content: t('content-2'),
        highlight: t('highlight-2'),
    },
    {
        id: 'element-3',
        title: t('title-3'),
        content: t('content-3'),
        highlight: t('highlight-3'),
    },
]

</script>


<i18n>
{
  "en": {
    "title-1" : "Fields with {asterix} are required."
  },
  "fr": {
    "title-1" : "Pourquoi ne puis-je pas consulter les dossiers envoyés par les candidats ?",
    "content-1": "Vous ne pouvez pas consulter les dossiers en cours de remplissage, en cours de traitement ou refusés. Vous ne pouvez consulter que les dossiers validés par notre équipe.",
    "highlight-1": "Vous avez besoin de plus d’informations ? Consultez la <a href='https://docs.dossierfacile.logement.gouv.fr/category/125-faq-proprietaire' target='_blank'>FAQ</a> de notre <a href='https://docs.dossierfacile.logement.gouv.fr/' target='_blank'>aide en ligne</a> destinée aux propriétaires.",
    "title-2" : "Un candidat m’a envoyé son dossier validé mais je ne le vois pas sur le site ?",
    "content-2": "Le candidat doit rejoindre votre espace propriétaire. Vous pouvez lui envoyer le lien vers <a href='https://dossierfacile.helpscoutdocs.com/article/39-candidater-au-bien-dun-proprietaire' target='_blank'>notre page d’aide à ce sujet</a>.",
    "highlight-2": "Vous avez besoin de plus d’informations ? Consultez la <a href='https://docs.dossierfacile.logement.gouv.fr/category/125-faq-proprietaire' target='_blank'>FAQ</a> de notre <a href='https://docs.dossierfacile.logement.gouv.fr/' target='_blank'>aide en ligne</a> destinée aux propriétaires.",
    "title-3" : "Je n’arrive pas à me connecter à mon compte propriétaire.",
    "content-3": "Rendez-vous dans l’<a href='https://proprietaire.dossierfacile.logement.gouv.fr/' target='_blank'>espace propriétaire</a> et connectez-vous. Vous pouvez laisser l’adresse e-mail et le mot de passe de votre espace propriétaire du site et cliquez sur le bouton <a href='https://proprietaire.dossierfacile.logement.gouv.fr/home' target='_blank'>se connecter</a> en haut de la page.",
    "highlight-3": "Votre adresse e-mail et votre mot de passe ne fonctionnent pas ? Nous vous recommandons de <a href='https://proprietaire.dossierfacile.logement.gouv.fr/mot-de-passe-oublie' target='_blank'>réinitialiser votre mot de passe</a>.",
  }
}
</i18n>



 