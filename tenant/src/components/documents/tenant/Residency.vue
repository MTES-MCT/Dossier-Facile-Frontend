<template>
  <div>
    <ValidationObserver v-slot="{ validate }">
      <NakedCard class="fr-p-md-5w">
        <div>
          <h1 class="fr-h6">
            {{ $t("residency-page.select-label") }}
          </h1>

          <TroubleshootingModal>
            <DocumentHelp></DocumentHelp>
            <DocumentInsert
              :allow-list="residencyDocument.acceptedProofs"
              :block-list="residencyDocument.refusedProofs"
              v-if="residencyDocument.key"
            ></DocumentInsert>
          </TroubleshootingModal>

          <div class="fr-mt-3w">
            <select
              v-model="residencyDocument"
              class="fr-select fr-mb-3w fr-mt-3w"
              id="select"
              @change="onSelectChange()"
              aria-label="Select residency type"
            >
              <option v-for="d in documents" :value="d" :key="d.key">
                {{ $t(d.key) }}
              </option>
            </select>
          </div>
        </div>
      </NakedCard>
      <NakedCard
        class="fr-p-md-5w fr-mt-3w"
        v-if="
          residencyDocument.key && residencyDocument.key === 'other-residency'
        "
      >
        <TextField
          name="customText"
          :fieldLabel="$tc('residency-page.custom-text')"
          v-model="customText"
          validation-rules="required"
          :textarea="true"
        />
      </NakedCard>
      <NakedCard
        class="fr-p-md-5w fr-mt-3w"
        v-if="
          (residencyDocument.key &&
            residencyDocument.key !== 'other-residency') ||
          residencyFiles().length > 0
        "
      >
        <div class="fr-mb-3w">
          <p
            v-html="$t(`explanation-text.tenant.${residencyDocument.key}`)"
          ></p>
          <div
            class="fr-background-contrast--info fr-p-2w fr-mt-2w warning-box"
            v-if="residencyDocument.key === 'tenant'"
          >
            <div class="fr-text-default--info fr-h6 title">
              <i class="ri-error-warning-line"></i>
              <span class="fr-ml-1w">
                {{ $t("residency-page.warning-only-rent-receipt") }}
              </span>
            </div>
          </div>
          <div
            class="fr-background-contrast--info fr-p-2w fr-mt-2w warning-box"
            v-if="
              residencyDocument.key === 'guest' ||
              residencyDocument.key === 'guest-parents'
            "
          >
            <div class="fr-text-default--info fr-h6 title">
              <i class="ri-error-warning-line"></i>
              <span class="fr-ml-1w">
                {{ $t("residency-page.warning-incomplete") }}
              </span>
            </div>
          </div>
        </div>
        <AllDeclinedMessages
          class="fr-mb-3w"
          :documentDeniedReasons="documentDeniedReasons"
          :documentStatus="documentStatus"
        ></AllDeclinedMessages>
        <div v-if="residencyFiles().length > 0" class="fr-col-12 fr-mb-3w">
          <ListItem
            v-for="(file, k) in residencyFiles()"
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
      <ProfileFooter
        @on-back="$emit('on-back')"
        @on-next="validate().then(goNext)"
      ></ProfileFooter>
    </ValidationObserver>
    <ConfirmModal
      v-if="isDocDeleteVisible"
      @valid="validSelect()"
      @cancel="undoSelect()"
    >
      <span>{{ $t("residency-page.will-delete-files") }}</span>
    </ConfirmModal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";
import DocumentInsert from "../share/DocumentInsert.vue";
import FileUpload from "../../uploads/FileUpload.vue";
import { DocumentType } from "df-shared/src/models/Document";
import { UploadStatus } from "df-shared/src/models/UploadStatus";
import ListItem from "../../uploads/ListItem.vue";
import { User } from "df-shared/src/models/User";
import { DfFile } from "df-shared/src/models/DfFile";
import { DfDocument } from "df-shared/src/models/DfDocument";
import { RegisterService } from "../../../services/RegisterService";
import WarningMessage from "df-shared/src/components/WarningMessage.vue";
import { DocumentTypeConstants } from "../share/DocumentTypeConstants";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";
import DocumentHelp from "../../helps/DocumentHelp.vue";
import VGouvFrModal from "df-shared/src/GouvFr/v-gouv-fr-modal/VGouvFrModal.vue";
import { AnalyticsService } from "../../../services/AnalyticsService";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import AllDeclinedMessages from "../share/AllDeclinedMessages.vue";
import { DocumentDeniedReasons } from "df-shared/src/models/DocumentDeniedReasons";
import { cloneDeep } from "lodash";
import TroubleshootingModal from "@/components/helps/TroubleshootingModal.vue";
import { UtilsService } from "@/services/UtilsService";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import ProfileFooter from "@/components/footer/ProfileFooter.vue";
import TextField from "df-shared/src/components/form/TextField.vue";

@Component({
  components: {
    TextField,
    ValidationObserver,
    ProfileFooter,
    ValidationProvider,
    DocumentInsert,
    FileUpload,
    ListItem,
    WarningMessage,
    ConfirmModal,
    VGouvFrModal,
    DocumentHelp,
    AllDeclinedMessages,
    NakedCard,
    TroubleshootingModal,
  },
  computed: {
    ...mapGetters({
      user: "userToEdit",
      tenantResidencyDocument: "getTenantResidencyDocument",
    }),
  },
})
export default class Residency extends Vue {
  documents: any[] = [];

  user!: User;
  tenantResidencyDocument!: DfDocument;

