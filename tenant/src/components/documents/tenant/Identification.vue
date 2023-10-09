<template>
  <div>
    <NakedCard class="fr-p-md-5w">
      <h1 class="fr-h6">
        {{ $t("identification-page.select-label") }}
      </h1>
      <div class="fr-mt-3w">
        <SimpleRadioButtons
          name="application-type-selector"
          v-model="identificationDocument"
          @input="onSelectChange"
          :elements="mapDocuments()"
        ></SimpleRadioButtons>
      </div>
    </NakedCard>
    <NakedCard
      class="fr-p-md-5w fr-mt-3w"
      v-if="identificationDocument.key || identificationFiles().length > 0"
    >
      <div class="fr-mb-3w">
        <p
          v-html="$t(`explanation-text.tenant.${identificationDocument.key}`)"
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
    <ConfirmModal
      v-if="isDocDeleteVisible"
      @valid="validSelect()"
      @cancel="undoSelect()"
    >
      <span>{{ $t("identification-page.will-delete-files") }}</span>
    </ConfirmModal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";
import FileUpload from "../../uploads/FileUpload.vue";
import { DocumentType } from "df-shared/src/models/Document";
import { UploadStatus } from "df-shared/src/models/UploadStatus";
import ListItem from "../../uploads/ListItem.vue";
import { User } from "df-shared/src/models/User";
import { DfFile } from "df-shared/src/models/DfFile";
import { DfDocument } from "df-shared/src/models/DfDocument";
import { ValidationProvider } from "vee-validate";
import { RegisterService } from "../../../services/RegisterService";
import WarningMessage from "df-shared/src/components/WarningMessage.vue";
import { DocumentTypeConstants } from "../share/DocumentTypeConstants";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";
import DfButton from "df-shared/src/Button/Button.vue";
import DocumentHelp from "../../helps/DocumentHelp.vue";
import { AnalyticsService } from "../../../services/AnalyticsService";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import AllDeclinedMessages from "../share/AllDeclinedMessages.vue";
import { DocumentDeniedReasons } from "df-shared/src/models/DocumentDeniedReasons";
import { cloneDeep } from "lodash";
import TroubleshootingModal from "@/components/helps/TroubleshootingModal.vue";
import { UtilsService } from "@/services/UtilsService";
import SimpleRadioButtons from "df-shared/src/Button/SimpleRadioButtons.vue";

@Component({
  components: {
    FileUpload,
    ListItem,
    AllDeclinedMessages,
    ValidationProvider,
    WarningMessage,
    ConfirmModal,
    DfButton,
    DocumentHelp,
    NakedCard,
    SimpleRadioButtons,
    TroubleshootingModal,
  },
  computed: {
    ...mapGetters({
      user: "userToEdit",
      tenantIdentificationDocument: "getTenantIdentificationDocument",
    }),
  },
})
export default class Identification extends Vue {
  documents = DocumentTypeConstants.IDENTIFICATION_DOCS;

  user!: User;
  tenantIdentificationDocument!: DfDocument;

  documentDeniedReasons = new DocumentDeniedReasons();
  fileUploadStatus = UploadStatus.STATUS_INITIAL;
  files: DfFile[] = [];
  identificationDocument = new DocumentType();
  isDocDeleteVisible = false;

  getLocalStorageKey() {
    return "identification_" + this.user.email;
  }

  get documentStatus() {
    return this.tenantIdentificationDocument?.documentStatus;
  }

  beforeMount() {
    if (this.user.documents !== null) {
      if (this.tenantIdentificationDocument !== undefined) {
        const localDoc = this.documents.find((d: DocumentType) => {
          return d.value === this.tenantIdentificationDocument?.subCategory;
        });
        if (localDoc !== undefined) {
          this.identificationDocument = localDoc;
          localStorage.setItem(
            this.getLocalStorageKey(),
            this.identificationDocument.key || ""
          );
        }
        if (this.tenantIdentificationDocument?.documentDeniedReasons) {
          this.documentDeniedReasons = cloneDeep(
            this.tenantIdentificationDocument.documentDeniedReasons
          );
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

  onSelectChange() {
    localStorage.setItem(
      this.getLocalStorageKey(),
      this.identificationDocument.key
    );
    if (this.user.documents !== null) {
      const doc = this.tenantIdentificationDocument;
      if (doc !== undefined) {
        this.isDocDeleteVisible =
          (doc?.files?.length || 0) > 0 &&
          doc?.subCategory !== this.identificationDocument.value;
      }
    }
    return false;
  }

  undoSelect() {
    if (this.user.documents !== null) {
      const doc = this.tenantIdentificationDocument;
      if (doc !== undefined) {
        const localDoc = this.documents.find((d: DocumentType) => {
          return d.value === doc?.subCategory;
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
    if (this.user.documents !== null) {
      const doc = this.tenantIdentificationDocument;
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
    AnalyticsService.uploadFile("identification");
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
    AnalyticsService.registerFile("identification");
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

    this.fileUploadStatus = UploadStatus.STATUS_SAVING;
    // TODO : remove loader when upload status is well handled (be carefull with multiple save at the same time)
    const loader = this.$loading.show();
    this.$store
      .dispatch("saveTenantIdentification", formData)
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
    const existingFiles =
      this.$store.getters.getTenantDocuments?.find((d: DfDocument) => {
        return d.documentCategory === "IDENTIFICATION";
      })?.files || [];
    return [...newFiles, ...existingFiles];
  }

  async remove(file: DfFile, silent = false) {
    AnalyticsService.deleteFile("identification");
    if (file.id) {
      await RegisterService.deleteFile(file.id, silent);
    } else {
      const firstIndex = this.files.findIndex((f) => {
        return f.name === file.name && !f.path;
      });
      this.files.splice(firstIndex, 1);
    }
  }

  mapDocuments() {
    return this.documents.map((d) => {
      return { id: d.key, labelKey: d.key, value: d };
    });
  }
}
</script>

<style scoped lang="scss"></style>
