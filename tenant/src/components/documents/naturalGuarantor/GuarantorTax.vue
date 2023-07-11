<template>
  <div>
    <ConfirmModal
      v-if="isDocDeleteVisible"
      @valid="validSelect()"
      @cancel="undoSelect()"
    >
      <span>{{ $t("guarantortax.will-delete-files") }}</span>
    </ConfirmModal>
    <ValidationObserver v-slot="{ validate }">
      <NakedCard class="fr-p-md-5w">
        <h1 class="fr-h6" v-if="isCotenant">
          {{ $t("guarantortax.title-cotenant") }}
        </h1>
        <h1 class="fr-h6" v-else>{{ $t("guarantortax.title") }}</h1>
        <TroubleshootingModal>
          <TaxHelp></TaxHelp>
          <DocumentInsert
            :allow-list="taxDocument.acceptedProofs"
            :block-list="taxDocument.refusedProofs"
            v-if="taxDocument.key && taxDocument.acceptedProofs.length > 0"
          ></DocumentInsert>
        </TroubleshootingModal>

        <div class="fr-mt-3w">{{ $t("guarantortax.situation") }}</div>

        <form name="form" @submit.prevent="validate().then(save)">
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
                      v-model="taxDocument"
                      @input="onSelectChange()"
                    >
                      <div class="fr-grid-col spa">
                        <span v-if="isCotenant">{{
                          $t(`guarantortax.${d.key}-cotenant`)
                        }}</span>
                        <span v-else>{{ $t(d.key) }}</span>
                      </div>
                    </BigRadio>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
          <div
            class="fr-mb-3w"
            v-if="taxDocument.key && taxDocument.key === 'other-tax'"
          >
            <div class="fr-input-group">
              <label class="fr-label" for="customText">{{
                $t("guarantortax.custom-text")
              }}</label>
              <textarea
                v-model="customText"
                class="form-control fr-input validate-required"
                id="customText"
                name="customText"
                placeholder=""
                type="text"
                required
                maxlength="2000"
                rows="4"
              />
            </div>
          </div>
        </form>
      </NakedCard>
      <NakedCard
        class="fr-p-md-5w fr-mt-3w"
        v-if="taxDocument.key === 'my-name' || taxFiles().length > 0"
      >
        <div class="fr-mb-3w">
          <p
            v-html="$t(`explanation-text.${guarantorKey()}.${taxDocument.key}`)"
          ></p>
        </div>
        <AllDeclinedMessages
          class="fr-mb-3w"
          :documentDeniedReasons="documentDeniedReasons"
          :documentStatus="documentStatus"
        ></AllDeclinedMessages>
        <div
          style="font-weight: bold"
          v-html="$t('tax-page.warning-no-accepted-doc')"
        ></div>
        <a
          class="fr-link"
          href="https://docs.dossierfacile.fr/guide-dutilisation-de-dossierfacile/avis-dimposition"
          :title="$t('tax-page.goto-documentation').toString"
          target="_blank"
          rel="noreferrer"
        >
          {{ $t("tax-page.goto-documentation") }}</a
        >

        <div v-if="taxFiles().length > 0" class="fr-col-md-12 fr-mt-3w">
          <ListItem
            v-for="(file, k) in taxFiles()"
            :key="k"
            :file="file"
            @remove="remove(file)"
          />
        </div>
        <div class="fr-mb-3w fr-mt-3w">
          <FileUpload
            :current-status="fileUploadStatus"
            @add-files="addFiles"
            @reset-files="resetFiles"
          ></FileUpload>
        </div>
      </NakedCard>
    </ValidationObserver>
    <GuarantorFooter @on-back="goBack" @on-next="goNext"></GuarantorFooter>
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
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { DocumentType } from "df-shared/src/models/Document";
import DocumentInsert from "../share/DocumentInsert.vue";
import FileUpload from "../../uploads/FileUpload.vue";
import { mapState } from "vuex";
import { UploadStatus } from "df-shared/src/models/UploadStatus";
import ListItem from "../../uploads/ListItem.vue";
import { DfFile } from "df-shared/src/models/DfFile";
import { DfDocument } from "df-shared/src/models/DfDocument";
import { Guarantor } from "df-shared/src/models/Guarantor";
import { extend } from "vee-validate";
import { is } from "vee-validate/dist/rules";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { RegisterService } from "../../../services/RegisterService";
import WarningMessage from "df-shared/src/components/WarningMessage.vue";
import { DocumentTypeConstants } from "../share/DocumentTypeConstants";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";
import BigRadio from "df-shared/src/Button/BigRadio.vue";
import VGouvFrModal from "df-shared/src/GouvFr/v-gouv-fr-modal/VGouvFrModal.vue";
import TaxHelp from "../../helps/TaxHelp.vue";
import GuarantorFooter from "../../footer/GuarantorFooter.vue";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import AllDeclinedMessages from "../share/AllDeclinedMessages.vue";
import { DocumentDeniedReasons } from "df-shared/src/models/DocumentDeniedReasons";
import { cloneDeep } from "lodash";
import TroubleshootingModal from "@/components/helps/TroubleshootingModal.vue";
import { PdfAnalysisService } from "../../../services/PdfAnalysisService";
import { AnalyticsService } from "../../../services/AnalyticsService";
import Modal from "df-shared/src/components/Modal.vue";
import DfButton from "df-shared/src/Button/Button.vue";
import { LoaderComponent } from "vue-loading-overlay";

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
    BigRadio,
    VGouvFrModal,
    TaxHelp,
    GuarantorFooter,
    NakedCard,
    TroubleshootingModal,
    Modal,
    DfButton,
  },
  computed: {
    ...mapState({
      selectedGuarantor: "selectedGuarantor",
    }),
  },
})
export default class GuarantorTax extends Vue {
  @Prop() tenantId?: string;
  @Prop({ default: false }) isCotenant?: boolean;

