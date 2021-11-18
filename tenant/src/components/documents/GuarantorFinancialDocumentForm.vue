<template>
  <div>
    <Modal v-show="isNoIncomeAndFiles" @close="isNoIncomeAndFiles = false">
      <template v-slot:body>
        <div class="fr-container">
          <div class="fr-grid-row justify-content-center">
            <div class="fr-col-12">
              <p>
                {{ $t("warning-no-income-and-file") }}
              </p>
            </div>
          </div>
        </div>
      </template>
    </Modal>
    <ConfirmModal
      v-if="isDocDeleteVisible"
      @valid="validSelect()"
      @cancel="undoSelect()"
    >
      <span>{{ $t("will-delete-files") }}</span>
    </ConfirmModal>
    <ValidationObserver v-slot="{ validate }">
      <NakedCard class="fr-p-md-5w fr-mb-3w">
        <form name="form" @submit.prevent="validate().then(save())">
          <div>
            <div>
              <div>
                {{ $t("select-label") }}
              </div>

              <v-gouv-fr-modal>
                <template v-slot:button>
                  En difficulté pour répondre à la question ?
                </template>
                <template v-slot:title>
                  En difficulté pour répondre à la question ?
                </template>
                <template v-slot:content>
                  <p>
                    <GuarantorChoiceHelp></GuarantorChoiceHelp>
                    <DocumentInsert
                      :allow-list="
                        financialDocument.documentType.acceptedProofs
                      "
                      :block-list="financialDocument.documentType.refusedProofs"
                      v-if="financialDocument.documentType.key"
                    ></DocumentInsert>
                  </p>
                </template>
              </v-gouv-fr-modal>

              <div class="fr-mt-3w">
                <fieldset class="fr-fieldset">
                  <div class="fr-fieldset__content">
                    <div class="fr-grid-row">
                      <div
                        v-for="d in documents"
                        :key="d.key"
                        class="full-width-xs"
                      >
                        <BigRadio
                          :val="d"
                          v-model="financialDocument.documentType"
                          @input="onSelectChange()"
                        >
                          <div class="fr-grid-col spa">
                            <span>{{ $t(d.key) }}</span>
                          </div>
                        </BigRadio>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
          </div>
          <div
            class="fr-mt-3w"
            v-if="
              financialDocument.documentType.key &&
                financialDocument.documentType.key
            "
          >
            <div
              v-if="
                financialDocument.documentType &&
                  financialDocument.documentType.key
              "
            >
              <div>
                <validation-provider
                  :rules="{ required: true, regex: /^[0-9., ]+$/ }"
                  v-slot="{ errors }"
                >
                  <div
                    class="fr-input-group"
                    :class="errors[0] ? 'fr-input-group--error' : ''"
                  >
                    <label for="monthlySum" class="fr-label"
                      >{{ $t("monthlySum-label") }} :</label
                    >
                    <input
                      id="monthlySum"
                      :placeholder="$t('monthlySum')"
                      type="number"
                      min="0"
                      step="1"
                      v-model="financialDocument.monthlySum"
                      name="monthlySum"
                      class="validate-required form-control fr-input"
                      required
                    />
                    <span class="fr-error-text" v-if="errors[0]">{{
                      $t(errors[0])
                    }}</span>
                    <span
                      class="fr-error-text"
                      v-if="financialDocument.monthlySum > 10000"
                    >
                      {{ $t("high-salary") }}
                    </span>
                    <span
                      class="fr-error-text"
                      v-if="
                        financialDocument.monthlySum !== '' &&
                          financialDocument.monthlySum <= 0
                      "
                    >
                      {{ $t("low-salary") }}
                    </span>
                  </div>
                </validation-provider>
              </div>
            </div>
          </div>
        </form>
        <div
          class="fr-mt-3w"
          v-if="
            financialDocument.documentType.key &&
              financialDocument.documentType.key !== 'no-income' &&
              financialDocument.monthlySum >= 0 &&
              financialDocument.monthlySum !== ''
          "
        >
          <div class="fr-mb-3w">
            {{ financialDocument.documentType.explanationText }}
          </div>
          <div v-if="financialFiles().length > 0" class="fr-col-md-12 fr-mb-3w">
            <ListItem
              v-for="(file, k) in financialFiles()"
              :key="k"
              :file="file"
              @remove="remove(financialDocument, file)"
            />
          </div>
          <div class="fr-mb-3w">
            <FileUpload
              :current-status="financialDocument.fileUploadStatus"
              @add-files="addFiles(financialDocument, ...arguments)"
              @reset-files="resetFiles(financialDocument, ...arguments)"
            ></FileUpload>
          </div>
          <div class="fr-col-12 fr-mb-3w bg-purple fr-checkbox-group">
            <input
              type="checkbox"
              id="noDocument"
              value="false"
              v-model="financialDocument.noDocument"
            />
            <label for="noDocument">
              {{ $t(getCheckboxLabel(financialDocument.documentType.key)) }}
            </label>
          </div>
          <div class="fr-mb-5w" v-if="financialDocument.noDocument">
            <validation-provider
              :rules="{ required: true }"
              v-slot="{ errors }"
            >
              <div class="fr-input-group">
                <label class="fr-label" for="customText">
                  {{
                    $t(getCustomTextLabel(financialDocument.documentType.key))
                  }}
                </label>
                <input
                  v-model="financialDocument.customText"
                  class="form-control fr-input validate-required"
                  id="customText"
                  name="customText"
                  placeholder=""
                  type="text"
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
    </ValidationObserver>
    <ProfileFooter @on-back="goBack" @on-next="goNext"></ProfileFooter>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { DocumentType } from "df-shared/src/models/Document";
