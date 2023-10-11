<template>
  <div class="fr-mb-5w">
    <ValidationObserver v-slot="{ validate }">
      <form name="form">
        <NakedCard class="fr-p-md-5w">
          <h1 class="fr-h6">{{ $t("tax-page.title") }}</h1>
          <div class="fr-mt-3w">
            <SimpleRadioButtons
              name="application-type-selector"
              v-model="taxDocument"
              @input="onSelectChange"
              :elements="mapDocuments()"
            ></SimpleRadioButtons>
          </div>
        </NakedCard>

        <NakedCard
          class="fr-p-md-5w fr-mt-3w"
          v-if="taxDocument.key && taxDocument.key === 'other-tax'"
        >
          <validation-provider rules="required" v-slot="{ errors, valid }">
            <div
              class="fr-input-group"
              :class="errors[0] ? 'fr-input-group--error' : ''"
            >
              <label class="fr-label" for="customText">{{
                $t("tax-page.custom-text")
              }}</label>
              <textarea
                v-model="customText"
                class="form-control fr-input validate-required"
                :class="{
                  'fr-input--valid': valid,
                  'fr-input--error': errors[0],
                }"
                id="customText"
                name="customText"
                placeholder=""
                type="text"
                required
                maxlength="2000"
                rows="4"
              />
              <span class="fr-error-text" v-if="errors[0]">{{
                $t(errors[0])
              }}</span>
            </div>
          </validation-provider>
        </NakedCard>
      </form>

      <NakedCard
        class="fr-p-md-5w fr-mt-3w"
        v-if="taxDocument.key === 'my-name' || taxFiles().length > 0"
      >
        <div class="fr-mb-3w fr-mt-3w" v-if="taxDocument.key === 'my-name'">
          <div class="fr-mb-3w">
            <div
              class="fr-mb-2w"
              v-html="$t(`explanation-text.tenant.${taxDocument.key}`)"
            ></div>
            <WarningTaxDeclaration />
          </div>
        </div>
        <AllDeclinedMessages
          class="fr-mb-3w"
          :documentDeniedReasons="documentDeniedReasons"
          :documentStatus="documentStatus"
        ></AllDeclinedMessages>
        <div v-if="taxFiles().length > 0" class="fr-col-12 fr-mb-3w">
          <ListItem
            v-for="(file, k) in taxFiles()"
            :key="k"
            :file="file"
            @remove="remove(file)"
          />
        </div>
        <div v-if="taxDocument.key === 'my-name'">
          <div class="fr-mb-3w">
            <FileUpload
              :current-status="fileUploadStatus"
              @add-files="addFiles"
              @reset-files="resetFiles"
            ></FileUpload>
          </div>
        </div>
      </NakedCard>
      <ProfileFooter
        @on-back="goBack"
        @on-next="validate().then(goNext)"
      ></ProfileFooter>
    </ValidationObserver>
    <ConfirmModal
      v-if="isDocDeleteVisible"
      @valid="validSelect()"
      @cancel="undoSelect()"
    >
      <span>{{ $t("tax-page.will-delete-files") }}</span>
    </ConfirmModal>
    <Modal
      v-if="isWarningTaxSituationModalVisible"
      @close="isWarningTaxSituationModalVisible = false"
    >
      <template v-slot:body>
        <div class="warning-tax-modal fr-pl-md-3w fr-pr-md-3w fr-pb-md-3w">
          <h1 class="avis-title fr-h4">
            <i class="ri-alarm-warning-line"></i>

            {{ $t("tax-page.avis-detected") }}
          </h1>
          <p>
            {{ $t("tax-page.avis-text1") }}
          </p>
          <p>
            {{ $t("tax-page.avis-text2") }}
          </p>
          <hr class="mobile" />
          <div class="btn-align">
            <DfButton
              @on-click="isWarningTaxSituationModalVisible = false"
              :primary="true"
              >{{ $t("tax-page.avis-btn") }}</DfButton
            >
          </div>
          <div class="btn-align fr-mt-2w">
            <a @click="forceSave" href="#">{{ $t("tax-page.avis-force") }}</a>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { DocumentType } from "df-shared/src/models/Document";
