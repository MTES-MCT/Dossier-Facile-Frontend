<template>
  <div class="fr-mb-15w">
    <NakedCard class="fr-p-5w fr-mt-3w">
      <h1 class="fr-h4">{{ $t("nameinformationform.title") }}</h1>
      <div>
        <NameInformationHelp @updateInformation="openUnlinkModal = true" />
        <RequiredFieldsInstruction />
        <ConfirmModal
          class="fr-px-md-16w"
          v-if="openUnlinkModal"
          :validateBtnText="$t('nameinformationform.unlink-account-btn')"
          @valid="unlinkFranceConnect()"
          @cancel="openUnlinkModal = false"
        >
          <template v-slot:title>
            <span class="fr-fi-refresh-line"></span>
            <span> {{ $t("nameinformationform.unlink-fc-link") }}</span>
          </template>
          <p>
            {{ $t("nameinformationform.unlink-fc-content") }}
            <span v-if="user.passwordEnabled">
              {{
                $t("nameinformationform.unlink-fc-content-password-exists")
              }}</span
            >
            <span v-else>{{
              $t("nameinformationform.unlink-fc-content-password-undefined")
            }}</span>
          </p>
        </ConfirmModal>
      </div>

      <ValidationObserver v-slot="{ handleSubmit }">
        <form
          class="fr-mt-3w"
          name="nameInformationForm"
          @submit.prevent="handleSubmit(handleNameInformation)"
        >
          <div class="fr-grid-row fr-grid-row--center">
            <div class="fr-col-12 fr-mb-3w">
              <TextField
                name="lastname"
                :fieldLabel="$tc('nameinformationform.lastname')"
                validation-rules="only-alpha"
                v-model.trim="lastname"
                :required="true"
                :disabled="user.franceConnect"
              />
              <button
                class="fr-btn fr-btn--sm fr-btn--tertiary fr-btn--icon-left fr-icon-add-line fr-mt-1w"
                v-if="!displayPreferredNameField"
                @click="displayPreferredNameField = true"
                type="button"
              >
                {{ $t("nameinformationform.add-preferredname") }}
              </button>
            </div>
            <div class="fr-col-12 fr-mb-3w" v-if="displayPreferredNameField">
              <TextField
                name="preferredname"
                :fieldLabel="$tc('nameinformationform.preferredname')"
                validation-rules="only-alpha"
                v-model.trim="preferredname"
              >
                <template v-slot:right>
                  <button
                    class="fr-btn fr-btn--tertiary fr-icon-close-line"
                    :title="$t('nameinformationform.delete-preferredname')"
                    @click="deletePreferredName()"
                  >
                    {{ $t("nameinformationform.delete-preferredname") }}
                  </button>
                </template>
              </TextField>
            </div>
            <div class="fr-col-12 fr-mb-3w">
              <TextField
                name="firstname"
                :fieldLabel="$tc('nameinformationform.firstname')"
                validation-rules="only-alpha"
                v-model.trim="firstname"
                :required="true"
                :disabled="user.franceConnect"
              />
            </div>
            <div class="fr-col-12 fr-mb-3w">
              <TextField
                name="zipcode"
                :fieldLabel="$tc('nameinformationform.zipcode')"
                validation-rules="zipcode"
                v-model="zipcode"
              />
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
import { extend, ValidationObserver, ValidationProvider } from "vee-validate";
import SubmitButton from "df-shared/src/Button/SubmitButton.vue";
import RequiredFieldsInstruction from "df-shared/src/components/form/RequiredFieldsInstruction.vue";
import NameInformationHelp from "./helps/NameInformationHelp.vue";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";
import { AnalyticsService } from "../services/AnalyticsService";
import ProfileFooter from "./footer/ProfileFooter.vue";
import { mapGetters } from "vuex";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import { UtilsService } from "@/services/UtilsService";
import TextField from "df-shared/src/components/form/TextField.vue";

extend("zipcode", {
  validate: (field) => new RegExp(/^[0-9]{5}$/).test(field),
  message: "nameinformationform.zipcode-not-valid",
});

@Component({
  components: {
    ValidationProvider,
    ValidationObserver,
    SubmitButton,
    NameInformationHelp,
    ConfirmModal,
    ProfileFooter,
    NakedCard,
    RequiredFieldsInstruction,
    TextField,
  },
  computed: {
    ...mapGetters({
      user: "userToEdit",
    }),
  },
})
export default class NameInformationForm extends Vue {
  public user!: User;
  public openUnlinkModal = false;
  public displayPreferredNameField = false;

  firstname = "";
  lastname = "";
  preferredname = "";
  zipcode = "";

  beforeMount() {
    this.firstname = this.user.firstName || "";
    this.lastname = this.user.lastName || "";
    this.preferredname = UtilsService.capitalize(this.user.preferredName || "");
    this.zipcode = this.user.zipCode || "";
    this.displayPreferredNameField = this.preferredname !== "";
  }

  deletePreferredName() {
    this.preferredname = "";
    this.displayPreferredNameField = false;
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
        (error) => {
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
        (error) => {
          console.dir(error);
        }
      )
      .finally(() => {
        loader.hide();
      });
  }
}
</script>

<style scoped lang="scss">
.field-with-button {
  display: flex;
  justify-content: space-between;
}
.warning-box {
  .title {
    display: flex;
  }

  .link {
    text-align: right;
  }
}
</style>
