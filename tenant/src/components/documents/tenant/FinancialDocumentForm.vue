<template>
  <div>
    <ValidationObserver v-slot="{ validate }">
      <form name="form" @submit.prevent="validate().then(save)">
        <NakedCard class="fr-p-md-5w fr-mb-3w">
          <div>
            <h1 class="fr-h6">
              {{ $t("financialdocumentform.title") }}
            </h1>

            <div class="fr-mt-3w">
              <SimpleRadioButtons
                name="application-type-selector"
                v-model="financialDocument.documentType"
                @input="onSelectChange"
                :elements="mapDocuments()"
              ></SimpleRadioButtons>
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
                    :rules="{ required: true, regex: /^[0-9 ]+$/ }"
                    v-slot="{ errors, valid }"
                  >
                    <div
                      class="fr-input-group"
                      :class="{
                        'fr-input-group--error': errors[0],
                      }"
                    >
                      <label for="monthlySum" class="fr-label">
                        {{ getMonthlySumLabel() }} :
                      </label>
                      <input
                        id="monthlySum"
                        :placeholder="
                          $tc('financialdocumentform.monthlySum.placeholder')
                        "
                        type="number"
                        min="0"
                        step="1"
                        v-model="financialDocument.monthlySum"
                        name="monthlySum"
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
                      <span
                        class="fr-error-text"
                        v-if="financialDocument.monthlySum > 10000"
                      >
                        {{ $t("financialdocumentform.high-salary") }}
                      </span>
                      <span
                        class="fr-error-text"
                        v-if="
                          financialDocument.monthlySum !== '' &&
                          financialDocument.monthlySum <= 0
                        "
                      >
                        {{ $t("financialdocumentform.low-salary") }}
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
              <div class="fr-mb-3w">
                <p
                  v-html="
                    $t(
                      `explanation-text.tenant.${financialDocument.documentType.key}`
                    )
                  "
                ></p>
              </div>
              <AllDeclinedMessages
                class="fr-mb-3w"
                :documentDeniedReasons="documentDeniedReasons"
                :documentStatus="documentStatus"
              ></AllDeclinedMessages>
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
              <div class="fr-mb-3w">
                <FileUpload
                  :current-status="financialDocument.fileUploadStatus"
                  @add-files="addFiles(...arguments)"
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
                  v-slot="{ errors, valid }"
                >
                  <div class="fr-input-group">
                    <label class="fr-label" for="customText">
                      {{
                        $t(
                          `financialdocumentform.customText-${financialDocument.documentType.key}`
                        )
                      }}
                    </label>
                    <textarea
                      v-model="financialDocument.customText"
                      class="form-control fr-input validate-required"
                      :class="{
                        'fr-input--valid': valid,
                        'fr-input--error': errors[0],
                      }"
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
        <ValidationObserver v-slot="{ validate, valid }">
          <form name="customTextForm" @submit.prevent="validate().then(save)">
            <div class="fr-input-group">
              <label class="fr-label" for="customTextNoDocument">
                {{ $t("financialdocumentform.has-no-income") }}
              </label>
              <textarea
                v-model="financialDocument.customText"
                maxlength="2000"
                rows="3"
                class="form-control fr-input validate-required"
                :class="{
                  'fr-input--valid': valid,
                }"
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
    <Modal v-show="isNoIncomeAndFiles" @close="isNoIncomeAndFiles = false">
      <template v-slot:body>
        <div class="fr-container">
          <div class="fr-grid-row justify-content-center">
            <div class="fr-col-12">
              <p>
                {{ $t("financialdocumentform.warning-no-income-and-file") }}
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
      <span>{{ $t("financialdocumentform.will-delete-files") }}</span>
    </ConfirmModal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { DocumentType } from "df-shared/src/models/Document";
