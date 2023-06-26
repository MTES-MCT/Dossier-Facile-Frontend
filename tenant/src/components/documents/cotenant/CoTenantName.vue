<template>
  <div>
    <ValidationObserver v-slot="{ handleSubmit }">
      <form name="coTenantNameForm" @submit.prevent="handleSubmit(save)">
        <NakedCard class="fr-p-md-5w">
          <h1 class="fr-h6">{{ $t("cotenantname.title") }}</h1>
          <div>
            {{ $t("cotenantname.subtitle") }}
            <span v-if="selectedCoTenant.franceConnect">
              {{ $t("cotenantname.franceconnect-account") }}
            </span>
          </div>
          <RequiredFieldsInstruction></RequiredFieldsInstruction>
          <div class="fr-grid-row fr-grid-row--center fr-mt-3w">
            <div class="fr-col-12 fr-mb-3w">
              <TextField
                name="lastname"
                :fieldLabel="$tc('cotenantname.lastname')"
                validation-rules="only-alpha"
                v-model.trim="lastName"
                :required="true"
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
                :fieldLabel="$tc('cotenantname.preferredname')"
                validation-rules="only-alpha"
                v-model.trim="preferredName"
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
                :fieldLabel="$tc('cotenantname.firstname')"
                validation-rules="only-alpha"
                v-model.trim="firstName"
                :required="true"
              />
            </div>
          </div>
        </NakedCard>
        <FooterContainer>
          <BackNext :showBack="true" @on-back="goBack()"> </BackNext>
        </FooterContainer>
      </form>
    </ValidationObserver>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import WarningMessage from "df-shared/src/components/WarningMessage.vue";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";
import DfButton from "df-shared/src/Button/Button.vue";
import VGouvFrModal from "df-shared/src/GouvFr/v-gouv-fr-modal/VGouvFrModal.vue";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import { User } from "df-shared/src/models/User";
import FooterContainer from "../../footer/FooterContainer.vue";
import BackNext from "../../footer/BackNext.vue";
import { UtilsService } from "@/services/UtilsService";
import RequiredFieldsInstruction from "df-shared/src/components/form/RequiredFieldsInstruction.vue";
import TextField from "df-shared/src/components/form/TextField.vue";

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
    NakedCard,
    RequiredFieldsInstruction,
    TextField,
  },
})
export default class CoTenantName extends Vue {
  @Prop() coTenantId!: number;

  selectedCoTenant: User = new User();

  firstName = "";
  lastName = "";
  preferredName = "";
  displayPreferredNameField = false;

  isDocDeleteVisible = false;

  beforeMount() {
    this.selectedCoTenant = UtilsService.getTenant(Number(this.coTenantId));
    this.firstName = this.selectedCoTenant?.firstName || "";
    this.lastName = this.selectedCoTenant?.lastName || "";
    this.preferredName = this.selectedCoTenant?.preferredName || "";
    this.displayPreferredNameField = this.preferredName !== "";
  }

  deletePreferredName() {
    this.preferredName = "";
    this.displayPreferredNameField = false;
  }

  save() {
    if (
      this.firstName === this.selectedCoTenant?.firstName &&
      this.lastName === this.selectedCoTenant?.lastName &&
      this.preferredName === this.selectedCoTenant?.preferredName
    ) {
      this.$emit("on-next");
      return;
    }

    this.selectedCoTenant.firstName = this.firstName;
    this.selectedCoTenant.lastName = this.lastName;
    this.selectedCoTenant.preferredName = this.preferredName;

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

<style scoped lang="scss">
.field-with-button {
  display: flex;
  justify-content: space-between;
}
</style>