import DocumentInsert from "../share/DocumentInsert.vue";
import FileUpload from "../../uploads/FileUpload.vue";
import { mapGetters } from "vuex";
import { UploadStatus } from "df-shared/src/models/UploadStatus";
import ListItem from "../../uploads/ListItem.vue";
import { User } from "df-shared/src/models/User";
import { DfFile } from "df-shared/src/models/DfFile";
import { DfDocument } from "df-shared/src/models/DfDocument";
import { extend } from "vee-validate";
import { is } from "vee-validate/dist/rules";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { RegisterService } from "../../../services/RegisterService";
import WarningMessage from "df-shared/src/components/WarningMessage.vue";
import { DocumentTypeConstants } from "../share/DocumentTypeConstants";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";
import DfButton from "df-shared/src/Button/Button.vue";
import TaxHelp from "../../helps/TaxHelp.vue";
import { AnalyticsService } from "../../../services/AnalyticsService";
import ProfileFooter from "../../footer/ProfileFooter.vue";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import AllDeclinedMessages from "../share/AllDeclinedMessages.vue";
import { DocumentDeniedReasons } from "df-shared/src/models/DocumentDeniedReasons";
import { cloneDeep } from "lodash";
import TroubleshootingModal from "@/components/helps/TroubleshootingModal.vue";
import { PdfAnalysisService } from "../../../services/PdfAnalysisService";
import Modal from "df-shared/src/components/Modal.vue";
import { LoaderComponent } from "vue-loading-overlay";
import WarningTaxDeclaration from "@/components/documents/share/WarningTaxDeclaration.vue";
import { UtilsService } from "@/services/UtilsService";
import SimpleRadioButtons from "df-shared/src/Button/SimpleRadioButtons.vue";

extend("is", {
  ...is,
  message: "field-required",
  validate: (value) => !!value,
});

@Component({
  components: {
    AllDeclinedMessages,
    DocumentInsert,
    FileUpload,
    ListItem,
    ValidationObserver,
    ValidationProvider,
    WarningMessage,
    ConfirmModal,
    TaxHelp,
    ProfileFooter,
    NakedCard,
    TroubleshootingModal,
    Modal,
    DfButton,
    WarningTaxDeclaration,
    SimpleRadioButtons,
  },
  computed: {
    ...mapGetters({
      user: "userToEdit",
      tenantTaxDocument: "getTenantTaxDocument",
    }),
  },
})
export default class Tax extends Vue {
  documents = DocumentTypeConstants.TAX_DOCS;

  user!: User;
  tenantTaxDocument!: DfDocument;

  documentDeniedReasons = new DocumentDeniedReasons();

  fileUploadStatus = UploadStatus.STATUS_INITIAL;
  files: DfFile[] = [];
  uploadProgress: {
    [key: string]: { state: string; percentage: number };
  } = {};
  taxDocument = new DocumentType();

  customText = "";

  isDocDeleteVisible = false;
  isWarningTaxSituationModalVisible = false;
  newFiles: File[] = [];

  loader?: LoaderComponent;

  getTaxLocalStorageKey() {
    return "tax_" + this.user.email;
  }

  get documentStatus() {
    return this.tenantTaxDocument?.documentStatus;
  }

  beforeMount() {
    if (this.user.documents !== null) {
      if (this.tenantTaxDocument !== undefined) {
        this.customText = this.tenantTaxDocument.customText || "";
        const localDoc = this.documents.find((d: DocumentType) => {
          return d.value === this.tenantTaxDocument?.subCategory;
        });
        if (localDoc !== undefined) {
          this.taxDocument = localDoc;
          localStorage.setItem(
            this.getLocalStorageKey(),
            this.taxDocument.key || ""
          );
        }
        if (this.tenantTaxDocument?.documentDeniedReasons) {
          this.documentDeniedReasons = cloneDeep(
            this.tenantTaxDocument.documentDeniedReasons
          );
        }
      } else {
        const key = localStorage.getItem(this.getLocalStorageKey());
        if (key) {
          const localDoc = this.documents.find((d: DocumentType) => {
            return d.key === key;
          });
          if (localDoc !== undefined) {
            this.taxDocument = localDoc;
          }
        }
      }
    }
  }

  getLocalStorageKey() {
    return "tax_guarantor_" + this.user.email;
  }

  onSelectChange() {
    localStorage.setItem(this.getLocalStorageKey(), this.taxDocument.key);
    if (this.user.documents !== null) {
      const doc = this.tenantTaxDocument;
      if (doc !== undefined) {
        this.isDocDeleteVisible =
          (doc?.files?.length || 0) > 0 &&
          doc?.subCategory !== this.taxDocument.value;
      }
    }
    return false;
  }

  getRegisteredDoc() {
    if (this.user.documents !== null) {
      const doc = this.user.documents?.find((d: DfDocument) => {
        return d.documentCategory === "TAX";
      });
      return doc;
    }
    return undefined;
  }

  getLocalDoc() {
    const doc = this.getRegisteredDoc();
    if (doc !== undefined) {
      const localDoc = this.documents.find((d: DocumentType) => {
        return d.value === doc.subCategory;
      });
      return localDoc;
    }
    return undefined;
  }

  undoSelect() {
    if (this.user.documents !== null) {
      const doc = this.tenantTaxDocument;
      if (doc !== undefined) {
        const localDoc = this.documents.find((d: DocumentType) => {
          return d.value === doc?.subCategory;
        });
        if (localDoc !== undefined) {
          this.taxDocument = localDoc;
        }
      }
    }
    this.isDocDeleteVisible = false;
  }

