<template>
  <div>
    <FooterContainer>
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

@Component({
  components: { VGouvFrButton, FooterContainer }
})
export default class ProfileFooter extends Vue {
  @Prop({ default: true }) showBack!: boolean;

  nextAction() {
    this.$emit("on-next");
  }

  backAction() {
    this.$emit("on-back");
  }
}
</script>

<style lang="scss"></style>

<i18n>
{
"en": {
  "back": "Back",
  "continue": "Continue"
},
"fr": {
  "back": "Retour",
  "continue": "Continuer"
}
}
</i18n>
