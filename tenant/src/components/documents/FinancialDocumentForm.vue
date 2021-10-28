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
      <form name="form" @submit.prevent="validate().then(save())">
        <NakedCard class="fr-p-md-5w fr-mb-3w">
          <div>
            <div class="fr-pl-3v">
              <h5>
                {{ $t("title") }}
              </h5>
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
                  <DocumentHelp></DocumentHelp>
                  <DocumentInsert
                    :allow-list="financialDocument.documentType.acceptedProofs"
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
                    <div v-for="d in documents" :key="d.key">
                      <BigRadio
                        v-if="d.key !== 'no-income' || hasNoFinancial()"
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
        </NakedCard>
        <NakedCard
          class="fr-p-md-5w fr-mb-3w"
          v-if="
            financialDocument.documentType.key &&
              financialDocument.documentType.key !== 'no-income'
          "
        >
          <div>
            <div>
              <div
                v-if="
                  financialDocument.documentType &&
                    financialDocument.documentType.key &&
                    financialDocument.documentType.key !== 'no-income'
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
          </div>
          <div
            class="fr-mt-3w"
            v-if="
              financialDocument.documentType.key &&
                financialDocument.documentType.key !== 'no-income' &&
                financialDocument.monthlySum >= 0 &&
                financialDocument.monthlySum !== ''
            "
          >
            <div>
              <div>
                <div class="fr-mb-3w">
                  {{ financialDocument.documentType.explanationText }}
                </div>
                <div class="fr-mb-3w">
                  <FileUpload
                    :current-status="financialDocument.fileUploadStatus"
                    @add-files="addFiles(...arguments)"
                    @reset-files="resetFiles(financialDocument, ...arguments)"
                  ></FileUpload>
                </div>
                <div class="fr-col-12 fr-mb-3w bg-purple">
                  <input
                    type="checkbox"
                    id="noDocument"
                    value="false"
                    v-model="financialDocument.noDocument"
                  />
                  <label for="noDocument">
                    {{
                      $t(getCheckboxLabel(financialDocument.documentType.key))
                    }}
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
                          $t(`customText-${financialDocument.documentType.key}`)
                        }}
                      </label>
                      <textarea
                        v-model="financialDocument.customText"
                        class="form-control fr-input validate-required"
                        id="customText"
                        name="customText"
                        placeholder=""
                        type="text"
                        maxlength="2000"
                        rows="3"
                        required
                      />
                      <span
                        >{{ financialDocument.customText.length }} / 2000</span
                      >
                      <span class="fr-error-text" v-if="errors[0]">{{
                        $t(errors[0])
                      }}</span>
                    </div>
                  </validation-provider>
                </div>
              </div>
            </div>
            <div
              v-if="
                financialDocument.documentType.key &&
                  financialDocument.documentType.key !== 'no-income' &&
                  financialFiles().length > 0
              "
              class="fr-col-md-12 fr-mb-3w"
            >
              <ListItem
                v-for="(file, k) in financialFiles()"
                :key="k"
                :file="file"
                @remove="remove(financialDocument, file)"
              />
            </div>
          </div>
        </NakedCard>
      </form>
    </ValidationObserver>
    <div
      v-if="
        financialDocument.documentType.key &&
          financialDocument.documentType.key === 'no-income'
      "
    >
      <NakedCard class="fr-p-md-5w fr-mb-3w">
        {{ $t("has-no-income") }}
        <ValidationObserver v-slot="{ validate }">
          <form name="customTextForm" @submit.prevent="validate().then(save())">
            <div class="fr-input-group">
              <label class="fr-label" for="customTextNoDocument">
                {{ $t("custom-text") }}
              </label>
              <textarea
                v-model="financialDocument.customText"
                maxlength="2000"
                rows="3"
                class="form-control fr-input validate-required"
                id="customTextNoDocument"
                name="customText"
                placeholder=""
                type="text"
              />
              <span>{{ financialDocument.customText.length }} / 2000</span>
            </div>
          </form>
        </ValidationObserver>
      </NakedCard>
    </div>
    <ProfileFooter @on-back="goBack" @on-next="goNext"></ProfileFooter>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { DocumentType } from "df-shared/src/models/Document";