  documentDeniedReasons = new DocumentDeniedReasons();
  fileUploadStatus = UploadStatus.STATUS_INITIAL;
  files: DfFile[] = [];
  uploadProgress: {
    [key: string]: { state: string; percentage: number };
  } = {};
  residencyDocument = new DocumentType();
  customText = "";

  isDocDeleteVisible = false;

  getLocalStorageKey() {
    return "residency_" + this.user.email;
  }

  get documentStatus() {
    return this.tenantResidencyDocument?.documentStatus;
  }

  beforeMount() {
    this.documents = DocumentTypeConstants.RESIDENCY_DOCS.filter(
      (type: any) =>
        type.key !== "other-residency" ||
        UtilsService.useNewOtherResidencyCategory()
    );
    if (this.user.documents !== null) {
      const doc = this.user.documents?.find((d: DfDocument) => {
        return d.documentCategory === "RESIDENCY";
      });
      if (doc !== undefined) {
        this.customText = doc.customText || "";
        const localDoc = this.documents.find((d: DocumentType) => {
          return d.value === doc.subCategory;
        });
        if (localDoc !== undefined) {
          this.residencyDocument = localDoc;
          localStorage.setItem(
            this.getLocalStorageKey(),
            this.residencyDocument.key || ""
          );
        }
        if (this.tenantResidencyDocument?.documentDeniedReasons) {
          this.documentDeniedReasons = cloneDeep(
            this.tenantResidencyDocument.documentDeniedReasons
          );
        }
      } else {
        const key = localStorage.getItem(this.getLocalStorageKey());
        if (key) {
          const localDoc = this.documents.find((d: DocumentType) => {
            return d.key === key;
          });
          if (localDoc !== undefined) {
            this.residencyDocument = localDoc;
          }
        }
      }
    }
  }

  onSelectChange() {
    localStorage.setItem(this.getLocalStorageKey(), this.residencyDocument.key);
    if (this.user.documents !== null) {
      const doc = this.user.documents?.find((d: DfDocument) => {
        return d.documentCategory === "RESIDENCY";
      });
      if (doc !== undefined) {
        this.isDocDeleteVisible =
          (doc.files?.length || 0) > 0 &&
          doc.subCategory !== this.residencyDocument.value;
      }
    }
    return false;
  }

  undoSelect() {
    if (this.user.documents !== null) {
      const doc = this.user.documents?.find((d: DfDocument) => {
        return d.documentCategory === "RESIDENCY";
      });
      if (doc !== undefined) {
        const localDoc = this.documents.find((d: DocumentType) => {
          return d.value === doc.subCategory;
        });
        if (localDoc !== undefined) {
          this.residencyDocument = localDoc;
        }
      }
    }
    this.isDocDeleteVisible = false;
  }

  async validSelect() {
    this.isDocDeleteVisible = false;
    if (this.user.documents !== null) {
      const doc = this.user.documents?.find((d: DfDocument) => {
        return d.documentCategory === "RESIDENCY";
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

  isNewDocument() {
    if (this.user.documents !== null) {
      const doc = this.user.documents?.find((d: DfDocument) => {
        return d.documentCategory === "RESIDENCY";
      });
      if (doc !== undefined) {
        if (
          (doc.subCategory === "GUEST" &&
            this.residencyDocument.value === "GUEST_PARENTS") ||
          (doc.subCategory === "GUEST_PARENTS" &&
            this.residencyDocument.value === "GUEST")
        ) {
          return false;
        }
        return doc.subCategory !== this.residencyDocument.value;
      }
    }
    return false;
  }

  addFiles(fileList: File[]) {
    AnalyticsService.uploadFile("residency");
    const nf = Array.from(fileList).map((f) => {
      return { name: f.name, file: f, size: f.size };
    });
    this.files = [...this.files, ...nf];
    this.save();
  }
  resetFiles() {
    this.fileUploadStatus = UploadStatus.STATUS_INITIAL;
  }

  async goNext() {
    const saved = await this.save();
    if (saved) {
      this.$emit("on-next");
    }
  }

  async save(): Promise<boolean> {
    AnalyticsService.registerFile("residency");
    this.uploadProgress = {};
    const fieldName = "documents";
    const formData = new FormData();
    const newFiles = this.files.filter((f) => {
      return !f.id;
    });
    if (!newFiles.length) {
      if (this.residencyDocument.key === "other-residency") {
        formData.append("customText", this.customText);
      } else {
        return true;
      }
    }

    if (
      this.residencyDocument.maxFileCount &&
      this.residencyFiles().length > this.residencyDocument.maxFileCount
    ) {
      Vue.toasted.global.max_file({
        message: this.$i18n.t("max-file", [
          this.residencyFiles().length,
          this.residencyDocument.maxFileCount,
        ]),
      });
      this.files = [];
      return false;
    }

    Array.from(Array(newFiles.length).keys()).forEach((x) => {
      const f: File = newFiles[x].file || new File([], "");
      formData.append(`${fieldName}[${x}]`, f, newFiles[x].name);
    });

    formData.append("typeDocumentResidency", this.residencyDocument.value);

    this.fileUploadStatus = UploadStatus.STATUS_SAVING;
    const loader = this.$loading.show();
    return await this.$store
      .dispatch("saveTenantResidency", formData)
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
        loader.hide();
      });
  }

  residencyFiles() {
    const newFiles = this.files.map((f) => {
      return {
        subCategory: this.residencyDocument.value,
        id: f.id,
        name: f.name,
        size: f.size,
      };
    });
    const existingFiles =
      this.$store.getters.getTenantDocuments?.find((d: DfDocument) => {
        return d.documentCategory === "RESIDENCY";
      })?.files || [];
    return [...newFiles, ...existingFiles];
  }

  async remove(file: DfFile, silent = false) {
    AnalyticsService.deleteFile("residency");
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
