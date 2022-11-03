<template>
  <div>
    <ValidationObserver v-slot="{ validate }">
      <form name="coTenantNameForm" @submit.prevent="validate().then(save)">
        <NakedCard class="fr-p-md-5w">
          <h1 class="fr-h6">{{ $t("title") }}</h1>
          <div>{{ $t("subtitle") }}</div>
          <div class="fr-grid-row fr-grid-row--center fr-mt-4w">
            <div class="fr-col-12 fr-mb-3w">
              <validation-provider rules="required" v-slot="{ errors, valid }">
                <div
                  class="fr-input-group"
                  :class="errors[0] ? 'fr-input-group--error' : ''"
                >
                  <label class="fr-label" for="lastname"
                    >{{ $t("lastname") }} :</label
                  >
                  <input
                    v-model="lastName"
                    class="form-control fr-input validate-required"
                    :class="{
                      'fr-input--valid': valid,
                      'fr-input--error': errors[0]
                    }"
                    id="lastname"
                    name="lastname"
                    :placeholder="$t('lastname-placeholder')"
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
              <validation-provider rules="required" v-slot="{ errors, valid }">
                <div
                  class="fr-input-group"
                  :class="errors[0] ? 'fr-input-group--error' : ''"
                >
                  <label for="firstname" class="fr-label"
                    >{{ $t("firstname") }} :</label
                  >
                  <input
                    id="firstname"
                    :placeholder="$t('firstname-placeholder')"
                    type="text"
                    v-model="firstName"
                    name="firstname"
                    class="validate-required form-control fr-input"
                    :class="{
                      'fr-input--valid': valid,
                      'fr-input--error': errors[0]
                    }"
                    required
                  />
                  <span class="fr-error-text" v-if="errors[0]">{{
                    $t(errors[0])
                  }}</span>
                </div>
              </validation-provider>
            </div>
            <div class="fr-col-12 fr-mb-3w">
              <validation-provider v-slot="{ errors, valid }">
                <div
                  class="fr-input-group"
                  :class="errors[0] ? 'fr-input-group--error' : ''"
                >
                  <label for="preferredname" class="fr-label"
                    >{{ $t("preferredname") }} :</label
                  >
                  <input
                    id="preferredname"
                    :placeholder="$t('lastname-placeholder')"
                    type="text"
                    v-model="preferredName"
                    name="preferredname"
                    class="validate-required form-control fr-input"
                    :class="{
                      'fr-input--valid': valid,
                      'fr-input--error': errors[0]
                    }"
                  />
                  <span class="fr-error-text" v-if="errors[0]">{{
                    $t(errors[0])
                  }}</span>
                </div>
              </validation-provider>
            </div>
            <div class="fr-col-12 fr-mb-3w">
              <label class="fr-label fr-mb-1w">{{ $t("email") }}</label>
              <validation-provider v-slot="{ errors }" :rules="{ email: true }">
                <div
                  class="fr-input-group"
                  :class="errors[0] ? 'fr-input-group--error' : ''"
                >
                  <input
                    v-model="email"
                    class="validate-required form-control fr-input"
                    :class="errors[0] ? 'fr-input--error' : ''"
                    name="email"
                    type="email"
                    disabled
                  />
                  <span
                    class="fr-error-text"
                    v-if="errors[0] && errors[0] !== 'none'"
                    >{{ $t(errors[0]) }}</span
                  >
                </div>
              </validation-provider>
            </div>
          </div>
        </NakedCard>
        <FooterContainer>
          <BackNext :showBack="true" @on-next="save()" @on-back="goBack()">
          </BackNext>
        </FooterContainer>
      </form>
    </ValidationObserver>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import WarningMessage from "df-shared/src/components/WarningMessage.vue";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";
import DfButton from "df-shared/src/Button/Button.vue";
import VGouvFrModal from "df-shared/src/GouvFr/v-gouv-fr-modal/VGouvFrModal.vue";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import { extend } from "vee-validate";
import { required, email } from "vee-validate/dist/rules";
import { User } from "df-shared/src/models/User";
import FooterContainer from "../../footer/FooterContainer.vue";
import BackNext from "../../footer/BackNext.vue";
import { UtilsService } from "@/services/UtilsService";

extend("required", {
  ...required,
  message: "field-required"
});

extend("email", {
  ...email,
  message: "email-not-valid"
});

@Component({
  components: {
    BackNext,
    FooterContainer,
    ValidationProvider,
    ValidationObserver,
    WarningMessage,
    ConfirmModal,
    DfButton,
    VGouvFrModal,
    NakedCard
  }
})
export default class CoTenantName extends Vue {
  @Prop() coTenantId!: number;

  selectedCoTenant!: User;

  firstName = "";
  lastName = "";
  preferredName = "";
  email = "";

  isDocDeleteVisible = false;

  mounted() {
    this.selectedCoTenant = UtilsService.getTenant(Number(this.coTenantId));
    this.firstName = this.selectedCoTenant?.firstName || "";
    this.lastName = this.selectedCoTenant?.lastName || "";
    this.preferredName = this.selectedCoTenant?.preferredName || "";
    this.email = this.selectedCoTenant?.email || "";
  }

  save() {
    if (
      this.firstName === this.selectedCoTenant?.firstName &&
      this.lastName === this.selectedCoTenant?.lastName &&
      this.preferredName === this.selectedCoTenant?.preferredName &&
      this.email === this.selectedCoTenant?.email
    ) {
      this.$emit("on-next");
      return;
    }

    this.selectedCoTenant!.firstName = this.firstName;
    this.selectedCoTenant!.lastName = this.lastName;
    if (this.preferredName) {
      this.selectedCoTenant!.preferredName = this.preferredName;
    }

    const loader = this.$loading.show();
    this.$store
      .dispatch("setNames", this.selectedCoTenant)
      .then(() => {
        Vue.toasted.global.save_success();
        this.$emit("on-next");
      })
      .catch(() => {
        Vue.toasted.global.save_failed();
      })
      .finally(() => {
        loader.hide();
      });
  }

  goBack() {
    this.$emit("on-back");
  }
}
</script>

<style scoped lang="scss"></style>

<i18n>
{
"en": {
  "lastname": "Lastname",
  "firstname": "Firstname",
  "preferredname": "Usage name",
  "email": "E-mail (If you filled this field an invitation will be send)",
  "email-not-valid": "Email not valid",
  "lastname-placeholder": "e.g. Dupont",
  "firstname-placeholder": "e.g. Jean",
  "field-required": "This field is required",
  "title": "My spouse name",
  "subtitle": "I fill the last name and first name of my spouse"
},
"fr": {
  "lastname": "Nom",
  "firstname": "Prénom",
  "preferredname": "Nom d'usage",
  "email": "E-mail",
  "email-not-valid": "Email non valide",
  "lastname-placeholder": "ex: Dupont",
  "firstname-placeholder": "ex: Jean",
  "field-required": "Ce champ est requis",
  "title": "Identité de mon cojoint",
  "subtitle": "Je renseigne le nom et prénom de mon conjoint"
}
}
</i18n>