import DocumentInsert from "@/components/documents/DocumentInsert.vue";
import FileUpload from "@/components/uploads/FileUpload.vue";
import { mapGetters } from "vuex";
import { UploadStatus } from "df-shared/src/models/UploadStatus";
import { FinancialDocument } from "df-shared/src/models/FinancialDocument";
import ListItem from "@/components/uploads/ListItem.vue";
import { User } from "df-shared/src/models/User";
import { DfFile } from "df-shared/src/models/DfFile";
import { DfDocument } from "df-shared/src/models/DfDocument";
import { extend } from "vee-validate";
import { RegisterService } from "../../services/RegisterService";
import DfButton from "df-shared/src/Button/Button.vue";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { required, regex } from "vee-validate/dist/rules";
import WarningMessage from "df-shared/src/components/WarningMessage.vue";
import { DocumentTypeConstants } from "./DocumentTypeConstants";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";
import Modal from "df-shared/src/components/Modal.vue";
import BigRadio from "df-shared/src/Button/BigRadio.vue";
import DocumentHelp from "../helps/DocumentHelp.vue";
import VGouvFrModal from "df-shared/src/GouvFr/v-gouv-fr-modal/VGouvFrModal.vue";
import { AnalyticsService } from "../../services/AnalyticsService";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import ProfileFooter from "@/components/footer/ProfileFooter.vue";
import { cloneDeep } from "lodash";

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
    BigRadio,
    DocumentHelp,
    VGouvFrModal,
    ProfileFooter,
    NakedCard
  },
  computed: {
    ...mapGetters({
      user: "userToEdit",
      financialDocumentSelected: "financialDocumentSelected",
      tenantFinancialDocuments: "tenantFinancialDocuments"
    })
  }
})
export default class FinancialDocumentForm extends Vue {
  user!: User;
  tenantFinancialDocuments!: FinancialDocument[];

  documents = DocumentTypeConstants.FINANCIAL_DOCS;
  isDocDeleteVisible = false;
  selectedDoc?: FinancialDocument;
  isNoIncomeAndFiles = false;
  financialDocumentSelected!: FinancialDocument;
  financialDocument = new FinancialDocument();

  beforeMount() {
    this.financialDocument = { ...cloneDeep(this.financialDocumentSelected) };
  }

