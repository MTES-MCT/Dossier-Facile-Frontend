<template>
  <div>
    <ValidationObserver v-slot="{ handleSubmit }">
      <form name="tenantGuarantorNameForm" @submit.prevent="handleSubmit(save)">
        <NakedCard class="fr-p-md-5w">
          <h1 class="fr-h6">{{ $t("tenantguarantorname.title") }}</h1>
          <div class="fr-alert fr-alert--info">
            <p v-html="$t('tenantguarantorchoice.two-guarantors-warning')"></p>
          </div>
          <div class="fr-grid-row fr-grid-row--center fr-mt-4w">
            <div class="fr-col-12 fr-mb-3w">
              <validation-provider
                rules="required|only-alpha"
                v-slot="{ errors, valid }"
              >
                <div
                  class="fr-input-group"
                  :class="errors[0] ? 'fr-input-group--error' : ''"
                >
                  <label class="fr-label" for="lastname"
                    >{{ $t("tenantguarantorname.lastname") }} :</label
                  >
                  <input
                    v-model="lastName"
                    class="form-control fr-input validate-required"
                    :class="{
                      'fr-input--valid': valid,
                      'fr-input--error': errors[0],
                    }"
                    id="lastname"
                    name="lastname"
                    :placeholder="
                      $t('tenantguarantorname.lastname-placeholder')
                    "
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
              <validation-provider
                rules="required|only-alpha"
                v-slot="{ errors, valid }"
              >
                <div
                  class="fr-input-group"
                  :class="errors[0] ? 'fr-input-group--error' : ''"
                >
                  <label for="firstname" class="fr-label"
                    >{{ $t("tenantguarantorname.firstname") }} :</label
                  >
                  <input
                    id="firstname"
                    :placeholder="
                      $t('tenantguarantorname.firstname-placeholder')
                    "
                    type="text"
                    v-model="firstName"
                    name="firstname"
                    class="validate-required form-control fr-input"
                    :class="{
                      'fr-input--valid': valid,
                      'fr-input--error': errors[0],
                    }"
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
        <GuarantorFooter @on-back="goBack"></GuarantorFooter>
      </form>
    </ValidationObserver>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import DocumentInsert from "../share/DocumentInsert.vue";
import FileUpload from "../../uploads/FileUpload.vue";
import { DocumentType } from "df-shared/src/models/Document";
import { UploadStatus } from "df-shared/src/models/UploadStatus";
import ListItem from "../../uploads/ListItem.vue";
import { DfFile } from "df-shared/src/models/DfFile";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { Guarantor } from "df-shared/src/models/Guarantor";
import WarningMessage from "df-shared/src/components/WarningMessage.vue";
import { DocumentTypeConstants } from "../share/DocumentTypeConstants";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";
import DfButton from "df-shared/src/Button/Button.vue";
import GuarantorChoiceHelp from "../../helps/GuarantorChoiceHelp.vue";
import VGouvFrModal from "df-shared/src/GouvFr/v-gouv-fr-modal/VGouvFrModal.vue";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import { UtilsService } from "../../../services/UtilsService";
import GuarantorFooter from "../../footer/GuarantorFooter.vue";

@Component({
  components: {
    DocumentInsert,
    FileUpload,
    ListItem,
    ValidationProvider,
    ValidationObserver,
    WarningMessage,
    ConfirmModal,
    DfButton,
    GuarantorChoiceHelp,
    VGouvFrModal,
    NakedCard,
    GuarantorFooter,
  },
  computed: {},
})
export default class TenantGuarantorName extends Vue {
  documents = DocumentTypeConstants.GUARANTOR_IDENTIFICATION_DOCS;
  @Prop() tenantId!: number;
  @Prop() guarantor!: Guarantor;

  fileUploadStatus = UploadStatus.STATUS_INITIAL;
  files: DfFile[] = [];
  identificationDocument = new DocumentType();
  firstName = "";
  lastName = "";
  isDocDeleteVisible = false;

  beforeMount() {
    this.firstName = this.guarantor.firstName as string;
    this.lastName = this.guarantor.lastName as string;
  }

  save() {
    if (
      this.firstName === this.guarantor.firstName &&
      this.lastName === this.guarantor.lastName
    ) {
      this.$emit("on-next");
      return;
    }
    const formData = new FormData();
    if (this.firstName) {
      formData.append("firstName", UtilsService.capitalize(this.firstName));
    }
    if (this.lastName) {
      formData.append("lastName", UtilsService.capitalize(this.lastName));
    }
    if (this.guarantor.id) {
      formData.append("guarantorId", this.guarantor.id?.toString());
    }
    formData.append("tenantId", this.tenantId.toString());

    const loader = this.$loading.show();
    this.$store
      .dispatch("saveGuarantorName", formData)
      .then(() => {
        Vue.toasted.global.save_success();
        this.$emit("on-next");
      })
      .catch(() => {
        this.fileUploadStatus = UploadStatus.STATUS_FAILED;
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
