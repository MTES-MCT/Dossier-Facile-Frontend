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
export default class GuarantorChoiceHelp extends Vue {
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
    "paragraph1": "Un garant (ou caution) est une personne physique ou morale qui s’engage envers le propriétaire du logement loué à payer les dettes locatives du locataire.<br> Plus d’informations sur <a target='_blank' href='https://www.service-public.fr/particuliers/vosdroits/F31267'>https://www.service-public.fr/particuliers/vosdroits/F31267</a>",
    "paragraph2": "Certains organismes peuvent aussi constituer une garantie, obtenez gratuitement une garantie Visale sur <a target='_blank' href='www.visale.fr'>www.visale.fr</a> !",
    "paragraph3": "Attention : vous <b>n’êtes pas obligé‧e d’ajouter un garant.</b> Cependant, certains propriétaires peuvent en exiger un."
  },
  "fr": {
    "title": "Aide",
    "paragraph1": "Un garant (ou caution) est une personne physique ou morale qui s’engage envers le propriétaire du logement loué à payer les dettes locatives du locataire.<br> Plus d’informations sur <a target='_blank' href='https://www.service-public.fr/particuliers/vosdroits/F31267'>https://www.service-public.fr/particuliers/vosdroits/F31267</a>",
    "paragraph2": "Certains organismes peuvent aussi constituer une garantie, obtenez gratuitement une garantie Visale sur <a target='_blank' href='https://www.visale.fr'>www.visale.fr</a> !",
    "paragraph3": "Attention : vous <b>n’êtes pas obligé‧e d’ajouter un garant.</b> Cependant, certains propriétaires peuvent en exiger un."
  }
}
</i18n>
