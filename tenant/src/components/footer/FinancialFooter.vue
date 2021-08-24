<template>
  <div>
    <FooterContainer>
      <div class="fr-grid-row space-around fr-mb-1w">
        <v-gouv-fr-button
          :secondary="true"
          :label="$t('add-financial')"
          :btn-type="'button'"
          @click="addFinancial"
        ></v-gouv-fr-button>
      </div>
      <BackNext
        :showBack="showBack"
        @on-next="nextAction()"
        @on-back="backAction()"
      ></BackNext>
    </FooterContainer>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import VGouvFrButton from "df-shared/src/Button/v-gouv-fr-button/VGouvFrButton.vue";
import FooterContainer from "./FooterContainer.vue";
import BackNext from "./BackNext.vue";

@Component({
  components: { VGouvFrButton, FooterContainer, BackNext }
})
export default class ProfileFooter extends Vue {
  @Prop({ default: true }) showBack!: boolean;

  nextAction() {
    this.$emit("on-next");
  }

  backAction() {
    this.$emit("on-back");
  }

  addFinancial() {
    this.$emit("add-financial");
  }
}
</script>

<style lang="scss"></style>

<i18n>
{
"en": {
  "back": "Back",
  "continue": "Continue",
  "add-financial": "Add financial"
},
"fr": {
  "back": "Retour",
  "continue": "Continuer",
  "add-financial": "Ajouter un revenu"
}
}
</i18n>
