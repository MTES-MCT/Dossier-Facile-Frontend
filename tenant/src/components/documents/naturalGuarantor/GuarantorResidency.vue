<template>
  <div>
    <ValidationObserver v-slot="{ validate }">
      <NakedCard class="fr-p-md-5w">
        <div>
          <h1 class="fr-h6">
            {{ $t("guarantorresidency.select-label") }}
          </h1>

          <TroubleshootingModal>
            <GuarantorChoiceHelp></GuarantorChoiceHelp>
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
      <ConfirmModal
        v-if="isDocDeleteVisible"
        @valid="validSelect()"
        @cancel="undoSelect()"
      >
        <span>{{ $t("guarantorresidency.will-delete-files") }}</span>
      </ConfirmModal>
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
            v-html="
              $t(`explanation-text.${guarantorKey()}.${residencyDocument.key}`)
            "
          ></p>
          <div
            class="fr-background-contrast--info fr-p-2w fr-mt-2w warning-box"
            v-if="residencyDocument.key === 'guest'"
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
import TroubleshootingModal from "@/components/helps/TroubleshootingModal.vue";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { UtilsService } from "@/services/UtilsService";
import ProfileFooter from "@/components/footer/ProfileFooter.vue";
import TextField from "df-shared/src/components/form/TextField.vue";

@Component({
  components: {
    TextField,
    ValidationObserver,
    ProfileFooter,
    ValidationProvider,
    AllDeclinedMessages,
    DocumentInsert,
    FileUpload,
    ListItem,
    WarningMessage,
    ConfirmModal,
    GuarantorChoiceHelp,
    VGouvFrModal,
    NakedCard,
    TroubleshootingModal,
  },
  computed: {
    ...mapState({
      selectedGuarantor: "selectedGuarantor",
    }),
  },
})
export default class GuarantorResidency extends Vue {
  @Prop() tenantId?: string;

  selectedGuarantor!: Guarantor;
  fileUploadStatus = UploadStatus.STATUS_INITIAL;
  files: DfFile[] = [];
  uploadProgress: {
    [key: string]: { state: string; percentage: number };
  } = {};
  residencyDocument = new DocumentType();
  documentDeniedReasons = new DocumentDeniedReasons();
  customText = "";

  documents: any[] = [];
  isDocDeleteVisible = false;

  mounted() {
    this.documents = DocumentTypeConstants.GUARANTOR_RESIDENCY_DOCS.filter(
      (type: any) =>
        type.key !== "other-residency" ||
        UtilsService.useNewOtherResidencyCategory()
    );
    this.updateGuarantorData();
  }

  get documentStatus() {
    return this.guarantorResidencyDocument()?.documentStatus;
  }

  guarantorResidencyDocument() {
    return this.$store.getters.getGuarantorResidencyDocument;
  }

  updateGuarantorData() {
    if (this.selectedGuarantor.documents !== null) {
      const doc = this.selectedGuarantor.documents?.find((d: DfDocument) => {
        return d.documentCategory === "RESIDENCY";
      });
      if (doc !== undefined) {
        this.customText = doc.customText || "";
        const localDoc = this.documents.find((d: DocumentType) => {
          return d.value === doc.subCategory;
        });
        if (localDoc !== undefined) {
          this.residencyDocument = localDoc;
        }
      }
      if (this.guarantorResidencyDocument()?.documentDeniedReasons) {
        this.documentDeniedReasons = cloneDeep(
          this.guarantorResidencyDocument()?.documentDeniedReasons
        );
      }
    }
  }

  onSelectChange() {
    if (this.selectedGuarantor.documents !== null) {
      const doc = this.selectedGuarantor.documents?.find((d: DfDocument) => {
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
    if (this.selectedGuarantor.documents !== null) {
      const doc = this.selectedGuarantor.documents?.find((d: DfDocument) => {
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
    if (this.selectedGuarantor.documents !== null) {
      const doc = this.selectedGuarantor.documents?.find((d: DfDocument) => {
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
    if (this.selectedGuarantor.documents !== null) {
      const doc = this.selectedGuarantor.documents?.find((d: DfDocument) => {
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

  async goNext() {
    const saved = await this.save();
    if (saved) {
      this.$emit("on-next");
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

  async save(): Promise<boolean> {
    this.uploadProgress = {};
    const fieldName = "documents";
    const formData = new FormData();
    const newFiles = this.files.filter((f) => {
      return !f.id;
    });

    if (!newFiles.length) {
      if (this.residencyDocument.key === "other-residency") {
        console.log(this.customText);
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
    if (this.$store.getters.guarantor.id) {
      formData.append("guarantorId", this.$store.getters.guarantor.id);
    }
    if (this.tenantId) {
      formData.append("tenantId", this.tenantId);
    }
    const loader = this.$loading.show();
    return await this.$store
      .dispatch("saveGuarantorResidency", formData)
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
      this.$store.getters.getGuarantorDocuments?.find((d: DfDocument) => {
        return d.documentCategory === "RESIDENCY";
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
