<template>
  <div>
    <NakedCard class="fr-p-md-5w">
      <div>
        <h1 class="fr-h6" v-if="isCotenant">
          {{ $t("guarantorprofessional.title-cotenant") }}
        </h1>
        <h1 class="fr-h6" v-else>{{ $t("guarantorprofessional.title") }}</h1>
        <TroubleshootingModal>
          <GuarantorChoiceHelp></GuarantorChoiceHelp>
          <DocumentInsert
            :allow-list="professionalDocument.acceptedProofs"
            :block-list="professionalDocument.refusedProofs"
            v-if="professionalDocument.key"
          ></DocumentInsert>
        </TroubleshootingModal>
        <div class="fr-mt-3w">
          <validation-provider
            rules="select"
            name="professionalDocument"
            v-slot="{ errors, valid }"
          >
            <label v-if="isCotenant">{{
              $t("guarantorprofessional.select-label-cotenant")
            }}</label>
            <select
              v-model="professionalDocument"
              class="fr-select fr-mb-3w"
              :class="{
                'fr-select--valid': valid,
                'fr-select--error': errors[0],
              }"
              id="select"
              as="select"
              @change="onSelectChange()"
              aria-label="Select professional situation"
            >
              <option v-for="d in documents" :value="d" :key="d.key">
                {{ $t(d.key) }}
              </option>
            </select>
            <span class="fr-error-text" v-if="errors[0]">
              {{ $t(errors[0]) }}
            </span>
          </validation-provider>
        </div>
      </div>
    </NakedCard>
    <ConfirmModal
      v-if="isDocDeleteVisible"
      @valid="validSelect()"
      @cancel="undoSelect()"
    >
      <span>{{ $t("guarantorprofessional.will-delete-files") }}</span>
    </ConfirmModal>
    <NakedCard
      class="fr-p-md-5w fr-mt-3w"
      v-if="professionalDocument.key || professionalFiles().length > 0"
    >
      <div class="fr-mb-3w">
        <p
          v-html="
            $t(
              `explanation-text.${guarantorKey()}.professional.${
                professionalDocument.key
              }`
            )
          "
        ></p>
      </div>
      <AllDeclinedMessages
        class="fr-mb-3w"
        :documentDeniedReasons="documentDeniedReasons"
        :documentStatus="documentStatus"
      ></AllDeclinedMessages>
      <div v-if="professionalFiles().length > 0" class="fr-col-md-12 fr-mb-3w">
        <ListItem
          v-for="(file, k) in professionalFiles()"
          :key="k"
          :file="file"
          @remove="remove(file)"
        />
      </div>
      <div class="fr-mb-3w">
        <FileUpload
          :current-status="fileUploadStatus"
          @add-files="addFiles"
          @reset-files="resetFiles"
        ></FileUpload>
      </div>
    </NakedCard>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import DocumentInsert from "../share/DocumentInsert.vue";
import FileUpload from "../../uploads/FileUpload.vue";
import { mapState } from "vuex";
import { DocumentType } from "df-shared/src/models/Document";
import { UploadStatus } from "df-shared/src/models/UploadStatus";
import ListItem from "../../uploads/ListItem.vue";
import { DfFile } from "df-shared/src/models/DfFile";
import { DfDocument } from "df-shared/src/models/DfDocument";
import { RegisterService } from "../../../services/RegisterService";
import WarningMessage from "df-shared/src/components/WarningMessage.vue";
import { DocumentTypeConstants } from "../share/DocumentTypeConstants";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";
import { Guarantor } from "df-shared/src/models/Guarantor";
import GuarantorChoiceHelp from "../../helps/GuarantorChoiceHelp.vue";
import VGouvFrModal from "df-shared/src/GouvFr/v-gouv-fr-modal/VGouvFrModal.vue";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import AllDeclinedMessages from "../share/AllDeclinedMessages.vue";
import { DocumentDeniedReasons } from "df-shared/src/models/DocumentDeniedReasons";
import { cloneDeep } from "lodash";
import { ValidationProvider } from "vee-validate";
import TroubleshootingModal from "@/components/helps/TroubleshootingModal.vue";
import { UtilsService } from "@/services/UtilsService";

@Component({
  components: {
    AllDeclinedMessages,
    DocumentInsert,
    FileUpload,
    ListItem,
    WarningMessage,
    ConfirmModal,
    GuarantorChoiceHelp,
    VGouvFrModal,
    NakedCard,
    ValidationProvider,
    TroubleshootingModal,
  },
  computed: {
    ...mapState({
      selectedGuarantor: "selectedGuarantor",
    }),
  },
})
export default class GuarantorProfessional extends Vue {
  @Prop() tenantId?: string;
  @Prop({ default: false }) isCotenant?: boolean;