import DocumentInsert from "../share/DocumentInsert.vue";
import FileUpload from "../../uploads/FileUpload.vue";
import { mapGetters } from "vuex";
import { UploadStatus } from "df-shared/src/models/UploadStatus";
import { FinancialDocument } from "df-shared/src/models/FinancialDocument";
import ListItem from "../../uploads/ListItem.vue";
import { User } from "df-shared/src/models/User";
import { DfFile } from "df-shared/src/models/DfFile";
import { DfDocument } from "df-shared/src/models/DfDocument";
import { extend, ValidationObserver, ValidationProvider } from "vee-validate";
import { RegisterService } from "../../../services/RegisterService";
import DfButton from "df-shared/src/Button/Button.vue";
import { regex } from "vee-validate/dist/rules";
import WarningMessage from "df-shared/src/components/WarningMessage.vue";
import { DocumentTypeConstants } from "../share/DocumentTypeConstants";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";
import Modal from "df-shared/src/components/Modal.vue";
import DocumentHelp from "../../helps/DocumentHelp.vue";
import VGouvFrModal from "df-shared/src/GouvFr/v-gouv-fr-modal/VGouvFrModal.vue";
import { AnalyticsService } from "../../../services/AnalyticsService";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import ProfileFooter from "../../footer/ProfileFooter.vue";
import { cloneDeep } from "lodash";
import AllDeclinedMessages from "../share/AllDeclinedMessages.vue";
import { DocumentDeniedReasons } from "df-shared/src/models/DocumentDeniedReasons";
import TroubleshootingModal from "@/components/helps/TroubleshootingModal.vue";
import { UtilsService } from "@/services/UtilsService";
import SimpleRadioButtons from "df-shared/src/Button/SimpleRadioButtons.vue";

extend("regex", {
  ...regex,
  message: "financialdocumentform.number-not-valid",
});

@Component({
  components: {
    AllDeclinedMessages,
    ValidationProvider,
    ValidationObserver,
    DocumentInsert,
    FileUpload,
    ListItem,
    DfButton,
    WarningMessage,
    ConfirmModal,
    Modal,
    DocumentHelp,
    VGouvFrModal,
    ProfileFooter,
    NakedCard,
    TroubleshootingModal,
    SimpleRadioButtons,
  },
  computed: {
    ...mapGetters({
      user: "userToEdit",
      financialDocumentSelected: "financialDocumentSelected",
      tenantFinancialDocuments: "tenantFinancialDocuments",
    }),
  },
})
export default class FinancialDocumentForm extends Vue {
  documents = DocumentTypeConstants.FINANCIAL_DOCS;

  user!: User;
  financialDocumentSelected!: FinancialDocument;
  tenantFinancialDocuments!: FinancialDocument[];

  documentDeniedReasons = new DocumentDeniedReasons();
  isDocDeleteVisible = false;
  selectedDoc?: FinancialDocument;
  isNoIncomeAndFiles = false;
  financialDocument = new FinancialDocument();

  beforeMount() {
    this.financialDocument = { ...cloneDeep(this.financialDocumentSelected) };
    const doc = this.tenantFinancialDocument();
    if (doc?.documentDeniedReasons) {
      this.documentDeniedReasons = cloneDeep(
        this.tenantFinancialDocument().documentDeniedReasons
      );
    }
  }

  get documentStatus() {
    return this.tenantFinancialDocument()?.documentStatus;
  }

  tenantFinancialDocument() {
    return this.$store.getters.getTenantDocuments?.find((d: DfDocument) => {
      return d.id === this.financialDocument.id;
    });
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
      doc.subCategory !== this.financialDocument.documentType.value;
    return false;
  }

  undoSelect() {
    if (this.user.documents !== null) {
      const doc = this.user.documents?.find((d: DfDocument) => {
        return d.id === this.selectedDoc?.id;
      });
      if (doc !== undefined) {
        const localDoc = this.documents.find((d: DocumentType) => {
          return d.value === doc.subCategory;
        });
        if (localDoc !== undefined && this.selectedDoc) {
          this.selectedDoc.documentType = localDoc;
        }
      }
    }
    this.isDocDeleteVisible = false;
  }