import DocumentInsert from "@/components/documents/DocumentInsert.vue";
import FileUpload from "@/components/uploads/FileUpload.vue";
import { UploadStatus } from "df-shared/src/models/UploadStatus";
import ListItem from "@/components/uploads/ListItem.vue";
import { DfFile } from "df-shared/src/models/DfFile";
import { DfDocument } from "df-shared/src/models/DfDocument";
import { Guarantor } from "df-shared/src/models/Guarantor";
import { extend } from "vee-validate";
import { RegisterService } from "../../services/RegisterService";
import DfButton from "df-shared/src/Button/Button.vue";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { required, regex } from "vee-validate/dist/rules";
import WarningMessage from "df-shared/src/components/WarningMessage.vue";
import { DocumentTypeConstants } from "./DocumentTypeConstants";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";
import { FinancialDocument } from "df-shared/src/models/FinancialDocument";
import { mapGetters, mapState } from "vuex";
import Modal from "df-shared/src/components/Modal.vue";
import GuarantorChoiceHelp from "../helps/GuarantorChoiceHelp.vue";
import VGouvFrModal from "df-shared/src/GouvFr/v-gouv-fr-modal/VGouvFrModal.vue";
import ProfileFooter from "@/components/footer/ProfileFooter.vue";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import BigRadio from "df-shared/src/Button/BigRadio.vue";
import cloneDeep from "lodash/cloneDeep";

extend("regex", {
  ...regex,
  message: "number-not-valid"
});

extend("required", {
  ...required,
  message: "field-required"
});

@Component({
  components: {
    ValidationProvider,
    ValidationObserver,
    DocumentInsert,
    FileUpload,
    ListItem,
    DfButton,
    WarningMessage,
    ConfirmModal,
    Modal,
    GuarantorChoiceHelp,
    VGouvFrModal,
    ProfileFooter,
    NakedCard,
    BigRadio
  },
  computed: {
    ...mapState({
      selectedGuarantor: "selectedGuarantor"
    }),
    ...mapGetters({
      guarantorFinancialDocumentSelected: "guarantorFinancialDocumentSelected"
    })
  }
})
export default class GuarantorFinancialDocumentForm extends Vue {
  selectedGuarantor!: Guarantor;
  guarantorFinancialDocumentSelected!: FinancialDocument;
  financialDocument = new FinancialDocument();

