<template>
  <div>
    <NakedCard class="fr-p-md-5w">
      <div>
        <h1 class="fr-h6">
          <slot name="title"></slot>
        </h1>
        <slot name="description"></slot>

        <div class="fr-mt-3w">
          <div v-if="listType == 'dropDownList'">
            <validation-provider
              rules="select"
              name="professionalDocument"
              v-slot="{ errors, valid }"
            >
              <select
                v-model="document"
                class="fr-select fr-mb-3w fr-mt-3w"
                :class="{
                  'fr-select--valid': valid,
                  'fr-select--error': errors[0],
                }"
                id="select"
                as="select"
                @change="onSelectChange()"
              >
                <option
                  v-for="d in documentsDefinitions"
                  :value="d"
                  :key="d.key"
                >
                  {{ $parent.$t(d.key) }}
                </option>
              </select>
              <span class="fr-error-text" v-if="errors[0]">
                {{ $t(errors[0]) }}
              </span>
            </validation-provider>
          </div>
          <SimpleRadioButtons
            v-if="listType !== 'dropDownList'"
            name="application-type-selector"
            v-model="document"
            @input="onSelectChange"
            :elements="mapDocuments()"
          ></SimpleRadioButtons>
        </div>
      </div>
    </NakedCard>
    <ConfirmModal
      v-if="isDocDeleteVisible"
      @valid="validSelect()"
      @cancel="undoSelect()"
    >
      <span>{{ $t("documentdownloader.will-delete-files") }}</span>
    </ConfirmModal>

    <slot name="after-select-block"></slot>
    <NakedCard
      class="fr-p-md-5w fr-mt-3w"
      v-if="showDownloader && (document.key || documentFiles.length > 0)"
    >
      <div class="fr-mb-3w">
        <p v-html="$t(`explanation-text.cotenant.${document.key}`)"></p>
      </div>
      <WarningTaxDeclaration
        class="fr-mb-3w"
        v-if="document.key === 'my-name'"
      />

      <AllDeclinedMessages
        class="fr-mb-3w"
        :documentDeniedReasons="documentDeniedReasons"
        :documentStatus="documentStatus"
      ></AllDeclinedMessages>

      <div v-if="!noDocument || forceShowDownloader">
        <div v-if="documentFiles().length > 0" class="fr-col-md-12 fr-mb-3w">
          <ListItem
            v-for="(file, k) in documentFiles()"
            :key="k"
            :file="file"
            @remove="remove(file)"
          />
        </div>

        <div class="fr-mb-3w">
          <FileUpload
            :current-status="fileUploadStatus"
            :page="4"
            @add-files="addFiles"
            @reset-files="resetFiles"
          ></FileUpload>
        </div>
      </div>
      <div
        v-if="allowNoDocument"
        class="fr-col-12 fr-mb-3w bg-purple fr-checkbox-group"
      >
        <input
          type="checkbox"
          id="noDocument"
          :checked="noDocument"
          @click="changeNoDocument($event)"
        />
        <label for="noDocument">
          {{
            document
              ? $t("noDocument-" + document.key)
              : $t("documentdownloader.noDocument-default")
          }}
        </label>
      </div>

      <div
        class="fr-mb-5w"
        v-if="
          !forceShowDownloader && (dfDocument ? dfDocument.noDocument : null)
        "
      >
        <validation-provider
          :rules="{ required: true }"
          v-slot="{ errors, valid }"
        >
          <div class="fr-input-group">
            <label class="fr-label" for="customText">
              {{ $t(`cotenantfinancialform.customText-${document.key}`) }}
            </label>
            <textarea
              v-model="dfDocument.customText"
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
              >{{
                dfDocument
                  ? dfDocument.customText
                    ? dfDocument.customText.length
                    : 0
                  : 0
              }}
              / 2000</span
            >
            <span class="fr-error-text" v-if="errors[0]">{{
              $t(errors[0])
            }}</span>
          </div>
        </validation-provider>
      </div>

      <slot name="after-downloader"></slot>
    </NakedCard>
    <Modal
      v-show="showIsNoDocumentAndFiles"
      @close="showIsNoDocumentAndFiles = false"
    >
      <template v-slot:body>
        <div class="fr-container">
          <div class="fr-grid-row justify-content-center">
            <div class="fr-col-12">
              <p>
                {{ $t("documentdownloader.warning-no-document-and-files") }}
              </p>
            </div>
          </div>
        </div>
      </template>
    </Modal>
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
import { RegisterService } from "@/services/RegisterService";
import { DfDocument } from "df-shared/src/models/DfDocument";
import { DfFile } from "df-shared/src/models/DfFile";
import { DocumentType } from "df-shared/src/models/Document";
import { DocumentDeniedReasons } from "df-shared/src/models/DocumentDeniedReasons";
import { UploadStatus } from "df-shared/src/models/UploadStatus";
import { User } from "df-shared/src/models/User";
import { cloneDeep } from "lodash";
import { Component, Prop, Vue } from "vue-property-decorator";
import DocumentInsert from "../share/DocumentInsert.vue";
import FileUpload from "../../uploads/FileUpload.vue";
import ListItem from "../../uploads/ListItem.vue";
import { ValidationProvider } from "vee-validate";
import WarningMessage from "df-shared/src/components/WarningMessage.vue";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";
import DfButton from "df-shared/src/Button/Button.vue";
import VGouvFrModal from "df-shared/src/GouvFr/v-gouv-fr-modal/VGouvFrModal.vue";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import AllDeclinedMessages from "../share/AllDeclinedMessages.vue";
import Modal from "df-shared/src/components/Modal.vue";
import DocumentHelp from "../../helps/DocumentHelp.vue";
import { UtilsService } from "@/services/UtilsService";
import TroubleshootingModal from "@/components/helps/TroubleshootingModal.vue";
import { PdfAnalysisService } from "../../../services/PdfAnalysisService";
import { LoaderComponent } from "vue-loading-overlay";
import WarningTaxDeclaration from "@/components/documents/share/WarningTaxDeclaration.vue";
import SimpleRadioButtons from "df-shared/src/Button/SimpleRadioButtons.vue";

