<template>
<HelpAccordion @accordion-clicked="accordionClicked" :elements="elements"></HelpAccordion>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import HelpAccordion from './HelpAccordion.vue';
import { AccordionHelpModel } from '@/models/AccordionHelpModel';


const { t } = useI18n();
const emit = defineEmits(["accordion-clicked"]);

function accordionClicked(tag: string) {
  emit('accordion-clicked', tag)
}

const elements = [
  {
    id: 'element-1',
    title: t('title-1'),
    content: t('content-1'),
    highlight: t('highlight-1'),
    tag: 'contact_why_denied'
  },
  {
    id: 'element-2',
    title: t('title-2'),
    content: t('content-2'),
    highlight: t('highlight-2'),
    tag: 'contact_why_colocation_incomplete'
  },
  {
    id: 'element-3',
    title: t('title-3'),
    content: t('content-3'),
    highlight: t('highlight-3'),
    tag: 'contact_how_send_df'
  },
  {
    id: 'element-4',
    title: t('title-4'),
    content: t('content-4'),
    highlight: t('highlight-4'),
    tag: 'contact_how_create_child'
  },
  {
    id: 'element-5',
    title: t('title-5'),
    content: t('content-5'),
    highlight: t('highlight-5'),
    tag: 'contact_where_offers'
  }
] as AccordionHelpModel[];

</script>


<i18n>
{
  "en": {
    "title-1" : "Fields with {asterix} are required."
  },
  "fr": {
    "title-1" : "Pourquoi mon dossier a-t-il été refusé ?",
    "content-1": "Notre équipe a examiné votre dossier et l’a refusé. Consultez nos commentaires dans <a href='https://locataire.dossierfacile.fr/messaging' target='_blank'>votre messagerie</a> et corrigez les erreurs indiquées.",
    "highlight-1": "Vous avez besoin de plus d’informations ? Consultez la page <a href='https://docs.dossierfacile.logement.gouv.fr/article/34-les-modifications-demandees' target='_blank'>Corriger un DossierFacile</a> ou le <a href='https://docs.dossierfacile.logement.gouv.fr/article/34-les-modifications-demandees#Tutoriel-vido-_CaV2' target='_blank'>tutoriel vidéo</a> de notre <a href='https://docs.dossierfacile.logement.gouv.fr/' target='_blank'>aide en ligne</a>.",
    "title-2" : "Pourquoi mon dossier de colocation est-il incomplet alors qu’il a été validé ?",
    "content-2": "Votre dossier est validé, mais le dossier de votre colocataire (ou de vos colocataires) n’est pas validé. Votre dossier commun sera complet et partageable lorsque les dossiers de tous les colocataires seront validés.<br>Nous vous recommandons de contacter votre colocataire (ou vos colocataires) afin d’en savoir plus.",
    "highlight-2": "Vous avez besoin de plus d’informations ? Consultez la page <a href='https://docs.dossierfacile.logement.gouv.fr/article/7-ajout-dun-colocataire' target='_blank'>Constituer un dossier de location en famille ou entre amis</a> de notre <a href='https://docs.dossierfacile.logement.gouv.fr/' target='_blank'>aide en ligne</a>.",
    "title-3" : "Comment envoyer mon DossierFacile à un propriétaire ?",
    "content-3": "Pour envoyer votre DossierFacile à un propriétaire, rendez-vous sur la page <a href='https://locataire.dossierfacile.logement.gouv.fr/applications' target='_blank'>Partager votre dossier</a>. Si vous avez son adresse e-mail, vous pouvez lui envoyer directement par e-mail. Sinon, vous pouvez lui envoyer un simple lien vers votre DossierFacile.",
    "highlight-3": "Vous avez besoin de plus d’informations ? Consultez la page <a href='https://docs.dossierfacile.logement.gouv.fr/article/90-visualiserpartagerson-dossier-valide#Visualiser-son-dossier-complet-avec-les-pices-s9OWQ' target='_blank'>Visualiser et partager son dossier validé</a> de notre <a href='https://docs.dossierfacile.logement.gouv.fr/' target='_blank'>aide en ligne</a>.",
    "title-4" : "Comment créer un DossierFacile pour mon enfant ?",
    "content-4": "Un DossierFacile doit porter le nom de la personne qui signe le bail. Si votre enfant occupe le logement, le DossierFacile doit être à son nom.",
    "highlight-4": "Vous avez utilisé votre compte FranceConnect pour créer le dossier de votre enfant, et notre équipe a refusé votre dossier ? Vous devez séparer vos comptes FranceConnect et DossierFacile. Consultez la page <a href='https://docs.dossierfacile.logement.gouv.fr/article/45-franceconnect#dissociation' target='_blank'>Séparer vos comptes FranceConnect et DossierFacile</a> de notre <a href='https://docs.dossierfacile.logement.gouv.fr/' target='_blank'>aide en ligne</a>.",
    "title-5" : "Où sont vos offres de logement en location ?",
    "content-5": "DossierFacile ne propose pas de logements. DossierFacile vous aide seulement à constituer un dossier de location numérique clair, complet et cohérent que vous pouvez ensuite envoyer à différents propriétaires.",
    "highlight-5": "Vous avez besoin de plus d’informations ? Consultez la page <a href='https://dossierfacile.helpscoutdocs.com/article/28-dossierfacile-ne-propose-pas-de-logements' target='_blank'>DossierFacile c’est quoi</a> ? de notre <a href='https://docs.dossierfacile.logement.gouv.fr/' target='_blank'>aide en ligne</a>."
  }
}
</i18n>
