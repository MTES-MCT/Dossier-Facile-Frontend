<template>
  <div>
    <ValidationObserver v-slot="{ validate }">
      <v-gouv-fr-modal class="fr-mb-3w">
        <template v-slot:button>
          En difficulté pour répondre à la question ?
        </template>
        <template v-slot:title>
          En difficulté pour répondre à la question ?
        </template>
        <template v-slot:content>
          <p>
            <NameInformationHelp></NameInformationHelp>
          </p>
        </template>
      </v-gouv-fr-modal>
      <form
        name="nameInformationForm"
        @submit.prevent="validate().then(handleNameInformation)"
      >
        <div class="fr-grid-row fr-grid-row--center">
          <div class="fr-col-12 fr-mb-3w">
            <validation-provider rules="required" v-slot="{ errors }">
              <div
                class="fr-input-group"
                :class="errors[0] ? 'fr-input-group--error' : ''"
              >
                <label class="fr-label" for="lastname"
                  >{{ $t("lastname") }} :</label
                >
                <input
                  v-model="lastname"
                  class="form-control fr-input validate-required"
                  id="lastname"
                  name="lastname"
                  :placeholder="$t('lastname')"
                  type="text"
                  required
                />
                <span class="fr-error-text" v-if="errors[0]">{{
                  $t(errors[0])
                }}</span>
              </div>
            </validation-provider>
          </div>
          <div class="fr-col-12 fr-mb-3w">
            <validation-provider rules="required" v-slot="{ errors }">
              <div
                class="fr-input-group"
                :class="errors[0] ? 'fr-input-group--error' : ''"
              >
                <label for="firstname" class="fr-label"
                  >{{ $t("firstname") }} :</label
                >
                <input
                  id="firstname"
                  :placeholder="$t('firstname')"
                  type="text"
                  v-model="firstname"
                  name="firstname"
                  class="validate-required form-control fr-input"
                  required
                />
                <span class="fr-error-text" v-if="errors[0]">{{
                  $t(errors[0])
                }}</span>
              </div>
            </validation-provider>
          </div>
          <div class="fr-col-12 fr-mb-3w">
            <validation-provider
              :rules="{ zipcode: /^[0-9]{5}$/ }"
              v-slot="{ errors }"
            >
              <div
                class="fr-input-group"
                :class="errors[0] ? 'fr-input-group--error' : ''"
              >
                <label for="zipcode" class="fr-label"
                  >{{ $t("zipcode") }} :</label
                >
                <input
                  id="zipcode"
                  :placeholder="$t('zipcode')"
                  type="text"
                  v-model="zipcode"
                  name="zipcode"
                  class="validate-required form-control fr-input"
                />
                <span class="fr-error-text" v-if="errors[0]">{{
                  $t(errors[0])
                }}</span>
              </div>
            </validation-provider>
          </div>
        </div>
        <ProfileFooter :showBack="false"></ProfileFooter>
      </form>
    </ValidationObserver>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { User } from "df-shared/src/models/User";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { extend } from "vee-validate";
import { required, regex } from "vee-validate/dist/rules";
import SubmitButton from "df-shared/src/Button/SubmitButton.vue";
import NameInformationHelp from "./helps/NameInformationHelp.vue";
import VGouvFrModal from "df-shared/src/GouvFr/v-gouv-fr-modal/VGouvFrModal.vue";
import { AnalyticsService } from "../services/AnalyticsService";
import ProfileFooter from "@/components/footer/ProfileFooter.vue";
import { mapGetters } from "vuex";

extend("zipcode", {
  ...regex,
  message: "zipcode-not-valid"
});

extend("required", {
  ...required,
  message: "field-required"
});

@Component({
  components: {
    ValidationProvider,
    ValidationObserver,
    SubmitButton,
    NameInformationHelp,
    VGouvFrModal,
    ProfileFooter
  },
  computed: {
    ...mapGetters({
      user: "userToEdit"
    })
  }
})
export default class NameInformationForm extends Vue {
  public user!: User;
  firstname = "";
  lastname = "";
  zipcode = "";

  beforeMount() {
    this.firstname = this.user.firstName || "";
    this.lastname = this.user.lastName || "";
    this.zipcode = this.user.zipCode || "";
  }

  handleNameInformation() {
    if (
      this.user.firstName === this.firstname &&
      this.user.lastName === this.lastname &&
      this.user.zipCode === this.zipcode
    ) {
      this.$router.push({ name: "TenantType" });
      return;
    }
    const loader = this.$loading.show();
    this.$store.commit("updateUserFirstname", this.firstname);
    this.$store.commit("updateUserLastname", this.lastname);
    this.$store.commit("updateUserZipcode", this.zipcode);

    this.$store
      .dispatch("setNames", this.user)
      .then(
        () => {
          AnalyticsService.confirmName();
          this.$router.push({ name: "TenantType" });
        },
        error => {
          console.dir(error);
        }
      )
      .finally(() => {
        loader.hide();
      });
  }
}
</script>

<style scoped lang="scss"></style>

<i18n>
{
"en": {
"confirm": "Confirmer",
"firstname": "Prénom du locataire",
"lastname": "Nom du locataire",
"zipcode": "Code postal",
"zipcode-not-valid": "Zipcode not valid.",
"field-required": "This field is required"
},
"fr": {
"confirm": "Confirmer",
"firstname": "Prénom du locataire",
"lastname": "Nom du locataire",
"zipcode": "Code postal",
"zipcode-not-valid": "Code postal non valide.",
"field-required": "Ce champ est requis"
}
}
</i18n>
