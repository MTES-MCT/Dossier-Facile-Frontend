<template>
  <div>
    <NakedCard class="fr-p-md-5w">
      <div>
        <validation-provider
          rules="select"
          name="professionalDocument"
          v-slot="{ errors, valid }"
        >
          <h1 class="fr-h6">
            {{ $t("professional-page.select-label") }}
          </h1>
          <TroubleshootingModal>
            <DocumentHelp></DocumentHelp>
            <DocumentInsert
              :allow-list="professionalDocument.acceptedProofs"
              :block-list="professionalDocument.refusedProofs"
              v-if="professionalDocument.key"
            ></DocumentInsert>
          </TroubleshootingModal>
          <select
            v-model="professionalDocument"
            class="fr-select fr-mb-3w fr-mt-3w"
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
    </NakedCard>
    <NakedCard
      class="fr-p-md-5w fr-mt-3w"
      v-if="professionalDocument.key || professionalFiles().length > 0"
    >
      <div class="fr-mb-3w">
        <div
          v-html="
            $t(
              `explanation-text.tenant.professional.${professionalDocument.key}`
            )
          "
        ></div>
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
    <ConfirmModal
      v-if="isDocDeleteVisible"
      @valid="validSelect()"
      @cancel="undoSelect()"
    >
      <span>{{ $t("professional-page.will-delete-files") }}</span>
    </ConfirmModal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DocumentInsert from "../share/DocumentInsert.vue";
import FileUpload from "../../uploads/FileUpload.vue";
import { mapGetters } from "vuex";
import { DocumentType } from "df-shared/src/models/Document";
import { UploadStatus } from "df-shared/src/models/UploadStatus";
import ListItem from "../../uploads/ListItem.vue";
import { DfFile } from "df-shared/src/models/DfFile";
import { DfDocument } from "df-shared/src/models/DfDocument";
import { RegisterService } from "../../../services/RegisterService";
import WarningMessage from "df-shared/src/components/WarningMessage.vue";
import { DocumentTypeConstants } from "../share/DocumentTypeConstants";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";
import { User } from "df-shared/src/models/User";
import DocumentHelp from "../../helps/DocumentHelp.vue";
import VGouvFrModal from "df-shared/src/GouvFr/v-gouv-fr-modal/VGouvFrModal.vue";
import { AnalyticsService } from "../../../services/AnalyticsService";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import AllDeclinedMessages from "../share/AllDeclinedMessages.vue";
import { DocumentDeniedReasons } from "df-shared/src/models/DocumentDeniedReasons";
import { cloneDeep } from "lodash";
import { ValidationProvider } from "vee-validate";
import { extend } from "vee-validate";
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
    DocumentHelp,
    VGouvFrModal,
    NakedCard,
    ValidationProvider,
    TroubleshootingModal,
  },
  computed: {
    ...mapGetters({
      user: "userToEdit",
      tenantProfessionalDocument: "getTenantProfessionalDocument",
    }),
  },
})
export default class Professional extends Vue {
  documents = DocumentTypeConstants.PROFESSIONAL_DOCS;

  user!: User;
  tenantProfessionalDocument!: DfDocument;

  documentDeniedReasons = new DocumentDeniedReasons();
  fileUploadStatus = UploadStatus.STATUS_INITIAL;
  files: DfFile[] = [];
  uploadProgress: {
    [key: string]: { state: string; percentage: number };
  } = {};
  professionalDocument = new DocumentType();
  isDocDeleteVisible = false;

  getLocalStorageKey() {
    return "professional_" + this.user.email;
  }

  get documentStatus() {
    return this.tenantProfessionalDocument?.documentStatus;
  }

  beforeMount() {
    if (this.user.documents !== null) {
      const doc = this.user.documents?.find((d: DfDocument) => {
        return d.documentCategory === "PROFESSIONAL";
      });
      if (doc !== undefined) {
        const localDoc = this.documents.find((d: DocumentType) => {
          return d.value === doc.subCategory;
        });
        if (localDoc !== undefined) {
          this.professionalDocument = localDoc;
          localStorage.setItem(
            this.getLocalStorageKey(),
            this.professionalDocument.key || ""
          );
        }
        if (this.tenantProfessionalDocument?.documentDeniedReasons) {
          this.documentDeniedReasons = cloneDeep(
            this.tenantProfessionalDocument.documentDeniedReasons
          );
        }
      } else {
        const key = localStorage.getItem(this.getLocalStorageKey());
        if (key) {
          const localDoc = this.documents.find((d: DocumentType) => {
            return d.key === key;
          });
          if (localDoc !== undefined) {
            this.professionalDocument = localDoc;
          }
        }
      }
    }
  }

  onSelectChange() {
    localStorage.setItem(
      this.getLocalStorageKey(),
      this.professionalDocument.key
    );
    if (this.user.documents !== null) {
      const doc = this.user.documents?.find((d: DfDocument) => {
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
    if (this.user.documents !== null) {
      const doc = this.user.documents?.find((d: DfDocument) => {
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
    if (this.user.documents !== null) {
      const doc = this.user.documents?.find((d: DfDocument) => {
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
    AnalyticsService.uploadFile("professional");
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
    AnalyticsService.registerFile("professional");
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
    const loader = this.$loading.show();
    this.$store
      .dispatch("saveTenantProfessional", formData)
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
      this.$store.getters.getTenantDocuments?.find((d: DfDocument) => {
        return d.documentCategory === "PROFESSIONAL";
      })?.files || [];
    return [...newFiles, ...existingFiles];
  }

  async remove(file: DfFile, silent = false) {
    AnalyticsService.deleteFile("professional");
    if (file.id) {
      await RegisterService.deleteFile(file.id, silent);
    } else {
      const firstIndex = this.files.findIndex((f) => {
        return f.name === file.name && !f.path;
      });
      this.files.splice(firstIndex, 1);
    }
  }
}
</script>

<style scoped lang="scss"></style>
