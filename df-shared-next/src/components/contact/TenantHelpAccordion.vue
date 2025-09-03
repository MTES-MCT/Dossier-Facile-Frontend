<template>
  <DsfrAccordionsGroup @update:model-value="accordionClicked">
    <AccordionItem :title="t('title-1')">
      <i18n-t tag="p" keypath="content-1">
        <a href="https://locataire.dossierfacile.fr/messaging" target="_blank">{{
          t('your-messaging')
        }}</a>
      </i18n-t>
      <div class="fr-highlight">
        <i18n-t tag="p" keypath="highlight-1">
          <template #correct-df>
            <a
              :href="`${HELP_URL}article/pourquoi-modifier-mon-dossier-et-comment-le-faire-493qkc/`"
              target="_blank"
              >{{ t('correct-df') }}</a
            >
          </template>
          <template #tutorial>
            <a
              :href="`${HELP_URL}article/pourquoi-modifier-mon-dossier-et-comment-le-faire-493qkc/`"
              target="_blank"
              >{{ t('video-tutorial') }}</a
            >
          </template>
          <template #online-help>
            <a :href="HELP_URL" target="_blank">{{ t('online-help') }}</a>
          </template>
        </i18n-t>
      </div>
    </AccordionItem>
    <AccordionItem :title="t('title-2')">
      <p class="fr-mb-0">{{ t('content-2-1') }}</p>
      <p>{{ t('content-2-2') }}</p>
      <div class="fr-highlight">
        <i18n-t tag="p" keypath="highlight-2">
          <template #create-rental>
            <a
              :href="`${HELP_URL}article/comment-constituer-un-dossier-de-location-en-famille-ou-entre-amies-ow7uhc/`"
              target="_blank"
              >{{ t('create-rental') }}</a
            >
          </template>
          <template #online-help>
            <a :href="HELP_URL" target="_blank">{{ t('online-help') }}</a>
          </template>
        </i18n-t>
      </div>
    </AccordionItem>
    <AccordionItem :title="t('title-3')">
      <i18n-t tag="p" keypath="content-3">
        <a href="https://locataire.dossierfacile.logement.gouv.fr/applications" target="_blank">{{
          t('share-file')
        }}</a>
      </i18n-t>
      <div class="fr-highlight">
        <i18n-t tag="p" keypath="highlight-3">
          <template #view>
            <a
              :href="`${HELP_URL}article/comment-visualiser-et-partager-son-dossier-valide-1orckmm/#2-comment-partager-par-mail-son-dossierfacile-sans-justificatif-avec-un-proprietaire-ou-un-bailleur`"
              target="_blank"
              >{{ t('view-file') }}</a
            >
          </template>
          <template #online-help>
            <a :href="HELP_URL" target="_blank">{{ t('online-help') }}</a>
          </template>
        </i18n-t>
      </div>
    </AccordionItem>
    <AccordionItem :title="t('title-4')">
      <p>{{ t('content-4') }}</p>
      <div class="fr-highlight">
        <i18n-t tag="p" keypath="highlight-4">
          <template #separate-accounts>
            <a
              :href="`${HELP_URL}article/utilisation-de-franceconnect-dans-dossierfacile-p7fiv0/#2-dissocier-votre-compte-dossierfacile-de-votre-compte-franceconnect-pour-changer-lidentite-du-titulaire-du-dossier`"
              target="_blank"
              >{{ t('separate-accounts') }}</a
            >
          </template>
          <template #online-help>
            <a :href="HELP_URL" target="_blank">{{ t('online-help') }}</a>
          </template>
        </i18n-t>
      </div>
    </AccordionItem>
    <AccordionItem :title="t('title-5')">
      <p>{{ t('content-5') }}</p>
      <div class="fr-highlight">
        <i18n-t tag="p" keypath="highlight-5">
          <template #what-is-df>
            <a
              :href="`${HELP_URL}article/dossierfacile-simplifiez-votre-dossier-de-location-dvw117/#1-ce-que-dossierfacile-ne-fait-pas`"
              target="_blank"
              >{{ t('what-is-df') }}</a
            >
          </template>
          <template #online-help>
            <a :href="HELP_URL" target="_blank">{{ t('online-help') }}</a>
          </template>
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
const TAGS = [
  'contact_why_denied',
  'contact_why_colocation_incomplete',
  'contact_how_send_df',
  'contact_how_create_child',
  'contact_where_offers'
]

const { t } = useI18n()
const emit = defineEmits<{ 'accordion-clicked': [tag: string] }>()

function accordionClicked(index: number) {
  emit('accordion-clicked', TAGS[index])
}
</script>