  async validSelect() {
    this.isDocDeleteVisible = false;
    if (this.user.documents !== null) {
      const doc = this.user.documents?.find((d: DfDocument) => {
        return d.documentCategory === "TAX";
      });
      if (doc?.files !== undefined) {
        for (const f of doc.files) {
          if (f.id) {
            await this.remove(f, true);
          }
        }
      }
    }
  }

  async addFiles(fileList: File[]) {
    this.newFiles = fileList;
    this.showLoader();
    if (await PdfAnalysisService.includesRejectedTaxDocuments(fileList)) {
      this.isWarningTaxSituationModalVisible = true;
      this.hideLoader();
    } else {
      this.saveNewFiles(false);
    }
  }

  saveNewFiles(force: boolean) {
    AnalyticsService.uploadFile("tax");
    const nf = Array.from(this.newFiles).map((f) => {
      return { name: f.name, file: f, size: f.size };
    });
    this.files = [...this.files, ...nf];
    this.save(force);
  }

  forceSave() {
    this.isWarningTaxSituationModalVisible = false;
    this.saveNewFiles(true);
  }

  resetFiles() {
    this.fileUploadStatus = UploadStatus.STATUS_INITIAL;
  }

  async goNext() {
    const res = await this.save();
    if (res) {
      this.$emit("on-next");
    }
  }

  goBack() {
    this.$emit("on-back");
  }

  async save(force = false): Promise<boolean> {
    if (this.taxDocument.key === undefined) {
      return true;
    }
    AnalyticsService.registerFile("tax");
    this.uploadProgress = {};
    const fieldName = "documents";
    const formData = new FormData();
    const newFiles = this.files.filter((f) => {
      return !f.id;
    });
    if (newFiles.length) {
      if (
        this.taxDocument.maxFileCount &&
        this.taxFiles().length > this.taxDocument.maxFileCount
      ) {
        Vue.toasted.global.max_file({
          message: this.$i18n.t("max-file", [
            this.taxFiles().length,
            this.taxDocument.maxFileCount,
          ]),
        });
        this.files = [];
        return false;
      }

      Array.from(Array(newFiles.length).keys()).forEach((x) => {
        const f: File = newFiles[x].file || new File([], "");
        formData.append(`${fieldName}[${x}]`, f, newFiles[x].name);
      });
    }

    const d = this.getRegisteredDoc();
    if (
      this.taxDocument.value === d?.subCategory &&
      this.customText === (d?.customText || "") &&
      newFiles.length <= 0
    ) {
      return true;
    }

    if (this.taxDocument.key === "my-name") {
      formData.append("noDocument", "false");
    } else {
      formData.append("noDocument", "true");
    }

    formData.append("typeDocumentTax", this.taxDocument.value);

    if (this.taxDocument.key === "other-tax") {
      if (!this.customText || this.customText === "") {
        return false;
      }
      formData.append("customText", this.customText);
    }

    if (force) {
      formData.append("avisDetected", "true");
    } else {
      const files = this.files
        .map((f) => f.file as File)
        .filter((f) => f !== undefined);
      if (!(await PdfAnalysisService.includesRejectedTaxDocuments(files))) {
        formData.append("avisDetected", "false");
      }
    }

    this.fileUploadStatus = UploadStatus.STATUS_SAVING;
    this.showLoader();
    return await this.$store
      .dispatch("saveTenantTax", formData)
      .then(() => {
        this.files = [];
        this.fileUploadStatus = UploadStatus.STATUS_INITIAL;
        Vue.toasted.global.save_success();
        return true;
      })
      .catch((err) => {
        this.fileUploadStatus = UploadStatus.STATUS_FAILED;
        UtilsService.handleCommonSaveError(err);
        return false;
      })
      .finally(() => {
        this.hideLoader();
      });
  }

  taxFiles() {
    const newFiles = this.files.map((f) => {
      return {
        subCategory: this.taxDocument.value,
        id: f.id,
        name: f.name,
        file: f,
        size: f.size,
      };
    });
    const existingFiles =
      this.$store.getters.getTenantDocuments?.find((d: DfDocument) => {
        return d.documentCategory === "TAX";
      })?.files || [];
    return [...newFiles, ...existingFiles];
  }

  async remove(file: DfFile, silent = false) {
    AnalyticsService.deleteFile("tax");
    if (file.id) {
      await RegisterService.deleteFile(file.id, silent);
    } else {
      const firstIndex = this.files.findIndex((f) => {
        return f.name === file.name && !f.path;
      });
      this.files.splice(firstIndex, 1);
    }
  }

  showLoader() {
    if (this.loader === undefined) {
      this.loader = this.$loading.show();
    }
  }

  hideLoader() {
    this.loader?.hide();
    this.loader = undefined;
  }

  mapDocuments() {
    return this.documents.map((d) => {
      return { id: d.key, labelKey: d.key, value: d };
    });
  }
}
</script>
