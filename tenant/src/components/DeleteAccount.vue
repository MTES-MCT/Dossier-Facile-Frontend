<template>
  <ValidationObserver v-slot="{ validate }">
    <form name="form" @submit.prevent="validate().then(validDelete)">
      <ConfirmModal v-show="value" @cancel="undoSelect()">
        <div class="fr-container">
          <div class="fr-grid-row justify-content-center">
            <div class="fr-col-12">
              <div class="fr-col-12 fr-mb-3w">
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
            </div>
          </div>
        </div>
      </ConfirmModal>
    </form>
  </ValidationObserver>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";
import { AnalyticsService } from "../services/AnalyticsService";
import { extend } from "vee-validate";
import { required } from "vee-validate/dist/rules";

extend("required", {
  ...required,
  message: "Ce champ est requis"
});

@Component({
  components: { ValidationObserver, ValidationProvider, ConfirmModal }
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
}
</script>

<i18n>
{
  "en": {
    "password":  "Password"
  },
  "fr": {
    "password":  "Mot de passe"
  }
}
</i18n>
