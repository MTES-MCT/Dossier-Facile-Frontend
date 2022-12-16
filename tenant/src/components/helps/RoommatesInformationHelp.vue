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
export default class RoommatesInformationHelp extends Vue {}
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
    "paragraph1": "By entering your roommate's email address, she/he will be able to create her/his own file with her/his documents. Your two folders will be linked and your folder-link will be common.",
    "paragraph2": "Concretely, your roommate will receive an invitation that he or she will have to validate within 48 hours.",
    "paragraph3": "If your roommate has not been able to confirm her/his registration within 48 hours, then you will have to start over!"
  },
  "fr": {
    "paragraph1": "En renseignant l’adresse email de votre colocataire, celui-ci va pouvoir constituer son propre dossier avec ses pièces. Vos deux dossiers seront liés et votre lien-dossier sera commun.",
    "paragraph2": "Concrètement, votre colocataire recevra une invitation qu’il ou elle devra valider dans les 48 heures.",
    "paragraph3": "Dans le cas ou votre colocataire n’a pas pu confirmer son inscription dans les 48 heures, vous devrez alors recommencer !"
  }
}
</i18n>
