<template>
  <div class="fr-mb-15w">
    <NakedCard class="fr-p-5w">
      <h1 class="fr-h4">{{ $t("title") }}</h1>
      <p class="fr-mb-0">{{ $t("subtitle") }}</p>
      <div>
        <small>
          <i18n path="description-required-field">
            <template v-slot:asterix>
              <span style="color:red">*</span>
            </template>
          </i18n>
        </small>
        <a
          v-if="user.franceConnect"
          href="#"
          @click="openUnlinkModal = true"
          class="fr-link fr-tag--sm small-font"
          >{{ $t("unlink-fc-link") }}</a
        >
        <ConfirmModal
          class="fr-px-md-16w"
          v-if="openUnlinkModal"
          :validateBtnText="$t('unlink-account-btn')"
          @valid="unlinkFranceConnect()"
          @cancel="openUnlinkModal = false"
        >
          <template v-slot:title>
            <span class="fr-fi-refresh-line"></span>
            <span> {{ $t("unlink-fc-link") }}</span>
          </template>
          <p>
            {{ $t("unlink-fc-content") }}
            <span v-if="user.passwordEnabled">
              {{ $t("unlink-fc-content-password-exists") }}</span
            >
            <span v-else>{{ $t("unlink-fc-content-password-undefined") }}</span>
          </p>
        </ConfirmModal>
      </div>

      <ValidationObserver v-slot="{ validate }">
        <form
          class="fr-mt-3w"
          name="nameInformationForm"
          @submit.prevent="validate().then(handleNameInformation)"
        >
          <div class="fr-grid-row fr-grid-row--center">
            <div class="fr-col-12 fr-mb-3w">
              <validation-provider
                rules="required|lastname"
                v-slot="{ errors, valid }"
              >
                <div
                  class="fr-input-group"
                  :class="errors[0] ? 'fr-input-group--error' : ''"
                >
                  <label class="fr-label" for="lastname"
                    >{{ $t("lastname") }} * :</label
                  >
                  <input
                    v-model="lastname"
                    class="form-control fr-input validate-required"
                    :class="{
                      'fr-input--valid': valid,
                      'fr-input--error': errors[0]
                    }"
                    id="lastname"
                    name="lastname"
                    :placeholder="$t('lastname').toString()"
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
              <validation-provider rules="lastname" v-slot="{ errors, valid }">
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
                    :class="{
                      'fr-input--valid': valid,
                      'fr-input--error': errors[0]
                    }"
                    id="preferredname"
                    name="preferredname"
                    :placeholder="$t('preferredname').toString()"
                    type="text"
                  />
                  <span class="fr-error-text" v-if="errors[0]">{{
                    $t(errors[0])
                  }}</span>
                </div>
              </validation-provider>
            </div>
            <div class="fr-col-12 fr-mb-3w">
              <validation-provider rules="required" v-slot="{ errors, valid }">
                <div
                  class="fr-input-group"
                  :class="errors[0] ? 'fr-input-group--error' : ''"
                >
                  <label for="firstname" class="fr-label"
                    >{{ $t("firstname") }} * :</label
                  >
                  <input
                    id="firstname"
                    :placeholder="$t('firstname').toString()"
                    type="text"
                    v-model="firstname"
                    name="firstname"
                    class="validate-required form-control fr-input"
                    :class="{
                      'fr-input--valid': valid,
                      'fr-input--error': errors[0]
                    }"
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
                v-slot="{ errors, valid }"
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
                    :placeholder="$t('zipcode').toString()"
                    :class="{
                      'fr-input--valid': valid,
                      'fr-input--error': errors[0]
                    }"
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
    </NakedCard>
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
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";
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
    ConfirmModal,
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
  public openUnlinkModal = false;
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

  unlinkFranceConnect() {
    this.openUnlinkModal = false;
    const loader = this.$loading.show();
    this.$store
      .dispatch("unlinkFranceConnect", this.user)
      .then(
        () => {
          // if user has not password redirect to resetpassword
          if (!this.user.passwordEnabled) {
            this.$router.push("/reset-password/null");
          }
        },
        error => {
          console.dir(error);
        }
      )
      .finally(() => {
        loader.hide();
      });
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
"subtitle": "Please fill in the details of the person whose name will appear on the rental agreement",
"unlink-fc-link": "Need to update Firstname and Lastname ?",
"unlink-fc-content": "You have to unlink your FranceConnect account for updating directly your Firstname and Lastname.",
"unlink-fc-content-password-exists": "You will be able to connect with your previously defined password.",
"unlink-fc-content-password-undefined": "You will be redirected to create your password.",
"unlink-account-btn": "Unlink",
"description-required-field" : "Fields with {asterix} are required."
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
"title": "Commençons par vos informations personnelles d’identité.",
"subtitle": "Veuillez renseigner les informations de la personne dont le nom figurera sur le bail de location.",
"unlink-fc-link": "Modifier vos informations ?",
"unlink-fc-content": "Afin d’apporter des modifications sur vos nom et prénoms, il vous faut dissocier vos comptes FranceConnect et DossierFacile.",
"unlink-fc-content-password-exists": "Vous pourrez alors utiliser le mot de passe que vous avez précédemment défini.",
"unlink-fc-content-password-undefined": "Vous serez ensuite redirigé sur la page de mise à jour du mot de passe.",
"unlink-account-btn": "Dissocier mes comptes",
"description-required-field" : "Les champs marqués d'un {asterix} sont obligatoires."
}
}
</i18n>
