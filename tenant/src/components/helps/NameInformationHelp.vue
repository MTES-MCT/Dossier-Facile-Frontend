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
export default class NameInformationHelp extends Vue {
  expanded = false;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.hidden {
  display: none;
}
</style>

<i18n>
{
"en": {
"title": "Help",
"paragraph1": "Attention, please fill in the information and documents <b>of the person whose name will be on the rental agreement.</b>",
"paragraph2": "<b>Any request where the identity of the tenant is not correct will not be investigated.<b>",
"paragraph3": "Example 1: if you are a student but it is <b> your parents who sign the lease and pay the rent </b>, the information and documents requested are those of the parents. Example 2: If you help a person complete the form but they are the future tenant, the information and documents requested are those of the person you are helping."
},
"fr": {
"title": "Aide",
"paragraph1": "Attention, veuillez renseigner les informations et les documents <b>de la personne dont le nom sera sur le bail de location.</b>",
"paragraph2": "<b>Toute demande dont l’identité du locataire n’est pas correcte ne sera pas instruite.<b>",
"paragraph3": "Exemple 1 : si vous êtes étudiant mais que ce sont <b>vos parents qui signent le bail et paient le loyer</b>, les informations et les pièces demandées sont celles des parents.<br> Exemple 2 : si vous aidez une personne à remplir le formulaire mais que c’est elle le futur locataire, les informations et les pièces demandées sont celles de la personne que vous aidez."
}
}
</i18n>
