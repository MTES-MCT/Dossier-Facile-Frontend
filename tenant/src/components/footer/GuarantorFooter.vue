<template>
  <div>
    <FooterContainer>
      <div class="fr-grid-row space-around" v-if="hasOneNaturalGuarantor()">
        <v-gouv-fr-button
          :secondary="true"
          :label="$t('add-guarantor')"
          :btn-type="'button'"
          @click="addNaturalGuarantor"
        ></v-gouv-fr-button>
      </div>
      <div class="fr-grid-row space-around">
        <v-gouv-fr-button
          v-if="showBack"
          :secondary="true"
          :label="$t('back')"
          :btn-type="'button'"
          @click="backAction"
        ></v-gouv-fr-button>
        <v-gouv-fr-button
          :secondary="false"
          :label="$t('continue')"
          :btn-type="'submit'"
          @click="nextAction"
        ></v-gouv-fr-button>
      </div>
    </FooterContainer>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import VGouvFrButton from "df-shared/src/Button/v-gouv-fr-button/VGouvFrButton.vue";
import FooterContainer from "./FooterContainer.vue";
import { mapGetters } from "vuex";
import { Guarantor } from "df-shared/src/models/Guarantor";

@Component({
  components: { VGouvFrButton, FooterContainer },
  computed: {
    ...mapGetters({
      guarantors: "guarantors"
    })
  }
})
export default class ProfileFooter extends Vue {
  @Prop({ default: true }) showBack!: boolean;

  guarantors!: Guarantor[];

  nextAction() {
    this.$emit("on-next");
  }

  backAction() {
    this.$emit("on-back");
  }

  addNaturalGuarantor() {
    this.$store.dispatch("addNaturalGuarantor");
  }

  hasOneNaturalGuarantor() {
    return (
      this.guarantors.length === 1 &&
      this.guarantors[0].typeGuarantor === "NATURAL_PERSON"
    );
  }
}
</script>

<style lang="scss"></style>

<i18n>
{
"en": {
  "back": "Back",
  "continue": "Continue",
  "add-guarantor": "Add new natural guarantor"
},
"fr": {
  "back": "Retour",
  "continue": "Continuer",
  "add-guarantor": "Ajouter un nouveau garant"
}
}
</i18n>
