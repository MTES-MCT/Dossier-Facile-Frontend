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
    {
        id: 'element-4',
        title: t('title-4'),
        content: t('content-4'),
        highlight: t('highlight-4'),
    },
    {
        id: 'element-5',
        title: t('title-5'),
        content: t('content-5'),
        highlight: t('highlight-5'),
    }
]

</script>


<i18n>
{
  "en": {
    "title-1" : "Fields with {asterix} are required."
  },
  "fr": {
    "title-1" : "Pourquoi mon dossier a-t-il été refusé ?",
    "content-1": "Notre équipe a examiné votre dossier et l’a refusé. Consultez nos commentaires dans votre messagerie et corrigez les erreurs indiquées.",
    "highlight-1": "Vous avez besoin de plus d’informations ? Consultez la page Corriger un DossierFacile ou le tutoriel vidéo de notre aide en ligne.",
    "title-2" : "Pourquoi mon dossier de colocation est-il incomplet alors qu’il a été validé ?",
    "content-2": "Votre dossier est validé, mais le dossier de votre colocataire (ou de vos colocataires) n’est pas validé. Votre dossier commun sera complet et partageable lorsque les dossiers de tous les colocataires seront validés.<br>Nous vous recommandons de contacter votre colocataire (ou vos colocataires) afin d’en savoir plus.",
    "highlight-2": "Vous avez besoin de plus d’informations ? Consultez la page Constituer un dossier de location en famille ou entre amis de notre aide en ligne.",
    "title-3" : "Comment envoyer mon DossierFacile à un propriétaire ?",
    "content-3": "Pour envoyer votre DossierFacile à un propriétaire, rendez-vous sur la page Partager votre dossier. Si vous avez son adresse e-mail, vous pouvez lui envoyer directement par e-mail. Sinon, vous pouvez lui envoyer un simple lien vers votre DossierFacile.",
    "highlight-3": "Vous avez besoin de plus d’informations ? Consultez la page Visualiser et partager son dossier validé de notre aide en ligne.",
    "title-4" : "Comment créer un DossierFacile pour mon enfant ?",
    "content-4": "Un DossierFacile doit porter le nom de la personne qui signe le bail. Si votre enfant occupe le logement, le DossierFacile doit être à son nom.",
    "highlight-4": "Vous avez utilisé votre compte FranceConnect pour créer le dossier de votre enfant, et notre équipe a refusé votre dossier ? Vous devez séparer vos comptes FranceConnect et DossierFacile. Consultez la page Séparer vos comptes FranceConnect et DossierFacile de notre aide en ligne.",
    "title-5" : "Où sont vos offres de logement en location ?",
    "content-5": "DossierFacile ne propose pas de logements. DossierFacile vous aide seulement à constituer un dossier de location numérique clair, complet et cohérent que vous pouvez ensuite envoyer à différents propriétaires.",
    "highlight-5": "Vous avez besoin de plus d’informations ? Consultez la page DossierFacile c’est quoi ? de notre aide en ligne."
  }
}
</i18n>
