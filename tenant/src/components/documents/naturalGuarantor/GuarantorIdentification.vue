<template>
  <div>
    <NakedCard class="fr-p-md-5w">
      <div>
        <h1 class="fr-h6" v-if="isCotenant">{{ $t("guarantoridentification.title-cotenant") }}</h1>
        <h1 class="fr-h6" v-else>{{ $t("guarantoridentification.title") }}</h1>
        {{ $t("guarantoridentification.select-label") }}

        <TroubleshootingModal>
          <GuarantorChoiceHelp></GuarantorChoiceHelp>
          <DocumentInsert
            :allow-list="identificationDocument.acceptedProofs"
            :block-list="identificationDocument.refusedProofs"
            v-if="identificationDocument.key"
          ></DocumentInsert>
        </TroubleshootingModal>

        <div class="fr-mt-3w">
          <fieldset class="fr-fieldset">
            <div class="fr-fieldset__content">
              <div class="fr-grid-row">
                <div v-for="d in documents" :key="d.key" class="full-width-xs">
                  <BigRadio
                    :val="d"
                    v-model="identificationDocument"
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
    <ConfirmModal
      v-if="isDocDeleteVisible"
      @valid="validSelect()"
      @cancel="undoSelect()"
    >
      <span>{{ $t("guarantoridentification.will-delete-files") }}</span>
    </ConfirmModal>
    <NakedCard
      class="fr-p-md-5w fr-mt-3w"
      v-if="identificationDocument.key || identificationFiles().length > 0"
    >
      <div class="fr-mb-3w">
        <p
          v-html="
            $t(
              `explanation-text.${guarantorKey()}.${identificationDocument.key}`
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
        v-if="identificationFiles().length > 0"
        class="fr-col-md-12 fr-mb-3w"
      >
        <ListItem
          v-for="(file, k) in identificationFiles()"
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
    </NakedCard>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { mapState } from "vuex";
import DocumentInsert from "../share/DocumentInsert.vue";
import FileUpload from "../../uploads/FileUpload.vue";
import { DocumentType } from "df-shared/src/models/Document";
import { UploadStatus } from "df-shared/src/models/UploadStatus";
import ListItem from "../../uploads/ListItem.vue";
import { DfFile } from "df-shared/src/models/DfFile";
import { DfDocument } from "df-shared/src/models/DfDocument";
import { ValidationProvider } from "vee-validate";
import { Guarantor } from "df-shared/src/models/Guarantor";
import { RegisterService } from "../../../services/RegisterService";
import WarningMessage from "df-shared/src/components/WarningMessage.vue";
import { DocumentTypeConstants } from "../share/DocumentTypeConstants";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";
import DfButton from "df-shared/src/Button/Button.vue";
import GuarantorChoiceHelp from "../../helps/GuarantorChoiceHelp.vue";
import VGouvFrModal from "df-shared/src/GouvFr/v-gouv-fr-modal/VGouvFrModal.vue";
import BigRadio from "df-shared/src/Button/BigRadio.vue";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import AllDeclinedMessages from "../share/AllDeclinedMessages.vue";
import { DocumentDeniedReasons } from "df-shared/src/models/DocumentDeniedReasons";
import { cloneDeep } from "lodash";
import TroubleshootingModal from "@/components/helps/TroubleshootingModal.vue";

@Component({
  components: {
    AllDeclinedMessages,
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
    TroubleshootingModal
  },
  computed: {
    ...mapState({
      selectedGuarantor: "selectedGuarantor"
    })
  }
})
export default class GuarantorIdentification extends Vue {
  documents = DocumentTypeConstants.GUARANTOR_IDENTIFICATION_DOCS;
  @Prop() tenantId?: string;
  @Prop({ default: false }) isCotenant?: boolean;

  documentDeniedReasons = new DocumentDeniedReasons();
  selectedGuarantor!: Guarantor;
  fileUploadStatus = UploadStatus.STATUS_INITIAL;
  files: DfFile[] = [];
  identificationDocument = new DocumentType();
  isDocDeleteVisible = false;

  @Watch("selectedGuarantor")
  onGuarantorChange() {
    this.updateGuarantorData();
  }

  onSelectChange() {
    if (this.selectedGuarantor.documents !== null) {
      const doc = this.selectedGuarantor.documents?.find((d: DfDocument) => {
        return d.documentCategory === "IDENTIFICATION";
      });
      if (doc !== undefined) {
        this.isDocDeleteVisible =
          (doc.files?.length || 0) > 0 &&
          doc.documentSubCategory !== this.identificationDocument.value;
      }
    }
    return false;
  }

  get documentStatus() {
    return this.guarantorIdentificationDocument()?.documentStatus;
  }

  guarantorIdentificationDocument(): DfDocument {
    return this.selectedGuarantor?.documents?.find((d: DfDocument) => {
      return d.documentCategory === "IDENTIFICATION";
    }) as DfDocument;
  }

  undoSelect() {
    if (this.selectedGuarantor.documents !== null) {
      const doc = this.selectedGuarantor.documents?.find((d: DfDocument) => {
        return d.documentCategory === "IDENTIFICATION";
      });
      if (doc !== undefined) {
        const localDoc = this.documents.find((d: DocumentType) => {
          return d.value === doc.documentSubCategory;
        });
        if (localDoc !== undefined) {
          this.identificationDocument = localDoc;
        }
      }
    }
    this.isDocDeleteVisible = false;
  }

  async validSelect() {
    this.isDocDeleteVisible = false;
    if (this.selectedGuarantor.documents !== null) {
      const doc = this.selectedGuarantor.documents?.find((d: DfDocument) => {
        return d.documentCategory === "IDENTIFICATION";
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
    if (this.selectedGuarantor.documents !== null) {
      const doc = this.selectedGuarantor.documents?.find((d: DfDocument) => {
        return d.documentCategory === "IDENTIFICATION";
      });
      if (doc !== undefined) {
        const localDoc = this.documents.find((d: DocumentType) => {
          return d.value === doc.documentSubCategory;
        });
        if (localDoc !== undefined) {
          this.identificationDocument = localDoc;
        }
      }
      if (this.guarantorIdentificationDocument()?.documentDeniedReasons) {
        this.documentDeniedReasons = cloneDeep(
          this.guarantorIdentificationDocument()?.documentDeniedReasons
        ) as DocumentDeniedReasons;
      }
    }
  }

  mounted() {
    this.updateGuarantorData();
  }

  addFiles(fileList: File[]) {
    const nf = Array.from(fileList).map(f => {
      return { name: f.name, file: f, size: f.size };
    });
    this.files = [...this.files, ...nf];
    this.save();
  }

  resetFiles() {
    this.fileUploadStatus = UploadStatus.STATUS_INITIAL;
  }

  save() {
    const fieldName = "documents";
    const formData = new FormData();
    const newFiles = this.files.filter(f => {
      return !f.id;
    });
    if (!newFiles.length) return;

    if (
      this.identificationDocument.maxFileCount &&
      this.identificationFiles().length >
        this.identificationDocument.maxFileCount
    ) {
      Vue.toasted.global.max_file({
        message: this.$i18n.t("guarantoridentification.max-file", [
          this.identificationFiles().length,
          this.identificationDocument.maxFileCount
        ])
      });
      return;
    }

    Array.from(Array(newFiles.length).keys()).map(x => {
      const f: File = newFiles[x].file || new File([], "");
      formData.append(`${fieldName}[${x}]`, f, newFiles[x].name);
    });

    formData.append(
      "typeDocumentIdentification",
      this.identificationDocument.value
    );
    if (this.tenantId) {
      formData.append("tenantId", this.tenantId);
    }
    this.fileUploadStatus = UploadStatus.STATUS_SAVING;
    if (!this.selectedGuarantor?.id) {
      throw new Error("selectedGuarantor id cannot be empty !");
    }
    formData.append("guarantorId", this.selectedGuarantor.id?.toString());
    const loader = this.$loading.show();
    this.$store
      .dispatch("saveGuarantorIdentification", formData)
      .then(() => {
        this.fileUploadStatus = UploadStatus.STATUS_INITIAL;
        this.files = [];
        Vue.toasted.global.save_success();
      })
      .catch(err => {
        this.fileUploadStatus = UploadStatus.STATUS_FAILED;
        if (err.response.data.message.includes("NumberOfPages")) {
          Vue.toasted.global.save_failed_num_pages();
        } else {
          Vue.toasted.global.save_failed();
        }
      })
      .finally(() => {
        loader.hide();
      });
  }

  identificationFiles() {
    const newFiles = this.files.map(f => {
      return {
        documentSubCategory: this.identificationDocument.value,
        id: f.name,
        name: f.name,
        file: f.file,
        size: f.file?.size
      };
    });
    const existingFiles = this.guarantorIdentificationDocument()?.files || [];
    return [...newFiles, ...existingFiles];
  }

  async remove(file: DfFile, silent = false) {
    if (file.id) {
      await RegisterService.deleteFile(file.id, silent);
    } else {
      const firstIndex = this.files.findIndex(f => {
        return f.name === file.name && f.file === file.file && !f.id;
      });
      this.files.splice(firstIndex, 1);
    }
  }

  guarantorKey() {
    if (this.tenantId != null) {
      return "cotenant-guarantor";
    }
    return "guarantor";
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
</style>

