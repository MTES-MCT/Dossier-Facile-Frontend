<template>
  <Card>
    <template v-slot:header>
      {{ $t("title") }}
    </template>
    <template v-slot:body>
      <p v-html="$t('paragraph1')"></p>
      <p v-html="$t('paragraph2')"></p>
      <p v-html="$t('paragraph3')"></p>
    </template>
  </Card>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Card from "df-shared/src/components/Card.vue";

@Component({
  components: { Card }
})
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
"title": "Aide",
"paragraph1": "Attention, veuillez renseigner les informations et les documents <b>de la personne dont le nom sera sur le bail de location.</b>",
"paragraph2": "<b>Toute demande dont l’identité du locataire n’est pas correcte ne sera pas instruite.<b>",
"paragraph3": "Exemple 1 : si vous êtes étudiant mais que ce sont <b>vos parents qui signent le bail et paient le loyer</b>, les informations et les pièces demandées sont celles des parents. Exemple 2 : si vous aidez une personne à remplir le formulaire mais que c’est elle le futur locataire, les informations et les pièces demandées sont celles de la personne que vous aidez."
},
"fr": {
"title": "Aide",
"paragraph1": "Attention, veuillez renseigner les informations et les documents <b>de la personne dont le nom sera sur le bail de location.</b>",
"paragraph2": "<b>Toute demande dont l’identité du locataire n’est pas correcte ne sera pas instruite.<b>",
"paragraph3": "Exemple 1 : si vous êtes étudiant mais que ce sont <b>vos parents qui signent le bail et paient le loyer</b>, les informations et les pièces demandées sont celles des parents.<br> Exemple 2 : si vous aidez une personne à remplir le formulaire mais que c’est elle le futur locataire, les informations et les pièces demandées sont celles de la personne que vous aidez."
}
}
</i18n>
