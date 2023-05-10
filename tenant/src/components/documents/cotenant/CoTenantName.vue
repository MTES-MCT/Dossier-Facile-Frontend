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
              <validation-provider
                rules="required|only-alpha"
                v-slot="{ errors, valid }"
              >
                <div
                  class="fr-input-group"
                  :class="errors[0] ? 'fr-input-group--error' : ''"
                >
                  <FieldLabel :required="true" for-input="lastname">
                    {{ $t("cotenantname.lastname") }}
                  </FieldLabel>
                  <input
                    v-model="lastName"
                    class="form-control fr-input validate-required"
                    :class="{
                      'fr-input--valid': valid,
                      'fr-input--error': errors[0]
                    }"
                    id="lastname"
                    name="lastname"
                    type="text"
                    :disabled="selectedCoTenant.franceConnect"
                    required
                  />
                  <span class="fr-error-text" v-if="errors[0]">{{
                    $t(errors[0])
                  }}</span>
                </div>
              </validation-provider>
              <button
                class="fr-btn fr-btn--sm fr-btn--tertiary fr-btn--icon-left fr-icon-add-line fr-mt-1w"
                v-if="!displayPreferredNameField"
                @click="displayPreferredNameField = true"
              >
                {{ $t("nameinformationform.add-preferredname") }}
              </button>
            </div>
            <div class="fr-col-12 fr-mb-3w" v-if="displayPreferredNameField">
              <validation-provider v-slot="{ errors, valid }">
                <div
                  class="fr-input-group"
                  :class="errors[0] ? 'fr-input-group--error' : ''"
                >
                  <FieldLabel for-input="preferredname">
                    {{ $t("cotenantname.preferredname") }}
                  </FieldLabel>
                  <div class="field-with-button fr-input-wrap">
                    <input
                      id="preferredname"
                      type="text"
                      v-model="preferredName"
                      name="preferredname"
                      class="validate-required form-control fr-input"
                      :class="{
                        'fr-input--valid': valid,
                        'fr-input--error': errors[0],
                      }"
                    />
                    <button
                      class="fr-btn fr-btn--tertiary fr-icon-close-line fr-ml-1w"
                      :title="$t('nameinformationform.delete-preferredname')"
                      @click="deletePreferredName()"
                    >
                      {{ $t("nameinformationform.delete-preferredname") }}
                    </button>
                    <span class="fr-error-text" v-if="errors[0]">
                      {{ $t(errors[0]) }}
                    </span>
                  </div>
                </div>
              </validation-provider>
            </div>
            <div class="fr-col-12 fr-mb-3w">
              <validation-provider
                rules="required|only-alpha"
                v-slot="{ errors, valid }"
              >
                <div
                  class="fr-input-group"
                  :class="errors[0] ? 'fr-input-group--error' : ''"
                >
                  <FieldLabel :required="true" for-input="firstname">
                    {{ $t("cotenantname.firstname") }}
                  </FieldLabel>
                  <input
                    id="firstname"
                    type="text"
                    v-model="firstName"
                    name="firstname"
                    class="validate-required form-control fr-input"
                    :class="{
                      'fr-input--valid': valid,
                      'fr-input--error': errors[0]
                    }"
                    :disabled="selectedCoTenant.franceConnect"
                    required
                  />
                  <span class="fr-error-text" v-if="errors[0]">{{
                    $t(errors[0])
                  }}</span>
                </div>
              </validation-provider>
            </div>
          </div>
        </NakedCard>
        <FooterContainer>
          <BackNext :showBack="true" @on-back="goBack()">
          </BackNext>
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
import FieldLabel from "df-shared/src/components/form/FieldLabel.vue";

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
    FieldLabel
  }
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
