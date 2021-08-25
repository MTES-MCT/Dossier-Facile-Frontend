<template>
  <div class="fr-grid-row btn-spacing footer-btn">
    <v-gouv-fr-button
      class="fr-mr-2w"
      v-if="showBack"
      :secondary="true"
      :label="getBackText()"
      :btn-type="'button'"
      @click="backAction()"
    ></v-gouv-fr-button>
    <v-gouv-fr-button
      class="next-btn"
      :secondary="false"
      :label="nextLabel ? nextLabel : $t('continue')"
      :btn-type="'submit'"
      :disabled="disabled"
      @click="nextAction()"
    ></v-gouv-fr-button>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import VGouvFrButton from "df-shared/src/Button/v-gouv-fr-button/VGouvFrButton.vue";
import { UtilsService } from "../../services/UtilsService";

@Component({
  components: { VGouvFrButton }
})
export default class BackNext extends Vue {
  @Prop({ default: true }) showBack!: boolean;
  @Prop({ default: false }) disabled?: boolean;
  @Prop() nextLabel?: string;

  getBackText() {
    return UtilsService.isMobile() ? "<" : this.$i18n.t("back");
  }

  backAction() {
    this.$emit("on-back");
  }

  nextAction() {
    this.$emit("on-next");
  }
}
</script>

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

<style lang="scss" scoped>
.btn-spacing {
  @media (min-width: 768px) {
    justify-content: space-around;
  }
}

.next-btn {
  @media (max-width: 768px) {
    max-width: 400px;
    flex: 1;
  }
}
</style>

<style lang="scss">
.footer-btn .fr-btn {
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
}
</style>