  isNewDocument(f: FinancialDocument) {
    if (f.id !== null) {
      const doc = this.user.documents?.find((d: DfDocument) => {
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

    const doc = this.user.documents?.find((d: DfDocument) => {
      return d.id === this.financialDocument.id;
    });
    if (doc === undefined) {
      return false;
    }

    this.selectedDoc = this.financialDocument;
    this.isDocDeleteVisible =
      (doc.files?.length || 0) > 0 &&
      doc.documentSubCategory !== this.financialDocument.documentType.value;
    return false;
  }

  undoSelect() {
    if (this.user.documents !== null) {
      const doc = this.user.documents?.find((d: DfDocument) => {
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
    }
    this.isDocDeleteVisible = false;
  }

  validSelect() {
    this.isDocDeleteVisible = false;
    if (this.user.documents === null) {
      return;
    }
    const doc = this.user.documents?.find((d: DfDocument) => {
      return d.id === this.selectedDoc?.id;
    });
    if (doc !== undefined) {
      doc.files?.forEach(f => {
        if (f.id && this.selectedDoc) {
          this.remove(this.selectedDoc, f, true);
        }
      });
    }
  }

  addFiles(fileList: File[]) {
    AnalyticsService.uploadFile("financial");
    const nf = Array.from(fileList).map(f => {
      return { name: f.name, file: f, size: f.size };
    });
    this.financialDocument.files = [...this.financialDocument.files, ...nf];
    this.save();
  }

  resetFiles(f: FinancialDocument) {
    f.fileUploadStatus = UploadStatus.STATUS_INITIAL;
  }

  async save() {
    if (this.financialDocument.documentType.key === undefined) {
      return true;
    }
    if (this.financialDocument.id) {
      const original = this.tenantFinancialDocuments?.find((d: DfDocument) => {
        return d.id === this.financialDocument.id;
      });
      if (
        original &&
        this.financialDocument.noDocument === original.noDocument &&
        this.financialDocument.monthlySum === original.monthlySum &&
        this.financialDocument.files.length === original.files.length &&
        this.financialDocument.customText === original.customText
      ) {
        return true;
      }
    }
    AnalyticsService.registerFile("financial");
    const fieldName = "documents";
    const formData = new FormData();
    if (!this.financialDocument.noDocument) {
      const newFiles = this.financialDocument.files.filter(f => {
        return !f.id;
      });
      if (
        !this.financialFiles().length &&
        this.financialDocument.documentType.key !== "no-income"
      ) {
        Vue.toasted.global.max_file({
          message: this.$i18n.t("missing-file")
        });
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

    const typeDocumentFinancial =
      this.financialDocument.documentType?.value || "";
    formData.append("typeDocumentFinancial", typeDocumentFinancial);

    if (this.financialDocument.documentType.key === "no-income") {
      this.financialDocument.noDocument = true;
      this.financialDocument.monthlySum = 0;
    }

    formData.append(
      "noDocument",
      this.financialDocument.noDocument ? "true" : "false"
    );
    if (
      this.financialDocument.documentType.key === "no-income" &&
      !this.financialDocument.customText
    ) {
      formData.append("customText", "-");
    } else {
      formData.append("customText", this.financialDocument.customText);
    }

    if (
      this.financialDocument.monthlySum !== undefined &&
      this.financialDocument.monthlySum >= 0
    ) {
      formData.append(
        "monthlySum",
        this.financialDocument.monthlySum.toString()
      );
    } else {
      return;
    }
    if (this.financialDocument.id) {
      formData.append("id", this.financialDocument.id.toString());
    }

    this.financialDocument.fileUploadStatus = UploadStatus.STATUS_SAVING;
    const loader = this.$loading.show();
    await this.$store
      .dispatch("saveTenantFinancial", formData)
      .then(() => {
        this.financialDocument = {
          ...cloneDeep(this.financialDocumentSelected)
        };
        Vue.toasted.global.save_success();
      })
      .catch(() => {
        this.financialDocument.fileUploadStatus = UploadStatus.STATUS_FAILED;
        Vue.toasted.global.save_failed();
      })
      .finally(() => {
        loader.hide();
      });
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
      this.$store.getters.getTenantDocuments?.find((d: DfDocument) => {
        return d.id === this.financialDocument.id;
      })?.files || [];
    return [...newFiles, ...existingFiles];
  }

  remove(f: FinancialDocument, file: DfFile, silent = false) {
    AnalyticsService.deleteFile("financial");
    if (file.path && file.id) {
      RegisterService.deleteFile(file.id, silent);
    } else {
      const firstIndex = f.files.findIndex(f => {
        return f.name === file.name && f.file === file.file && !f.id;
      });
      f.files.splice(firstIndex, 1);
    }
  }

  getCheckboxLabel(key: string) {
    if (key === "salary") {
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

  goBack() {
    this.$store.commit("selectDocumentFinancial", undefined);
  }

  goNext() {
    this.save().then(() => {
      this.$store.commit("selectDocumentFinancial", undefined);
    });
  }

  hasNoFinancial() {
    return (
      this.tenantFinancialDocuments.length === 0 ||
      (this.tenantFinancialDocuments.length === 1 &&
        this.tenantFinancialDocuments[0].documentType.key === "no-income")
    );
  }
}
</script>

<i18n>
{
  "en": {
    "title": "Proof of resources",
    "will-delete-files": "Please note, a change of situation will result in the deletion of your supporting documents. You will have to upload the supporting documents corresponding to your situation again.",
    "monthlySum-label": "Salary (after tax)",
    "monthlySum": "Value in euros",
    "delete-financial":  "Delete this salary",
    "salary": "Salary",
    "guarantor_salary": "Salary or other professional income",
    "social-service": "Social benefit payments",
    "rent": "Annuities",
    "pension": "Pensions",
    "scholarship": "Scholarship",
    "custom-text": "In order to improve your file, you can add an eplanation :",
    "customText-social-service": "In order to improve my file, I explain why I cannot provide my justificatives:",
    "customText-salary": "In order to improve my file, I explain why I cannot provide my last three payslips:",
    "customText-pension": "In order to improve my file, I explain why I cannot provide my justificatives:",
    "customText-rent": "In order to improve my file, I explain why I cannot provide my justificatives:",
    "customText-scholarship": "In order to improve my file, I explain why I cannot provide my justificatives:",
    "noDocument-social": "I cannot provide proof of payment of social benefits",
    "noDocument-salary": "I cannot provide my last three payslips",
    "noDocument-rent": "I cannot provide proof of rent",
    "noDocument-pension": "I cannot provide proof of pension",
    "noDocument-scholarship": "I cannot provide proof of scholarship",
    "missing-file": "You must add files to save this income.",
    "high-salary": "You have entered a salary greater than € 10,000 are you sure you have entered your monthly salary?",
    "low-salary": "You have entered a salary equal to 0 € are you sure you have entered your monthly salary?",
    "has-no-income": "You have no income",
    "no-income": "No income"
  },
  "fr": {
    "title": "Justificatif de ressources",
    "will-delete-files": "Attention, un changement de situation entraînera la suppression de vos justificatifs. Vous devrez charger de nouveau les justificatifs correspondant à votre situation.",
    "monthlySum-label": "J'indique le montant de mon revenu mensuel net à payer (avant prélèvement à la source)",
    "monthlySum": "Montant en euros",
    "delete-financial":  "Supprimer ce revenu",
    "salary": "Salaire",
    "guarantor_salary": "Salaires ou autres revenus d’activité professionnelle",
    "social-service": "Prestations sociales",
    "rent": "Rentes",
    "pension": "Pensions",
    "scholarship": "Bourses",
    "custom-text": "Afin d'améliorer votre dossier, vous pouvez ajouter une explication :",
    "customText-social-service": "Afin d'améliorer mon dossier, j'explique pourquoi je ne peux pas fournir mes justificatifs :",
    "customText-salary": "Afin d'améliorer mon dossier, j'explique pourquoi je ne peux pas fournir mes trois derniers bulletins de salaire :",
    "customText-pension": "Afin d'améliorer mon dossier, j'explique pourquoi je ne peux pas fournir mes justificatifs :",
    "customText-rent": "Afin d'améliorer mon dossier, j'explique pourquoi je ne peux pas fournir mes justificatifs :",
    "customText-scholarship": "Afin d'améliorer mon dossier, j'explique pourquoi je ne peux pas fournir mes justificatifs :",
    "noDocument-social": "Je ne peux pas fournir de justificatifs de versement de prestations sociales",
    "noDocument-salary": "Je ne peux pas fournir mes trois derniers bulletins de salaire",
    "noDocument-pension": "Je ne peux pas fournir de justificatifs de versement de pension",
    "noDocument-rent": "Je ne peux pas fournir de justificatifs de versement de rente",
    "noDocument-scholarship": "Je ne peux pas fournir de justificatifs d'attribution de bourse",
    "missing-file": "Vous devez ajouter des fichiers pour sauvegarder ce revenu.",
    "high-salary": "Vous avez saisi un salaire supérieur à 10 000€ êtes-vous sûr d'avoir saisi votre salaire mensuel ?",
    "low-salary": "Vous avez saisi un salaire égal à 0€ êtes-vous sûr d'avoir saisi votre salaire mensuel ?",
    "has-no-income": "Vous avez indiqué ne pas avoir de revenu",
    "no-income": "Pas de revenu"
  }
}
</i18n>
