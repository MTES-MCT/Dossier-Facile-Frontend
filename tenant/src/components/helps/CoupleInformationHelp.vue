<template>
  <div>
    <p v-html="$t('paragraph1')"></p>
    <p v-html="$t('paragraph2')"></p>
    <p v-html="$t('paragraph3')"></p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class CoupleInformationHelp extends Vue {}
</script>

<style scoped lang="scss">
p {
  overflow-wrap: break-word;
  word-wrap: break-word;
}
</style>

<i18n>
{
  "en": {
    "paragraph1": "By entering your spouse's email address, they will be invited to contribute to the shared application file. They can register with their own credentials, and will be able to add, modify or delete the documents (both yours and theirs).",
    "paragraph2": "Note that your documents and your spouse's will be verified separately by DossierFacile. However, the shared file will be valid only when both sets of documents are approuved by DossierFacile. You will then have access to a link to share the application file.",
    "paragraph3": "Your spouse will receive an mail invite and must validate it within 48 hours. They will need to click on the link and choose a password, then they will have access to your shared file."
  },
  "fr": {
    "paragraph1": "En renseignant l’adresse email de votre conjoint, celui-ci sera invité à contribuer à la constitution de votre dossier commun. Avec ses propres identifiants email et mot de passe, il aura la possibilité de se connecter à votre dossier commun et d'ajouter, modifier ou supprimer toute pièce du dossier, ses pièces personnelles comme les vôtres.",
    "paragraph2": "Attention ! Vos pièces personnelles et ses pièces personnelles seront traitées séparément par DossierFacile. Vous pouvez ainsi les déposer et les faire valider indépendamment. Néanmoins, votre dossier commun ne sera validé dans son ensemble que lorsque vos pièces et ses pièces auront été validées par DossierFacile. Vous disposerez alors d'un unique lien de partage pour l'ensemble de votre dossier commun.",
    "paragraph3": "Concrètement, votre conjoint recevra une invitation par mail qu’il ou elle devra valider dans les 48 heures. Il n'aura qu'à cliquer sur le lien, définir son mot de passe, et il sera alors connecté à votre dossier commun."
  }
}
</i18n>