  selectedGuarantor!: Guarantor;
  fileUploadStatus = UploadStatus.STATUS_INITIAL;
  files: DfFile[] = [];
  uploadProgress: {
    [key: string]: { state: string; percentage: number };
  } = {};
  taxDocument = new DocumentType();
  documentDeniedReasons = new DocumentDeniedReasons();

  customText = "";

  documents = DocumentTypeConstants.GUARANTOR_TAX_DOCS;
  isDocDeleteVisible = false;
  newFiles: File[] = [];
  isWarningTaxSituationModalVisible = false;

  loader?: LoaderComponent;

  getRegisteredDoc() {
    if (this.selectedGuarantor.documents !== null) {
      const doc = this.selectedGuarantor.documents?.find((d: DfDocument) => {
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

  get documentStatus() {
    return this.guarantorTaxDocument()?.documentStatus;
  }

  guarantorTaxDocument() {
    return this.$store.getters.getGuarantorTaxDocument;
  }

  onSelectChange() {
    if (this.selectedGuarantor.documents !== null) {
      const doc = this.selectedGuarantor.documents?.find((d: DfDocument) => {
        return d.documentCategory === "TAX";
      });
      if (doc !== undefined) {
        this.isDocDeleteVisible =
          (doc.files?.length || 0) > 0 &&
          doc.subCategory !== this.taxDocument.value;
      }
    }
    return false;
  }

  undoSelect() {
    if (this.selectedGuarantor.documents !== null) {
      const doc = this.selectedGuarantor.documents?.find((d: DfDocument) => {
        return d.documentCategory === "TAX";
      });
      if (doc !== undefined) {
        const localDoc = this.documents.find((d: DocumentType) => {
          return d.value === doc.subCategory;
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
    if (this.selectedGuarantor.documents !== null) {
      const doc = this.selectedGuarantor.documents?.find((d: DfDocument) => {
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

  updateGuarantorData() {
    const doc = this.getRegisteredDoc();
    if (doc !== undefined) {
      this.customText = doc.customText || "";
    }
    const localDoc = this.getLocalDoc();
    if (localDoc !== undefined) {
      this.taxDocument = localDoc;
    }
    if (this.guarantorTaxDocument()?.documentDeniedReasons) {
      this.documentDeniedReasons = cloneDeep(
        this.guarantorTaxDocument()?.documentDeniedReasons
      );
    }
  }

  mounted() {
    this.updateGuarantorData();
  }

  @Watch("selectedGuarantor")
  onGuarantorChange() {
    this.updateGuarantorData();
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

  forceSave() {
    this.isWarningTaxSituationModalVisible = false;
    this.saveNewFiles(true);
  }

  saveNewFiles(force: boolean) {
    AnalyticsService.uploadFile("tax");
    const nf = Array.from(this.newFiles).map((f) => {
      return { name: f.name, file: f, size: f.size };
    });
    this.files = [...this.files, ...nf];
    this.save(force);
  }

  resetFiles() {
    this.fileUploadStatus = UploadStatus.STATUS_INITIAL;
  }

  async save(force = false) {
    if (!this.taxDocument.key) {
      return true;
    }
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

    formData.append("typeDocumentTax", this.taxDocument.value);

    if (this.taxDocument.key === "other-tax") {
      if (!this.customText) {
        // TODO : would be better to validate form
        return false;
      }
      formData.append("customText", this.customText);
    }

    this.fileUploadStatus = UploadStatus.STATUS_SAVING;
    formData.append("guarantorId", this.$store.getters.guarantor.id);

    if (this.tenantId) {
      formData.append("tenantId", this.tenantId);
    }
    this.showLoader();
    await this.$store
      .dispatch("saveGuarantorTax", formData)
      .then(() => {
        this.files = [];
        this.fileUploadStatus = UploadStatus.STATUS_INITIAL;
        Vue.toasted.global.save_success();
      })
      .catch((err) => {
        this.fileUploadStatus = UploadStatus.STATUS_FAILED;
        if (err.response.data.message.includes("NumberOfPages")) {
          Vue.toasted.global.save_failed_num_pages();
        } else {
          Vue.toasted.global.save_failed();
        }
      })
      .finally(() => {
        this.hideLoader();
      });
    return true;
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
      this.$store.getters.getGuarantorDocuments?.find((d: DfDocument) => {
        return d.documentCategory === "TAX";
      })?.files || [];
    return [...newFiles, ...existingFiles];
  }

  async remove(file: DfFile, silent = false) {
    if (file.id) {
      await RegisterService.deleteFile(file.id, silent);
    } else {
      const firstIndex = this.files.findIndex((f) => {
        return f.name === file.name && !f.path;
      });
      this.files.splice(firstIndex, 1);
    }
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

  guarantorKey() {
    if (this.isCotenant) {
      return "cotenant-guarantor";
    }
    return "guarantor";
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
}
</script>

<style scoped lang="scss">
.spa {
  min-height: 2rem;
  @media all and (min-width: 768px) {
    width: 14rem;
  }
}
</style>