  documents = DocumentTypeConstants.GUARANTOR_FINANCIAL_DOCS;
  isDocDeleteVisible = false;
  selectedDoc?: FinancialDocument;
  isNoIncomeAndFiles = false;

  beforeMount() {
    this.financialDocument = {
      ...cloneDeep(this.guarantorFinancialDocumentSelected)
    };
  }

  isNewDocument(f: FinancialDocument) {
    if (f.id !== null) {
      const doc = this.selectedGuarantor.documents?.find((d: DfDocument) => {
        return d.id === f.id;
      });
      if (doc !== undefined) {
        return doc.documentSubCategory !== f.documentType.value;
      }
    }
    return false;
  }

  onSelectChange() {
    if (this.financialDocument.id === null) {
      return false;
    }

    const doc = this.selectedGuarantor.documents?.find((d: DfDocument) => {
      return d.id === this.financialDocument.id;
    });
    if (doc === undefined) {
      return false;
    }

    this.isDocDeleteVisible =
      (doc.files?.length || 0) > 0 &&
      doc.documentSubCategory !== this.financialDocument.documentType.value;

    if (this.isDocDeleteVisible) {
      this.selectedDoc = this.financialDocument;
    }
    return false;
  }

  undoSelect() {
    if (this.selectedGuarantor.documents === null) {
      return;
    }
    const doc = this.selectedGuarantor.documents?.find((d: DfDocument) => {
      return d.id === this.selectedDoc?.id;
    });
    if (doc !== undefined) {
      const localDoc = this.documents.find((d: DocumentType) => {
        return d.value === doc.documentSubCategory;
      });
      if (localDoc !== undefined && this.selectedDoc) {
        this.selectedDoc.documentType = localDoc;
      }
    }
    this.isDocDeleteVisible = false;
  }

  async validSelect() {
    this.isDocDeleteVisible = false;
    if (this.selectedGuarantor.documents !== null) {
      const doc = this.selectedGuarantor.documents?.find((d: DfDocument) => {
        return d.id === this.selectedDoc?.id;
      });
      if (doc?.files !== undefined) {
        for (const f of doc.files) {
          if (f.id && this.selectedDoc) {
            await this.remove(this.selectedDoc, f, true);
          }
        }
      }
    }
  }

  addFiles(f: FinancialDocument, fileList: File[]) {
    const nf = Array.from(fileList).map(f => {
      return { name: f.name, file: f, size: f.size };
    });
    f.files = [...f.files, ...nf];
    this.save();
  }

  resetFiles(f: FinancialDocument) {
    f.fileUploadStatus = UploadStatus.STATUS_INITIAL;
  }

