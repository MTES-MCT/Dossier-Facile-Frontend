<template>
  <div>
    <div class="horizontal-spacer"></div>
    <div class="profile-footer">
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
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import VGouvFrButton from "df-shared/src/Button/v-gouv-fr-button/VGouvFrButton.vue";

@Component({
  components: { VGouvFrButton }
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

<style lang="scss">
.profile-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #e5e5f4;
  padding: 20px;
  z-index: 2;
}

.horizontal-spacer {
  margin-top: 50px;
}
</style>

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
