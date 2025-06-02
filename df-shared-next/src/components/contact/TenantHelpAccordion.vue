<template>
  <HelpAccordion :elements="elements" @accordion-clicked="accordionClicked" />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import HelpAccordion from './HelpAccordion.vue'
import { AccordionHelpModel } from '../../models/AccordionHelpModel'
import { computed } from 'vue'

const { t } = useI18n()
const emit = defineEmits<{ 'accordion-clicked': [tag: string] }>()

function accordionClicked(tag: string) {
  emit('accordion-clicked', tag)
}

const elements = computed(
  () =>
    [
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
    ] satisfies AccordionHelpModel[]
)
</script>

<i18n>
{
  "en": {
    "title-1": "Why was my file rejected?",
    "content-1": "Our team reviewed your file and rejected it. Check our comments in <a href='https://locataire.dossierfacile.fr/messaging' target='_blank'>your messaging</a> and correct the indicated errors.",
    "highlight-1": "Need more information? Check out the <a href='https://aide.dossierfacile.logement.gouv.fr/fr/article/pourquoi-modifier-mon-dossier-et-comment-le-faire-493qkc/' target='_blank'>Correct a DossierFacile</a> page or the <a href='https://aide.dossierfacile.logement.gouv.fr/fr/article/pourquoi-modifier-mon-dossier-et-comment-le-faire-493qkc/' target='_blank'>video tutorial</a> in our <a href='https://aide.dossierfacile.logement.gouv.fr/fr/' target='_blank'>online help</a>.",
    "title-2": "Why is my roommate file incomplete even though it has been validated?",
    "content-2": "Your file is validated, but your roommate's (or roommates') file is not validated. Your shared file will be complete and shareable once all roommates' files are validated.<br>We recommend contacting your roommate(s) for more information.",
    "highlight-2": "Need more information? Check out the <a href='https://aide.dossierfacile.logement.gouv.fr/fr/article/comment-constituer-un-dossier-de-location-en-famille-ou-entre-amies-ow7uhc/' target='_blank'>Creating a rental file with family or friends</a> page in our <a href='https://aide.dossierfacile.logement.gouv.fr/fr/' target='_blank'>online help</a>.",
    "title-3": "How do I send my DossierFacile to a landlord?",
    "content-3": "To send your DossierFacile to a landlord, go to the <a href='https://locataire.dossierfacile.logement.gouv.fr/applications' target='_blank'>Share your file</a> page. If you have their email address, you can send it directly via email. Otherwise, you can send them a simple link to your DossierFacile.",
    "highlight-3": "Need more information? Check out the <a href='https://aide.dossierfacile.logement.gouv.fr/fr/article/comment-visualiser-et-partager-son-dossier-valide-1orckmm/#2-comment-partager-par-mail-son-dossierfacile-sans-justificatif-avec-un-proprietaire-ou-un-bailleur' target='_blank'>View and share your validated file</a> page in our <a href='https://aide.dossierfacile.logement.gouv.fr/fr/' target='_blank'>online help</a>.",
    "title-4": "How do I create a DossierFacile for my child?",
    "content-4": "A DossierFacile must be in the name of the person who signs the lease. If your child occupies the accommodation, the DossierFacile must be in their name.",
    "highlight-4": "Did you use your FranceConnect account to create your child's file, and our team rejected your file? You need to separate your FranceConnect and DossierFacile accounts. Check out the <a href='https://aide.dossierfacile.logement.gouv.fr/fr/article/utilisation-de-franceconnect-dans-dossierfacile-p7fiv0/#2-dissocier-votre-compte-dossierfacile-de-votre-compte-franceconnect-pour-changer-lidentite-du-titulaire-du-dossier' target='_blank'>Separate your FranceConnect and DossierFacile accounts</a> page in our <a href='https://aide.dossierfacile.logement.gouv.fr/fr/' target='_blank'>online help</a>.",
    "title-5": "Where are your rental property listings?",
    "content-5": "DossierFacile does not offer properties for rent. DossierFacile only helps you create a clear, complete, and coherent digital rental file that you can then send to different landlords.",
    "highlight-5": "Need more information? Check out the <a href='https://aide.dossierfacile.logement.gouv.fr/fr/article/dossierfacile-simplifiez-votre-dossier-de-location-dvw117/#1-ce-que-dossierfacile-ne-fait-pas' target='_blank'>What is DossierFacile?</a> page in our <a href='https://aide.dossierfacile.logement.gouv.fr/fr/' target='_blank'>online help</a>."
  },
  "fr": {
    "title-1" : "Pourquoi mon dossier a-t-il été refusé ?",
    "content-1": "Notre équipe a examiné votre dossier et l’a refusé. Consultez nos commentaires dans <a href='https://locataire.dossierfacile.fr/messaging' target='_blank'>votre messagerie</a> et corrigez les erreurs indiquées.",
    "highlight-1": "Vous avez besoin de plus d’informations ? Consultez la page <a href='https://aide.dossierfacile.logement.gouv.fr/fr/article/pourquoi-modifier-mon-dossier-et-comment-le-faire-493qkc/' target='_blank'>Corriger un DossierFacile</a> ou le <a href='https://aide.dossierfacile.logement.gouv.fr/fr/article/pourquoi-modifier-mon-dossier-et-comment-le-faire-493qkc/' target='_blank'>tutoriel vidéo</a> de notre <a href='https://aide.dossierfacile.logement.gouv.fr/fr/' target='_blank'>aide en ligne</a>.",
    "title-2" : "Pourquoi mon dossier de colocation est-il incomplet alors qu’il a été validé ?",
    "content-2": "Votre dossier est validé, mais le dossier de votre colocataire (ou de vos colocataires) n’est pas validé. Votre dossier commun sera complet et partageable lorsque les dossiers de tous les colocataires seront validés.<br>Nous vous recommandons de contacter votre colocataire (ou vos colocataires) afin d’en savoir plus.",
    "highlight-2": "Vous avez besoin de plus d’informations ? Consultez la page <a href='https://aide.dossierfacile.logement.gouv.fr/fr/article/comment-constituer-un-dossier-de-location-en-famille-ou-entre-amies-ow7uhc/' target='_blank'>Constituer un dossier de location en famille ou entre amis</a> de notre <a href='https://aide.dossierfacile.logement.gouv.fr/fr/' target='_blank'>aide en ligne</a>.",
    "title-3" : "Comment envoyer mon DossierFacile à un propriétaire ?",
    "content-3": "Pour envoyer votre DossierFacile à un propriétaire, rendez-vous sur la page <a href='https://locataire.dossierfacile.logement.gouv.fr/applications' target='_blank'>Partager votre dossier</a>. Si vous avez son adresse e-mail, vous pouvez lui envoyer directement par e-mail. Sinon, vous pouvez lui envoyer un simple lien vers votre DossierFacile.",
    "highlight-3": "Vous avez besoin de plus d’informations ? Consultez la page <a href='https://aide.dossierfacile.logement.gouv.fr/fr/article/comment-visualiser-et-partager-son-dossier-valide-1orckmm/#2-comment-partager-par-mail-son-dossierfacile-sans-justificatif-avec-un-proprietaire-ou-un-bailleur' target='_blank'>Visualiser et partager son dossier validé</a> de notre <a href='https://aide.dossierfacile.logement.gouv.fr/fr/' target='_blank'>aide en ligne</a>.",
    "title-4" : "Comment créer un DossierFacile pour mon enfant ?",
    "content-4": "Un DossierFacile doit porter le nom de la personne qui signe le bail. Si votre enfant occupe le logement, le DossierFacile doit être à son nom.",
    "highlight-4": "Vous avez utilisé votre compte FranceConnect pour créer le dossier de votre enfant, et notre équipe a refusé votre dossier ? Vous devez séparer vos comptes FranceConnect et DossierFacile. Consultez la page <a href='https://aide.dossierfacile.logement.gouv.fr/fr/article/utilisation-de-franceconnect-dans-dossierfacile-p7fiv0/#2-dissocier-votre-compte-dossierfacile-de-votre-compte-franceconnect-pour-changer-lidentite-du-titulaire-du-dossier' target='_blank'>Séparer vos comptes FranceConnect et DossierFacile</a> de notre <a href='https://aide.dossierfacile.logement.gouv.fr/fr/' target='_blank'>aide en ligne</a>.",
    "title-5" : "Où sont vos offres de logement en location ?",
    "content-5": "DossierFacile ne propose pas de logements. DossierFacile vous aide seulement à constituer un dossier de location numérique clair, complet et cohérent que vous pouvez ensuite envoyer à différents propriétaires.",
    "highlight-5": "Vous avez besoin de plus d’informations ? Consultez la page <a href='https://aide.dossierfacile.logement.gouv.fr/fr/article/dossierfacile-simplifiez-votre-dossier-de-location-dvw117/#1-ce-que-dossierfacile-ne-fait-pas' target='_blank'>DossierFacile c’est quoi</a> ? de notre <a href='https://aide.dossierfacile.logement.gouv.fr/fr/' target='_blank'>aide en ligne</a>."
  }
}
</i18n>
