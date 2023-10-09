<template>
  <div>
    <NakedCard class="fr-p-md-5w">
      <div>
        <h1 class="fr-h6" v-if="isCotenant">
          {{ $t("guarantoridentification.title-cotenant") }}
        </h1>
        <h1 class="fr-h6" v-else>{{ $t("guarantoridentification.title") }}</h1>

        <div class="fr-mt-3w">
          <SimpleRadioButtons
            name="application-type-selector"
            v-model="identificationDocument"
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
import { mapGetters, mapState } from "vuex";
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
import NakedCard from "df-shared/src/components/NakedCard.vue";
import AllDeclinedMessages from "../share/AllDeclinedMessages.vue";
import { DocumentDeniedReasons } from "df-shared/src/models/DocumentDeniedReasons";
import { cloneDeep } from "lodash";
import TroubleshootingModal from "@/components/helps/TroubleshootingModal.vue";
import { UtilsService } from "@/services/UtilsService";
import SimpleRadioButtons from "df-shared/src/Button/SimpleRadioButtons.vue";
import { User } from "df-shared/src/models/User";

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
    NakedCard,
    TroubleshootingModal,
    SimpleRadioButtons,
  },
  computed: {
    ...mapState({
      selectedGuarantor: "selectedGuarantor",
    }),
    ...mapGetters({
      user: "userToEdit",
    }),
  },
})
export default class GuarantorIdentification extends Vue {
  documents = DocumentTypeConstants.GUARANTOR_IDENTIFICATION_DOCS;
  @Prop() tenantId?: string;
  @Prop({ default: false }) isCotenant?: boolean;
  user!: User;

  documentDeniedReasons = new DocumentDeniedReasons();
  selectedGuarantor!: Guarantor;
  fileUploadStatus = UploadStatus.STATUS_INITIAL;
  files: DfFile[] = [];
  identificationDocument = new DocumentType();
  isDocDeleteVisible = false;

  getLocalStorageKey() {
    return "identification_guarantor_" + this.user.email;
  }

  onSelectChange() {
    localStorage.setItem(
      this.getLocalStorageKey(),
      this.identificationDocument.key
    );
    if (this.user.documents !== null) {
      const doc = this.guarantorIdentificationDocument();
      if (doc !== undefined) {
        this.isDocDeleteVisible =
          (doc?.files?.length || 0) > 0 &&
          doc?.subCategory !== this.identificationDocument.value;
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
          return d.value === doc.subCategory;
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
      if (this.guarantorIdentificationDocument() !== undefined) {
        const localDoc = this.documents.find((d: DocumentType) => {
          return (
            d.value === this.guarantorIdentificationDocument()?.subCategory
          );
        });
        if (localDoc !== undefined) {
          this.identificationDocument = localDoc;
          localStorage.setItem(
            this.getLocalStorageKey(),
            this.identificationDocument.key || ""
          );
        }
        const docDeniedReasons =
          this.guarantorIdentificationDocument()?.documentDeniedReasons;
        if (docDeniedReasons !== undefined) {
          this.documentDeniedReasons = cloneDeep(docDeniedReasons);
        }
      } else {
        const key = localStorage.getItem(this.getLocalStorageKey());
        if (key) {
          const localDoc = this.documents.find((d: DocumentType) => {
            return d.key === key;
          });
          if (localDoc !== undefined) {
            this.identificationDocument = localDoc;
          }
        }
      }
    }
  }

  mounted() {
    this.updateGuarantorData();
  }

  addFiles(fileList: File[]) {
    const nf = Array.from(fileList).map((f) => {
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
    const newFiles = this.files.filter((f) => {
      return !f.id;
    });
    if (!newFiles.length) return;

    if (
      this.identificationDocument.maxFileCount &&
      this.identificationFiles().length >
        this.identificationDocument.maxFileCount
    ) {
      Vue.toasted.global.max_file({
        message: this.$i18n.t("max-file", [
          this.identificationFiles().length,
          this.identificationDocument.maxFileCount,
        ]),
      });
      this.files = [];
      return;
    }

    Array.from(Array(newFiles.length).keys()).forEach((x) => {
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
      .catch((err) => {
        this.fileUploadStatus = UploadStatus.STATUS_FAILED;
        UtilsService.handleCommonSaveError(err);
      })
      .finally(() => {
        loader.hide();
      });
  }

  identificationFiles() {
    const newFiles = this.files.map((f) => {
      return {
        subCategory: this.identificationDocument.value,
        id: f.id,
        name: f.name,
        file: f.file,
        size: f.file?.size,
      };
    });
    const existingFiles = this.guarantorIdentificationDocument()?.files || [];
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

  guarantorKey() {
    if (this.tenantId != null) {
      return "cotenant-guarantor";
    }
    return "guarantor";
  }

  mapDocuments() {
    return this.documents.map((d) => {
      return { id: d.key, labelKey: d.key, value: d };
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
</style>
