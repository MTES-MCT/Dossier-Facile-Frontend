<template>
  <div>
    <NakedCard>
      <h6>{{ $t("title") }}</h6>
      <div>{{ $t("subtitle") }}</div>
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
                v-model="lastName"
                class="form-control fr-input validate-required"
                id="lastname"
                name="lastname"
                :placeholder="$t('lastname')"
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
                v-model="firstName"
                name="firstname"
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
    <GuarantorFooter @on-back="goBack" @on-next="save"></GuarantorFooter>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapState } from "vuex";
import DocumentInsert from "@/components/documents/DocumentInsert.vue";
import FileUpload from "@/components/uploads/FileUpload.vue";
import { DocumentType } from "df-shared/src/models/Document";
import { UploadStatus } from "df-shared/src/models/UploadStatus";
import ListItem from "@/components/uploads/ListItem.vue";
import { DfFile } from "df-shared/src/models/DfFile";
import { ValidationProvider } from "vee-validate";
import { Guarantor } from "df-shared/src/models/Guarantor";
import WarningMessage from "df-shared/src/components/WarningMessage.vue";
import { DocumentTypeConstants } from "./DocumentTypeConstants";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";
import DfButton from "df-shared/src/Button/Button.vue";
import GuarantorChoiceHelp from "../helps/GuarantorChoiceHelp.vue";
import VGouvFrModal from "df-shared/src/GouvFr/v-gouv-fr-modal/VGouvFrModal.vue";
import BigRadio from "df-shared/src/Button/BigRadio.vue";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import { UtilsService } from "../../services/UtilsService";
import GuarantorFooter from "@/components/footer/GuarantorFooter.vue";

@Component({
  components: {
    DocumentInsert,
    FileUpload,
    ListItem,
    ValidationProvider,
    WarningMessage,
    ConfirmModal,
    DfButton,
    GuarantorChoiceHelp,
    VGouvFrModal,
    BigRadio,
    NakedCard,
    GuarantorFooter
  },
  computed: {
    ...mapState({
      selectedGuarantor: "selectedGuarantor"
    })
  }
})
export default class GuarantorName extends Vue {
  documents = DocumentTypeConstants.GUARANTOR_IDENTIFICATION_DOCS;

  selectedGuarantor!: Guarantor;
  fileUploadStatus = UploadStatus.STATUS_INITIAL;
  files: DfFile[] = [];
  identificationDocument = new DocumentType();
  firstName = "";
  lastName = "";
  isDocDeleteVisible = false;

  beforeMount() {
    this.firstName = this.selectedGuarantor.firstName || "";
    this.lastName = this.selectedGuarantor.lastName || "";
  }

  save() {
    if (
      this.firstName === this.selectedGuarantor.firstName &&
      this.lastName === this.selectedGuarantor.lastName
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
    formData.append("guarantorId", this.$store.getters.guarantor.id);
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

<i18n>
{
"en": {
  "lastname": "Lastname",
  "firstname": "Firstname",
  "field-required": "This field is required",
  "title": "My guarantor name",
  "subtitle": "I fill the last name and first name of my guarantor"
},
"fr": {
  "lastname": "Nom",
  "firstname": "Prénom",
  "field-required": "Ce champ est requis",
  "title": "Identité de mon garant",
  "subtitle": "Je renseigne le nom et prénom de mon garant"
}
}
</i18n>
