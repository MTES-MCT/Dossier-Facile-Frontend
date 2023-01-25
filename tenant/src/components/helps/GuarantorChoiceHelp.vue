<template>
  <div>
    <p v-html="$t('guarantorchoicehelp.paragraph1')"></p>
    <p v-html="$t('guarantorchoicehelp.paragraph2')"></p>
    <p v-html="$t('guarantorchoicehelp.paragraph3')"></p>
  </div>
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

p {
  overflow-wrap: break-word;
  word-wrap: break-word;
}
</style>

<i18n>
{
  "en": {
    "paragraph1": "A guarantor (or surety) is a natural or legal person who undertakes to the owner of the rented accommodation to pay the rental debts of the tenant. <br> More information on <a target = '_ blank' href = 'https: //www.service-public.fr/particuliers/vosdroits/F31267'>https://www.service-public.fr/particuliers/vosdroits/F31267</a>",
    "paragraph2": "Certains organismes peuvent aussi constituer une garantie, obtenez gratuitement une garantie Visale sur <a target='_blank' href='www.visale.fr'>www.visale.fr</a> !",
    "paragraph3": "Please note: you <b> do not have to add a guarantor. </b> However, some owners may require one."
  },
  "fr": {
    "paragraph1": "Un garant (ou caution) est une personne physique ou morale qui s’engage envers le propriétaire du logement loué à payer les dettes locatives du locataire.<br> Plus d’informations sur <a target='_blank' href='https://www.service-public.fr/particuliers/vosdroits/F31267'>https://www.service-public.fr/particuliers/vosdroits/F31267</a>",
    "paragraph2": "Certains organismes peuvent aussi constituer une garantie, obtenez gratuitement une garantie Visale sur <a target='_blank' href='https://www.visale.fr'>www.visale.fr</a> !",
    "paragraph3": "Attention : vous <b>n’êtes pas obligé‧e d’ajouter un garant.</b> Cependant, certains propriétaires peuvent en exiger un."
  }
}
</i18n>