  async validSelect() {
    this.isDocDeleteVisible = false;
    if (this.user.documents === null) {
      return;
    }
    const doc = this.user.documents?.find((d: DfDocument) => {
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

  addFiles(fileList: File[]) {
    AnalyticsService.uploadFile("financial");
    const nf = Array.from(fileList).map((f) => {
      return { name: f.name, file: f, size: f.size };
    });
    this.financialDocument.files = [...this.financialDocument.files, ...nf];
    this.save();
  }

  resetFiles(f: FinancialDocument) {
    f.fileUploadStatus = UploadStatus.STATUS_INITIAL;
  }

  async save(): Promise<boolean> {
    const fieldName = "documents";
    const formData = new FormData();
    if (this.financialDocument.documentType.key === undefined) {
      return Promise.resolve(true);
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
        return Promise.resolve(true);
      }
    }
    AnalyticsService.registerFile("financial");
    if (!this.financialDocument.noDocument) {
      if (
        !this.financialFiles().length &&
        this.financialDocument.documentType.key !== "no-income"
      ) {
        Vue.toasted.global.max_file({
          message: this.$i18n.t("financialdocumentform.missing-file"),
        });
        this.financialDocument.files = [];
        return Promise.reject(new Error("missing-file"));
      }

      if (
        this.financialDocument.documentType.maxFileCount &&
        this.financialFiles().length >
          this.financialDocument.documentType.maxFileCount
      ) {
        Vue.toasted.global.max_file({
          message: this.$i18n.t("max-file", [
            this.financialFiles().length,
            this.financialDocument.documentType.maxFileCount,
          ]),
        });
        return Promise.reject(new Error("max-file"));
      }

      const newFiles = this.financialDocument.files.filter((f) => {
        return !f.id;
      });
      Array.from(Array(newFiles.length).keys()).forEach((x) => {
        const f: File = newFiles[x].file || new File([], "");
        formData.append(`${fieldName}[${x}]`, f, newFiles[x].name);
      });
    } else {
      if (this.financialFiles().length > 0) {
        this.isNoIncomeAndFiles = true;
        return Promise.reject(new Error("err"));
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
      return Promise.reject(new Error("err"));
    }
    if (this.financialDocument.id) {
      formData.append("id", this.financialDocument.id.toString());
    }

    this.financialDocument.fileUploadStatus = UploadStatus.STATUS_SAVING;
    const loader = this.$loading.show();
    const res = await this.$store
      .dispatch("saveTenantFinancial", formData)
      .then(() => {
        this.financialDocument = {
          ...cloneDeep(this.financialDocumentSelected),
        };
        Vue.toasted.global.save_success();
        return Promise.resolve(true);
      })
      .catch((err) => {
        this.financialDocument.fileUploadStatus = UploadStatus.STATUS_FAILED;
        UtilsService.handleCommonSaveError(err);
        return Promise.reject(new Error("err"));
      })
      .finally(() => {
        loader.hide();
      });
    return res;
  }

  financialFiles() {
    const newFiles = this.financialDocument.files.map((file: DfFile) => {
      return {
        subCategory: this.financialDocument.documentType?.value,
        id: file.id,
        name: file.name,
        size: file.size,
      };
    });
    const existingFiles =
      this.$store.getters.getTenantDocuments?.find((d: DfDocument) => {
        return d.id === this.financialDocument.id;
      })?.files || [];
    return [...newFiles, ...existingFiles];
  }

  async remove(f: FinancialDocument, file: DfFile, silent = false) {
    AnalyticsService.deleteFile("financial");
    if (file.id) {
      await RegisterService.deleteFile(file.id, silent);
    } else {
      const firstIndex = f.files.findIndex((lf) => {
        return lf.name === file.name && !lf.path;
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

  getMonthlySumLabel() {
    const docType = this.financialDocument?.documentType.key;
    let label = this.$tc("financialdocumentform.monthlySum.label");
    if (docType === "salary" || docType === "pension" || docType === "rent") {
      label += " ";
      label += this.$tc("financialdocumentform.monthlySum.label-tax");
    }
    return label;
  }

  mapDocuments() {
    return this.documents.map((d) => {
      return {
        id: d.key,
        labelKey: "documents." + d.key,
        value: d,
      };
    });
  }
}
</script>
