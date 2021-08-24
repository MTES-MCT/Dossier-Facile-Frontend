<template>
  <div>
    <FooterContainer>
      <div
        class="fr-grid-row space-around fr-mb-1w"
        v-if="hasOneNaturalGuarantor()"
      >
        <v-gouv-fr-button
          :secondary="true"
          :label="$t('add-guarantor')"
          :btn-type="'button'"
          @click="addNaturalGuarantor"
        ></v-gouv-fr-button>
      </div>
      <div class="fr-grid-row btn-spacing footer-btn">
        <v-gouv-fr-button
          class="fr-mr-2w"
          v-if="showBack"
          :secondary="true"
          :label="getBackText()"
          :btn-type="'button'"
          @click="backAction"
        ></v-gouv-fr-button>
        <v-gouv-fr-button
          class="next-btn"
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

  isMobile() {
    return window.innerWidth < 768;
  }

  getBackText() {
    return this.isMobile() ? "<" : this.$i18n.t("back");
  }
}
</script>

<style lang="scss" scoped>
.btn-spacing {
  @media (min-width: 768px) {
    justify-content: space-around;
  }
}

.next-btn {
  max-width: 400px;
  flex: 1;
}
</style>

<style lang="scss">
.footer-btn .fr-btn {
  width: 100%;
  justify-content: center;
}
</style>

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