  selectedGuarantor!: Guarantor;
  fileUploadStatus = UploadStatus.STATUS_INITIAL;
  files: DfFile[] = [];
  uploadProgress: {
    [key: string]: { state: string; percentage: number };
  } = {};
  professionalDocument = new DocumentType();
  documents = DocumentTypeConstants.GUARANTOR_PROFESSIONAL_DOCS;
  isDocDeleteVisible = false;
  documentDeniedReasons = new DocumentDeniedReasons();

  mounted() {
    this.updateGuarantorData();
  }

  get documentStatus() {
    return this.guarantorProfessionalDocument()?.documentStatus;
  }

  guarantorProfessionalDocument() {
    return this.$store.getters.getGuarantorProfessionalDocument;
  }

  updateGuarantorData() {
    if (this.selectedGuarantor.documents !== null) {
      const doc = this.selectedGuarantor.documents?.find((d: DfDocument) => {
        return d.documentCategory === "PROFESSIONAL";
      });
      if (doc !== undefined) {
        const localDoc = this.documents.find((d: DocumentType) => {
          return d.value === doc.subCategory;
        });
        if (localDoc !== undefined) {
          this.professionalDocument = localDoc;
        }
      }
      if (this.guarantorProfessionalDocument()?.documentDeniedReasons) {
        this.documentDeniedReasons = cloneDeep(
          this.guarantorProfessionalDocument()?.documentDeniedReasons
        );
      }
    }
  }

  onSelectChange() {
    if (this.selectedGuarantor.documents !== null) {
      const doc = this.selectedGuarantor.documents?.find((d: DfDocument) => {
        return d.documentCategory === "PROFESSIONAL";
      });
      if (doc !== undefined) {
        this.isDocDeleteVisible =
          (doc.files?.length || 0) > 0 &&
          doc.subCategory !== this.professionalDocument.value;
      }
    }
    return false;
  }

  undoSelect() {
    if (this.selectedGuarantor.documents !== null) {
      const doc = this.selectedGuarantor.documents?.find((d: DfDocument) => {
        return d.documentCategory === "PROFESSIONAL";
      });
      if (doc !== undefined) {
        const localDoc = this.documents.find((d: DocumentType) => {
          return d.value === doc.subCategory;
        });
        if (localDoc !== undefined) {
          this.professionalDocument = localDoc;
        }
      }
    }
    this.isDocDeleteVisible = false;
  }

  async validSelect() {
    this.isDocDeleteVisible = false;
    if (this.selectedGuarantor.documents !== null) {
      const doc = this.selectedGuarantor.documents?.find((d: DfDocument) => {
        return d.documentCategory === "PROFESSIONAL";
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
    this.uploadProgress = {};
    const fieldName = "documents";
    const formData = new FormData();
    const newFiles = this.files.filter((f) => {
      return !f.id;
    });
    if (!newFiles.length) return;

    if (
      this.professionalDocument.maxFileCount &&
      this.professionalFiles().length > this.professionalDocument.maxFileCount
    ) {
      Vue.toasted.global.max_file({
        message: this.$i18n.t("max-file", [
          this.professionalFiles().length,
          this.professionalDocument.maxFileCount,
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
      "typeDocumentProfessional",
      this.professionalDocument.value
    );

    this.fileUploadStatus = UploadStatus.STATUS_SAVING;
    if (this.$store.getters.guarantor.id) {
      formData.append("guarantorId", this.$store.getters.guarantor.id);
    }
    if (this.tenantId) {
      formData.append("tenantId", this.tenantId);
    }
    const loader = this.$loading.show();
    this.$store
      .dispatch("saveGuarantorProfessional", formData)
      .then(() => {
        this.files = [];
        this.fileUploadStatus = UploadStatus.STATUS_INITIAL;
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

  professionalFiles() {
    const newFiles = this.files.map((f) => {
      return {
        subCategory: this.professionalDocument.value,
        id: f.id,
        name: f.name,
        size: f.size,
      };
    });
    const existingFiles =
      this.$store.getters.getGuarantorDocuments?.find((d: DfDocument) => {
        return d.documentCategory === "PROFESSIONAL";
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

  guarantorKey() {
    if (this.tenantId != null) {
      return "cotenant-guarantor";
    }
    return "guarantor";
  }
}
</script>

<style scoped lang="scss"></style>