  async save(): Promise<boolean> {
    const fieldName = "documents";
    const formData = new FormData();
    if (this.financialDocument.documentType.key === undefined) {
      return true;
    }
    if (!this.financialDocument.noDocument) {
      const newFiles = this.financialDocument.files.filter(f => {
        return !f.id;
      });
      if (!this.financialFiles().length) {
        return false;
      }

      if (
        this.financialDocument.documentType.maxFileCount &&
        this.financialFiles().length >
          this.financialDocument.documentType.maxFileCount
      ) {
        Vue.toasted.global.max_file({
          message: this.$i18n.t("max-file", [
            this.financialFiles().length,
            this.financialDocument.documentType.maxFileCount
          ])
        });
        return false;
      }

      Array.from(Array(newFiles.length).keys()).map(x => {
        const f: File = newFiles[x].file || new File([], "");
        formData.append(`${fieldName}[${x}]`, f, newFiles[x].name);
      });
    } else {
      if (this.financialFiles().length > 0) {
        this.isNoIncomeAndFiles = true;
        return false;
      }
    }
    if (this.financialDocument.id) {
      const original = this.$store.getters.guarantorFinancialDocuments?.find(
        (d: DfDocument) => {
          return d.id === this.financialDocument.id;
        }
      );
      if (
        this.financialDocument.noDocument === original.noDocument &&
        this.financialDocument.monthlySum === original.monthlySum &&
        this.financialDocument.files.length === original.files.length
      ) {
        return true;
      }
    }

    const typeDocumentFinancial =
      this.financialDocument.documentType?.value || "";
    formData.append("typeDocumentFinancial", typeDocumentFinancial);

    formData.append(
      "noDocument",
      this.financialDocument.noDocument ? "true" : "false"
    );
    formData.append("customText", this.financialDocument.customText);

    if (this.financialDocument.monthlySum) {
      formData.append(
        "monthlySum",
        this.financialDocument.monthlySum.toString()
      );
    } else {
      return false;
    }
    if (this.financialDocument.id) {
      formData.append("documentId", this.financialDocument.id.toString());
    }
    if (this.financialDocument.customText != "") {
      formData.append("customText", this.financialDocument.customText);
    }

    this.financialDocument.fileUploadStatus = UploadStatus.STATUS_SAVING;
    formData.append("guarantorId", this.$store.getters.guarantor.id);
    const loader = this.$loading.show();
    const res = await this.$store
      .dispatch("saveGuarantorFinancial", formData)
      .then(() => {
        this.financialDocument = {
          ...cloneDeep(this.guarantorFinancialDocumentSelected)
        };
      })
      .catch(() => {
        this.financialDocument.fileUploadStatus = UploadStatus.STATUS_FAILED;
        Vue.toasted.global.save_failed();
        return false;
      });
    loader.hide();
    if (!res) {
      return false;
    }
    this.financialDocument.files = [];
    this.financialDocument.fileUploadStatus = UploadStatus.STATUS_INITIAL;
    Vue.toasted.global.save_success();
    return true;
  }

  financialFiles() {
    const newFiles = this.financialDocument.files.map((file: DfFile) => {
      return {
        documentSubCategory: this.financialDocument.documentType?.value,
        id: file.name,
        name: file.name,
        size: file.size
      };
    });
    const existingFiles =
      this.$store.getters.getGuarantorDocuments?.find((d: DfDocument) => {
        return d.id === this.financialDocument.id;
      })?.files || [];
    return [...newFiles, ...existingFiles];
  }

  async remove(f: FinancialDocument, file: DfFile, silent = false) {
    if (file.path && file.id) {
      await RegisterService.deleteFile(file.id, silent);
    } else {
      const firstIndex = f.files.findIndex(f => {
        return f.name === file.name && f.file === file.file && !f.id;
      });
      f.files.splice(firstIndex, 1);
    }
  }

  goBack() {
    this.$store.commit("selectGuarantorDocumentFinancial", undefined);
  }

  async goNext() {
    if (await this.save()) {
      this.$store.commit("selectGuarantorDocumentFinancial", undefined);
    }
  }

  getCheckboxLabel(key: string) {
    if (key === "guarantor_salary") {
      return "noDocument-salary";
    }
    if (key === "pension") {
      return "noDocument-pension";
    }
    if (key === "rent") {
      return "noDocument-rent";
    }
    if (key === "scholarship") {
      return "noDocument-scholarship";
    }
    if (key === "social-service") {
      return "noDocument-social";
    }
    return "";
  }

  getCustomTextLabel(key: string) {
    if (key === "guarantor_salary") {
      return "customText-salary";
    }
    if (key === "pension") {
      return "customText-pension";
    }
    if (key === "rent") {
      return "customText-rent";
    }
    if (key === "scholarship") {
      return "customText-scholarship";
    }
    if (key === "social-service") {
      return "customText-social";
    }
    return "";
  }
}
</script>

<style scoped lang="scss"></style>