<i18n>
{
  "en": {
    "title-1": "Why was my file rejected?",
    "content-1": "Our team reviewed your file and rejected it. Check our comments in {0} and correct the indicated errors.",
    "your-messaging": "your messaging",
    "highlight-1": "Need more information? Check out the {correct-df} page or the {tutorial} in our {online-help}.",
    "correct-df": "Correct a DossierFacile",
    "video-tutorial": "video tutorial",
    "online-help": "online help",
    "title-2": "Why is my roommate file incomplete even though it has been validated?",
    "content-2-1": "Your file is validated, but your roommate's (or roommates') file is not validated. Your shared file will be complete and shareable once all roommates' files are validated.",
    "content-2-2": "We recommend contacting your roommate(s) for more information.",
    "highlight-2": "Need more information? Check out the {create-rental} page in our {online-help}.",
    "create-rental": "Creating a rental file with family or friends",
    "title-3": "How do I send my DossierFacile to a landlord?",
    "content-3": "To send your DossierFacile to a landlord, go to the {0} page. If you have their email address, you can send it directly via email. Otherwise, you can send them a simple link to your DossierFacile.",
    "share-file": "Share your file",
    "highlight-3": "Need more information? Check out the {view} page in our {online-help}.",
    "view-file": "View and share your validated file",
    "title-4": "How do I create a DossierFacile for my child?",
    "content-4": "A DossierFacile must be in the name of the person who signs the lease. If your child occupies the accommodation, the DossierFacile must be in their name.",
    "highlight-4": "Did you use your FranceConnect account to create your child's file, and our team rejected your file? You need to separate your FranceConnect and DossierFacile accounts. Check out the {separate-accounts} page in our {online-help}.",
    "separate-accounts": "Separate your FranceConnect and DossierFacile accounts",
    "title-5": "Where are your rental property listings?",
    "content-5": "DossierFacile does not offer properties for rent. DossierFacile only helps you create a clear, complete, and coherent digital rental file that you can then send to different landlords.",
    "highlight-5": "Need more information? Check out the {what-is-df} page in our {online-help}.",
    "what-is-df": "What is DossierFacile?"
  },
  "fr": {
    "title-1" : "Pourquoi mon dossier a-t-il été refusé ?",
    "content-1": "Notre équipe a examiné votre dossier et l’a refusé. Consultez nos commentaires dans {0} et corrigez les erreurs indiquées.",
    "your-messaging": "votre messagerie",
    "highlight-1": "Vous avez besoin de plus d’informations ? Consultez la page {correct-df} ou le {tutorial} de notre {online-help}.",
    "correct-df": "Corriger un DossierFacile",
    "video-tutorial": "tutoriel vidéo",
    "online-help": "aide en ligne",
    "title-2" : "Pourquoi mon dossier de colocation est-il incomplet alors qu’il a été validé ?",
    "content-2-1": "Votre dossier est validé, mais le dossier de votre colocataire (ou de vos colocataires) n’est pas validé. Votre dossier commun sera complet et partageable lorsque les dossiers de tous les colocataires seront validés.",
    "content-2-2": "Nous vous recommandons de contacter votre colocataire (ou vos colocataires) afin d’en savoir plus.",
    "highlight-2": "Vous avez besoin de plus d’informations ? Consultez la page {create-rental} de notre {online-help}.",
    "create-rental": "Constituer un dossier de location en famille ou entre amis",
    "title-3" : "Comment envoyer mon DossierFacile à un propriétaire ?",
    "content-3": "Pour envoyer votre DossierFacile à un propriétaire, rendez-vous sur la page {0}. Si vous avez son adresse e-mail, vous pouvez lui envoyer directement par e-mail. Sinon, vous pouvez lui envoyer un simple lien vers votre DossierFacile.",
    "share-file": "Partager votre dossier",
    "highlight-3": "Vous avez besoin de plus d’informations ? Consultez la page {view} de notre {online-help}.",
    "view-file": "Visualiser et partager son dossier validé",
    "title-4" : "Comment créer un DossierFacile pour mon enfant ?",
    "content-4": "Un DossierFacile doit porter le nom de la personne qui signe le bail. Si votre enfant occupe le logement, le DossierFacile doit être à son nom.",
    "highlight-4": "Vous avez utilisé votre compte FranceConnect pour créer le dossier de votre enfant, et notre équipe a refusé votre dossier ? Vous devez séparer vos comptes FranceConnect et DossierFacile. Consultez la page {separate-accounts} de notre {online-help}.",
    "separate-accounts": "Séparer vos comptes FranceConnect et DossierFacile",
    "title-5" : "Où sont vos offres de logement en location ?",
    "content-5": "DossierFacile ne propose pas de logements. DossierFacile vous aide seulement à constituer un dossier de location numérique clair, complet et cohérent que vous pouvez ensuite envoyer à différents propriétaires.",
    "highlight-5": "Vous avez besoin de plus d’informations ? Consultez la page {what-is-df} de notre {online-help}.",
    "what-is-df": "DossierFacile c’est quoi ?"
  }
}
</i18n>
