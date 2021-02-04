<template>
  <div>
    <NameInformationHelp v-if="tenantStep === 0"></NameInformationHelp>
    <DocumentHelp v-if="tenantStep === 2 && tenantSubStep !== 5"></DocumentHelp>
    <TaxHelp v-if="tenantStep === 2 && tenantSubStep === 5"></TaxHelp>
    <GuarantorChoiceHelp v-if="tenantStep === 3"></GuarantorChoiceHelp>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import NameInformationHelp from "./helps/NameInformationHelp.vue";
import GuarantorChoiceHelp from "./helps/GuarantorChoiceHelp.vue";
import DocumentHelp from "./helps/DocumentHelp.vue";
import TaxHelp from "./helps/TaxHelp.vue";
import { mapState } from "vuex";

@Component({
  components: { NameInformationHelp, DocumentHelp, TaxHelp, GuarantorChoiceHelp },
  computed: {
    ...mapState({
      tenantStep: "tenantStep",
      tenantSubStep: "tenantSubStep"
    })
  }
})
export default class ProfileHelp extends Vue {
  public tenantStep!: number;
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
"paragraph1": {
"0": "Attention, veuillez renseigner les informations et les documents ",
"1": "de la personne dont le nom sera sur le bail de location."
},
"paragraph2": "Toute demande dont l’identité du locataire n’est pas correcte ne sera pas instruite.",
"paragraph3": {
"0": "Exemple: si le futur habitant du bien à louer est un étudiant et ",
"1": "que ce sont les parents qui signent le bail et paieront le loyer, ",
"2": "l’identité et les pièces demandées sont ceux des parents"
}
},
"fr": {
"title": "Aide",
"paragraph1": {
"0": "Attention, veuillez renseigner les informations et les documents ",
"1": "de la personne dont le nom sera sur le bail de location."
},
"paragraph2": "Toute demande dont l’identité du locataire n’est pas correcte ne sera pas instruite.",
"paragraph3": {
"0": "Exemple: si le futur habitant du bien à louer est un étudiant et ",
"1": "que ce sont les parents qui signent le bail et paieront le loyer, ",
"2": "l’identité et les pièces demandées sont ceux des parents"
}
}
}
</i18n>