@Component({
  components: {
    WarningTaxDeclaration,
    AllDeclinedMessages,
    DocumentInsert,
    FileUpload,
    ListItem,
    ValidationProvider,
    WarningMessage,
    ConfirmModal,
    Modal,
    DfButton,
    VGouvFrModal,
    NakedCard,
    DocumentHelp,
    TroubleshootingModal,
    SimpleRadioButtons,
  },
})
export default class DocumentDownloader extends Vue {
  @Prop() coTenantId!: number;
  @Prop() documentsDefinitions!: any;
  @Prop() documentCategory!: string;
  @Prop() editedDocumentId?: number;
  @Prop() dispatchMethodName!: string;
  @Prop() typeDocument!: string;
  @Prop({ default: "default" }) listType!: string;
  @Prop({ default: true }) showDownloader!: boolean;
  @Prop({ default: false }) allowNoDocument!: boolean;
  @Prop({ default: false }) forceShowDownloader!: boolean;
  @Prop({ default: false }) testAvisSituation!: boolean;
  @Prop({ default: "documents." }) translationKeyPrefix!: boolean;

  localEditedDocumentId = this.editedDocumentId;
  documentDeniedReasons = new DocumentDeniedReasons();
  fileUploadStatus = UploadStatus.STATUS_INITIAL;
  document = new DocumentType();
  isDocDeleteVisible = false;
  selectedCoTenant!: User;

  dfDocument!: DfDocument;
  noDocument = false;
  showIsNoDocumentAndFiles = false;
  newFiles: File[] = [];
  isWarningTaxSituationModalVisible = false;

  loader?: LoaderComponent;

  beforeMount() {
    this.loadDocument();
    this.noDocument = this.dfDocument?.noDocument == true;
    this.$emit("on-change-document", this.document, this.dfDocument);
  }

