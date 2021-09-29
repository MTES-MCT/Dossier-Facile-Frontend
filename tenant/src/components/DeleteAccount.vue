<template>
  <ValidationObserver v-slot="{ validate }">
    <form name="form" @submit.prevent="validate().then(validDelete)">
      <Modal @close="undoSelect()">
        <template v-slot:header>
          <div class="fr-container">
            <div class="fr-grid-row justify-content-center">
              <div class="fr-col-10 title">
                <span class="text-danger material-icons-outlined md-38 fr-pr-1w"
                  >cancel</span
                >
                {{ $t("title") }}
              </div>
            </div>
          </div>
        </template>
        <template v-slot:body>
          <div class="fr-container">
            <div class="fr-grid-row justify-content-center">
              <div class="fr-col-10">
                <div class="fr-mb-3w">
                  <validation-provider rules="required" v-slot="{ errors }">
                    <div
                      class="fr-input-group"
                      :class="errors[0] ? 'fr-input-group--error' : ''"
                    >
                      <label for="password" class="fr-label">{{
                        $t("password")
                      }}</label>
                      <input
                        id="password"
                        type="password"
                        v-model="password"
                        name="password"
                        class="validate-required form-control fr-input"
                        required
                      />
                      <span class="fr-error-text" v-if="errors[0]">{{
                        $t(errors[0])
                      }}</span>
                    </div>
                  </validation-provider>
                </div>
                <div class="align--right">
                  <DfButton class="fr-mr-3w" @on-click="undoSelect()">{{
                    $t("cancel")
                  }}</DfButton>
                  <DfButton
                    type="submit"
                    @on-click="validSelect()"
                    primary="true"
                    >{{
                      isMobile() ? $t("validate-mobile") : $t("validate")
                    }}</DfButton
                  >
                </div>
              </div>
            </div>
          </div>
        </template>
      </Modal>
    </form>
  </ValidationObserver>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import Modal from "df-shared/src/components/Modal.vue";
import { AnalyticsService } from "../services/AnalyticsService";
import { extend } from "vee-validate";
import { required } from "vee-validate/dist/rules";
import DfButton from "df-shared/src/Button/Button.vue";
import { UtilsService } from "../services/UtilsService";

extend("required", {
  ...required,
  message: "Ce champ est requis"
});

@Component({
  components: { ValidationObserver, ValidationProvider, Modal, DfButton }
})
export default class DeleteAccount extends Vue {
  MAIN_URL = `//${process.env.VUE_APP_MAIN_URL}`;
  @Prop({ default: false }) value!: boolean;
  password = "";

  validDelete() {
    this.$emit("input", false);
    this.value = false;
    this.$store.dispatch("deleteAccount", this.password).then(
      () => {
        AnalyticsService.deleteAccount();
        window.location.replace(this.MAIN_URL);
      },
      () => {
        this.$toasted.show(this.$i18n.t("try-again").toString(), {
          type: "error",
          duration: 7000
        });
      }
    );
  }

  undoSelect() {
    this.$emit("input", false);
    return false;
  }

  isMobile() {
    return UtilsService.isMobile();
  }
}
</script>

<style scoped lang="scss">
.align--right {
  text-align: right;
}

.title {
  font-size: 24px;
  font-weight: bold;
  display: flex;
  align-items: center;
}
</style>

<i18n>
{
  "en": {
    "password": "Please enter your password to confirm the complete deletion of the account :",
    "validate": "Delete my account",
    "validate-mobile": "Delete",
    "cancel": "Cancel",
    "title": "Account deletion",
    "title-mobile": "Deletion"
  },
  "fr": {
    "password": "Veuillez saisir votre mot de passe pour confirmer la suppression complète du compte :",
    "validate": "Supprimer mon compte",
    "validate-mobile": "Supprimer",
    "cancel": "Annuler",
    "title": "Suppression de compte"
  }
}
</i18n>