<i18n>
{
"en": {
  "salary": "Salary",
  "guarantor_salary": "Salary or other professional income",
  "social-service": "Social benefit payments",
  "rent": "Annuities",
  "pension": "Pensions",
  "scholarship": "Scholarship",
  "monthlySum": "Value in euros",
  "monthlySum-label": "Monthly salary (after tax)",
  "noDocument-social": "I cannot provide proof of payment of social benefits",
  "noDocument-salary": "I cannot provide the last three payslips or a balance sheet of my guarantor",
  "noDocument-rent": "I cannot provide proof of rent",
  "noDocument-pension": "I cannot provide proof of pension",
  "noDocument-scholarship": "I cannot provide proof of scholarship",
  "customText-social": "In order to improve my file, I explain why I cannot provide the justificatives:",
  "customText-salary": "In order to improve my file, I explain why I cannot provide the last three payslips or a balance sheet of my guarantor:",
  "customText-rent": "In order to improve my file, I explain why I cannot provide the justificatives:",
  "customText-pension": "In order to improve my file, I explain why I cannot provide the justificatives:",
  "customText-scholarship": "In order to improve my file, I explain why I cannot provide the justificatives:",
  "high-salary": "You have entered a salary greater than € 10,000 are you sure you have entered your guarantor monthly salary?",
  "low-salary": "You have entered a salary equal to 0 € are you sure you have entered your guarantor monthly salary?",
  "number-not-valid": "Number not valid",
  "delete-financial":  "Delete this salary",
  "field-required": "This field is required",
  "will-delete-files": "Please note, a change of situation will result in the deletion of your supporting documents. You will have to upload the supporting documents corresponding to your situation again.",
  "register": "Register",
  "warning-no-income-and-file": "You can't have files and no income. You must uncheck the box or delete your files.",
  "select-label": "Attention, Please enter only your guarantor own income."
},
"fr": {
  "salary": "Salaire",
  "guarantor_salary": "Salaires",
  "social-service": "Prestations sociales",
  "rent": "Rentes",
  "pension": "Pensions",
  "scholarship": "Bourses",
  "monthlySum": "Montant en euros",
  "monthlySum-label": "J'indique le montant de mon revenu mensuel net à payer (avant prélèvement à la source)",
  "noDocument-social": "Je ne peux pas fournir de justificatifs de versement de prestations sociales",
  "noDocument-salary": "Je ne peux pas fournir les trois derniers bulletins de salaire ou un bilan comptable de mon garant",
  "noDocument-pension": "Je ne peux pas fournir de justificatifs de versement de pension",
  "noDocument-rent": "Je ne peux pas fournir de justificatifs de versement de rente",
  "noDocument-scholarship": "Je ne peux pas fournir de justificatifs d'attribution de bourse",
  "customText-social": "Afin d'améliorer mon dossier, j'explique pourquoi je ne peux pas fournir les justificatifs de mon garant :",
  "customText-salary": "Afin d'améliorer mon dossier, j'explique pourquoi je ne peux pas fournir les trois derniers bulletins de salaire ou un bilan comptable de mon garant :",
  "customText-pension": "Afin d'améliorer mon dossier, j'explique pourquoi je ne peux pas fournir les justificatifs de mon garant :",
  "customText-rent": "Afin d'améliorer mon dossier, j'explique pourquoi je ne peux pas fournir les justificatifs de mon garant :",
  "customText-scholarship": "Afin d'améliorer mon dossier, j'explique pourquoi je ne peux pas fournir les justificatifs de mon garant :",
  "high-salary": "Vous avez saisi un salaire supérieur à 10 000€ êtes-vous sûr d'avoir saisi le salaire mensuel ?",
  "low-salary": "Vous avez saisi un salaire égal à 0€ êtes-vous sûr d'avoir saisi le salaire mensuel ?",
  "number-not-valid": "Nombre incorrect",
  "delete-financial":  "Supprimer ce revenu",
  "field-required": "Ce champ est requis",
  "will-delete-files": "Attention, un changement de situation entraînera la suppression des justificatifs. Vous devrez charger de nouveau les justificatifs correspondant à la situation de votre garant.",
  "register": "Enregistrer",
  "select-label": "Attention, Veuillez renseigner uniquement les revenus de votre garant.",
  "warning-no-income-and-file": "Vous ne pouvez pas avoir des fichiers et indiquer ne pas pouvoir fournir tous les fichiers. Veuillez décocher la case ou supprimer vos fichiers."
}
}
</i18n>