  changeNoDocument(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.noDocument && Number(this.dfDocument?.files?.length) > 0) {
      this.showIsNoDocumentAndFiles = true;
      this.dfDocument.noDocument = this.noDocument;
      return;
    } else {
      this.noDocument = !this.noDocument;
      this.dfDocument.noDocument = this.noDocument;
    }
    this.$emit("on-change-document", this.document, this.dfDocument);
  }

  onSelectChange() {
    if (this.selectedCoTenant?.documents !== null) {
      const doc = this.getDocument();
      if (doc !== undefined) {
        this.isDocDeleteVisible =
          (doc.files?.length || 0) > 0 &&
          doc.subCategory !== this.document.value;
      }
    }
    this.$emit("on-change-document", this.document, this.dfDocument);
    // why ? no
    this.noDocument = this.dfDocument?.noDocument == true;
    return false;
  }

  get documentStatus() {
    return this.getDocument()?.documentStatus;
  }
  documentFiles(): DfFile[] {
    return this.getDocument().files
      ? (this.getDocument().files as DfFile[])
      : [];
  }

  loadDocument(forceLoadLast?: boolean) {
    this.selectedCoTenant = UtilsService.getTenant(Number(this.coTenantId));
    if (this.localEditedDocumentId) {
      const doc = this.selectedCoTenant.documents
        ? (this.selectedCoTenant.documents.find((d: DfDocument) => {
            return (
              d.documentCategory === this.documentCategory &&
              d.id === this.localEditedDocumentId
            );
          }) as DfDocument)
        : undefined;

      this.dfDocument = doc ? doc : new DfDocument();
      if (this.localEditedDocumentId == -1 && forceLoadLast) {
        const docs = this.selectedCoTenant.documents?.filter(
          (d: DfDocument) => {
            return d.documentCategory === this.documentCategory;
          }
        ) as DfDocument[];

        this.dfDocument = docs[docs.length - 1];
        this.localEditedDocumentId = this.dfDocument.id;
      }
    } else {
      const doc = this.selectedCoTenant.documents
        ? (this.selectedCoTenant.documents.find((d: DfDocument) => {
            return d.documentCategory === this.documentCategory;
          }) as DfDocument)
        : undefined;

      this.dfDocument = doc ? doc : new DfDocument();
    }

    // loadDocType
    const localDoc = this.documentsDefinitions.find((d: DocumentType) => {
      return d.value === this.dfDocument.subCategory;
    });
    if (localDoc !== undefined) {
      this.document = localDoc;
    }

    if (this.dfDocument?.documentDeniedReasons) {
      this.documentDeniedReasons = cloneDeep(
        this.dfDocument?.documentDeniedReasons
      ) as DocumentDeniedReasons;
    }
  }

  getDocument(): DfDocument {
    return this.dfDocument;
  }

  undoSelect() {
    if (this.selectedCoTenant?.documents !== null) {
      const doc = this.getDocument();
      if (doc !== undefined) {
        const localDoc = this.documentsDefinitions.find((d: DocumentType) => {
          return d.value === doc.subCategory;
        });
        if (localDoc !== undefined) {
          this.document = localDoc;
        }
      }
    }
    this.isDocDeleteVisible = false;
  }

  validSelect() {
    this.isDocDeleteVisible = false;
    if (this.selectedCoTenant.documents !== null) {
      const doc = this.getDocument();
      if (doc?.files !== undefined) {
        for (const f of doc.files) {
          if (f.id) {
            this.remove(f);
          }
        }
      }
      doc.customText = undefined;
      this.localEditedDocumentId = -1;
    }
  }

  forceSave() {
    this.isWarningTaxSituationModalVisible = false;
    this.saveNewFiles(true);
  }

  async addFiles(fileList: File[]) {
    this.newFiles = fileList;
    this.showLoader();
    if (
      this.testAvisSituation &&
      (await PdfAnalysisService.includesRejectedTaxDocuments(fileList))
    ) {
      this.isWarningTaxSituationModalVisible = true;
      this.hideLoader();
    } else {
      this.saveNewFiles(false);
    }
  }

  saveNewFiles(avisDetected: boolean) {
    const filesToAdd = Array.from(this.newFiles).map((f) => {
      return { name: f.name, file: f, size: f.size };
    });
    if (!filesToAdd || filesToAdd.length <= 0) {
      return;
    }
    const futurLength = filesToAdd.length + this.documentFiles().length;
    if (
      this.document.maxFileCount &&
      futurLength > this.document.maxFileCount
    ) {
      Vue.toasted.global.max_file({
        message: this.$i18n.t("max-file", [
          futurLength,
          this.document.maxFileCount,
        ]),
      });
      return;
    }
    const formData = this._buildFormData(filesToAdd, avisDetected);

    this.fileUploadStatus = UploadStatus.STATUS_SAVING;

    this.showLoader();
    this.$store
      .dispatch(this.dispatchMethodName, formData)
      .then(() => {
        this.fileUploadStatus = UploadStatus.STATUS_INITIAL;
        this.loadDocument(true);
        Vue.toasted.global.save_success();
      })
      .catch((err) => {
        this.fileUploadStatus = UploadStatus.STATUS_FAILED;
        UtilsService.handleCommonSaveError(err);
      })
      .finally(() => {
        this.hideLoader();
      });
  }

  _buildFormData(filesToAdd: any, avisDetected: boolean): FormData {
    const formData = new FormData();
    const fieldName = "documents";
    Array.from(Array(filesToAdd.length).keys()).forEach((x) => {
      const f: File = filesToAdd[x].file || new File([], "");
      formData.append(`${fieldName}[${x}]`, f, filesToAdd[x].name);
    });

    formData.append(this.typeDocument, this.document.value);
    formData.append("tenantId", this.coTenantId.toString());
    if (this.localEditedDocumentId && this.localEditedDocumentId > 0) {
      formData.append("id", this.localEditedDocumentId.toString());
    }
    this.$emit("enrich-form-data", formData);
    if (avisDetected) {
      formData.append("avisDetected", "true");
    } else {
      formData.append("avisDetected", "false");
    }

    return formData;
  }

  resetFiles() {
    this.fileUploadStatus = UploadStatus.STATUS_INITIAL;
  }

  remove(file: DfFile) {
    if (file.id) {
      this.showLoader();
      RegisterService.deleteFileById(Number(file.id))
        .then(() => {
          this.dfDocument = this.getDocument();
          this.dfDocument.files = this.dfDocument.files?.filter(
            (f) => file.id != f.id
          );

          Vue.toasted.global.save_success();
        })
        .catch((err) => {
          console.log("Unable to delete last element?", err);
          Vue.toasted.global.save_failed();
        })
        .finally(() => {
          this.hideLoader();
        });
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
    return this.documentsDefinitions.map((d: any) => {
      return {
        id: d.key,
        labelKey: this.translationKeyPrefix + d.key,
        value: d,
      };
    });
  }
}
</script>

<style scoped lang="scss">
table {
  border-collapse: collapse;
}

table,
th,
td {
  border: 1px solid #ececec;
}
.spa {
  height: 3rem;
  @media all and (min-width: 768px) {
    width: 14rem;
  }
}
</style>
