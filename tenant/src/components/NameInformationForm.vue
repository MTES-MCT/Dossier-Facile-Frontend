<template>
  <div class="fr-mb-15w">
    <ValidationObserver v-slot="{ validate }">
      <form
        name="nameInformationForm"
        @submit.prevent="validate().then(handleNameInformation)"
      >
        <NakedCard class="fr-p-5w">
          <h4>{{ $t("title") }}</h4>
          <p>{{ $t("subtitle") }}</p>
          <div class="fr-grid-row fr-grid-row--center">
            <div class="fr-col-12 fr-mb-3w">
              <validation-provider
                rules="required|lastname"
                v-slot="{ errors }"
              >
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
                    :disabled="user.franceConnect"
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
              <validation-provider rules="lastname" v-slot="{ errors }">
                <div
                  class="fr-input-group"
                  :class="errors[0] ? 'fr-input-group--error' : ''"
                >
                  <label class="fr-label" for="preferredname"
                    >{{ $t("preferredname") }} :</label
                  >
                  <input
                    v-model="preferredname"
                    class="form-control fr-input validate-required"
                    id="preferredname"
                    name="preferredname"
                    :placeholder="$t('preferredname')"
                    type="text"
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
                    :disabled="user.franceConnect"
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
        </NakedCard>
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
import ProfileFooter from "./footer/ProfileFooter.vue";
import { mapGetters } from "vuex";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import { UtilsService } from "@/services/UtilsService";

extend("zipcode", {
  ...regex,
  message: "zipcode-not-valid"
});

extend("required", {
  ...required,
  message: "field-required"
});

extend("lastname", {
  message: "only-alpha",
  validate(value) {
    return {
      required: false,
      valid: value.match("^[a-zA-Z \\-'éèëêïîöôùüàçÉÊÈËÎÏÔÇ]*$")
    };
  },
  computesRequired: true
});

@Component({
  components: {
    ValidationProvider,
    ValidationObserver,
    SubmitButton,
    NameInformationHelp,
    VGouvFrModal,
    ProfileFooter,
    NakedCard
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
  preferredname = "";
  zipcode = "";

  beforeMount() {
    this.firstname = this.user.firstName || "";
    this.lastname = this.user.lastName || "";
    this.preferredname = UtilsService.capitalize(this.user.preferredName || "");
    this.zipcode = this.user.zipCode || "";
  }

  handleNameInformation() {
    if (
      this.user.firstName === this.firstname &&
      this.user.lastName === this.lastname &&
      this.user.preferredName === this.preferredname &&
      this.user.zipCode === this.zipcode
    ) {
      this.$router.push({ name: "TenantType" });
      return;
    }
    const loader = this.$loading.show();
    this.$store.commit("updateUserFirstname", this.firstname);
    this.$store.commit("updateUserLastname", this.lastname);
    this.$store.commit("updateUserPreferredname", this.preferredname);
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
"confirm": "Confirm",
"firstname": "Firstname",
"lastname": "Lastname",
"preferredname": "Usage Name (optional)",
"zipcode": "Zipcode",
"zipcode-not-valid": "Zipcode not valid.",
"only-alpha":"Alphabetic characters only",
"field-required": "This field is required",
"title": "I fill in my personal information",
"subtitle": "Please fill in the details of the person whose name will appear on the rental agreement"
},
"fr": {
"confirm": "Confirmer",
"firstname": "Prénom",
"lastname": "Nom de naissance du locataire",
"preferredname": "Nom d'usage (facultatif)",
"zipcode": "Code postal",
"zipcode-not-valid": "Code postal non valide.",
"only-alpha":"Seuls les caractères alphabétiques ainsi que [ , -, '] sont autorisés",
"field-required": "Ce champ est requis",
"title": "Je renseigne mes informations personnelles",
"subtitle": "Veuillez renseigner les informations de la personne dont le nom figurera sur le bail de location."
}
}
</i18n>
