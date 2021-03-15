<template>
  <div>
    <div class="rf-grid-row rf-grid-row--center">
      <div class="rf-col-12 rf-mb-3w">
        <validation-provider rules="required" v-slot="{ errors }">
          <div
            class="rf-input-group"
            :class="errors[0] ? 'rf-input-group--error' : ''"
          >
            <label class="rf-label" for="lastname"
              >{{ $t("lastname") }} :</label
            >
            <input
              v-model="lastName"
              class="form-control rf-input validate-required"
              id="lastname"
              name="lastname"
              :placeholder="$t('lastname')"
              type="text"
            />
            <span class="rf-error-text" v-if="errors[0]">{{
              $t(errors[0])
            }}</span>
          </div>
        </validation-provider>
      </div>
      <div class="rf-col-12 rf-mb-3w">
        <validation-provider rules="required" v-slot="{ errors }">
          <div
            class="rf-input-group"
            :class="errors[0] ? 'rf-input-group--error' : ''"
          >
            <label for="firstname" class="rf-label"
              >{{ $t("firstname") }} :</label
            >
            <input
              id="firstname"
              :placeholder="$t('firstname')"
              type="text"
              v-model="firstName"
              name="firstname"
              class="validate-required form-control rf-input"
            />
            <span class="rf-error-text" v-if="errors[0]">{{
              $t(errors[0])
            }}</span>
          </div>
        </validation-provider>
      </div>
    </div>
    <div>
      <label class="rf-label" for="select">
        {{ $t("select-label") }}
      </label>
      <select
        @change="onSelectChange()"
        v-model="identificationDocument"
        class="rf-select rf-mb-3w"
        id="select"
        name="select"
      >
        <option v-for="d in documents" :value="d" :key="d.key">
          {{ $t(d.key) }}
        </option>
      </select>
    </div>
    <ConfirmModal
      v-if="isDocDeleteVisible"
      @valid="validSelect()"
      @cancel="undoSelect()"
    >
      <span>{{ $t("will-delete-files") }}</span>
    </ConfirmModal>
    <div v-if="identificationDocument.key">
      <div v-if="identificationDocument.explanationText" class="rf-mb-3w">
        <p v-html="identificationDocument.explanationText"></p>
      </div>
      <div class="rf-mb-3w">
        <FileUpload
          :current-status="fileUploadStatus"
          @add-files="addFiles"
          @reset-files="resetFiles"
        ></FileUpload>
      </div>
    </div>
    <div
      v-if="identificationFiles().length > 0"
      class="rf-col-lg-8 rf-col-md-12 rf-mb-3w"
    >
      <ListItem
        v-for="(file, k) in identificationFiles()"
        :key="k"
        :file="file"
        @remove="remove(file)"
      />
    </div>
    <div class="rf-col-12 rf-mb-2w" v-if="identificationDocument">
      <button
        class="rf-btn"
        type="submit"
        @click="save"
        :disabled="files.length <= 0"
      >
        {{ $t("register") }}
      </button>
    </div>
    <div class="rf-mb-5w" v-if="identificationDocument.key">
      <DocumentInsert
        :allow-list="identificationDocument.acceptedProofs"
        :block-list="identificationDocument.refusedProofs"
      ></DocumentInsert>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapState } from "vuex";
import DocumentInsert from "@/components/documents/DocumentInsert.vue";
import FileUpload from "@/components/uploads/FileUpload.vue";
import { DocumentType } from "df-shared/src/models/Document";
import { UploadStatus } from "../uploads/UploadStatus";
import ListItem from "@/components/uploads/ListItem.vue";
import { DfFile } from "df-shared/src/models/DfFile";
import { DfDocument } from "df-shared/src/models/DfDocument";
import { ValidationProvider } from "vee-validate";
import { Guarantor } from "df-shared/src/models/Guarantor";
import { RegisterService } from "../../services/RegisterService";
import WarningMessage from "df-shared/src/components/WarningMessage.vue";
import { DocumentTypeConstants } from "./DocumentTypeConstants";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";
import DfButton from "df-shared/src/Button/Button.vue";

@Component({
  components: {
    DocumentInsert,
    FileUpload,
    ListItem,
    ValidationProvider,
    WarningMessage,
    ConfirmModal,
    DfButton,
  },
  computed: {
    ...mapState({
      selectedGuarantor: "selectedGuarantor",
    }),
  },
})
export default class Identification extends Vue {
  MAX_FILE_COUNT = 3;
  documents = DocumentTypeConstants.GUARANTOR_IDENTIFICATION_DOCS;

  selectedGuarantor!: Guarantor;
  fileUploadStatus = UploadStatus.STATUS_INITIAL;
  files: DfFile[] = [];
  identificationDocument = new DocumentType();
  firstName = "";
  lastName = "";
  isDocDeleteVisible = false;

  @Watch("selectedGuarantor")
  onGuarantorChange(val: Guarantor) {
    this.firstName = val.firstName || "";
    this.lastName = val.lastName || "";
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

  validSelect() {
    if (this.selectedGuarantor.documents !== null) {
      const doc = this.selectedGuarantor.documents?.find((d: DfDocument) => {
        return d.documentCategory === "IDENTIFICATION";
      });
      if (doc !== undefined) {
        doc.files?.forEach((f) => {
          if (f.id) {
            this.remove(f, true);
          }
        });
      }
    }
    this.isDocDeleteVisible = false;
  }

  mounted() {
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

    if (this.selectedGuarantor.firstName) {
      this.firstName = this.selectedGuarantor.firstName;
    }
    if (this.selectedGuarantor.lastName) {
      this.lastName = this.selectedGuarantor.lastName;
    }
  }

  addFiles(fileList: File[]) {
    const nf = Array.from(fileList).map((f) => {
      return { name: f.name, file: f, size: f.size };
    });
    this.files = [...this.files, ...nf];
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
      Vue.toasted.global.max_file();
      return;
    }

    Array.from(Array(newFiles.length).keys()).map((x) => {
      const f: File = newFiles[x].file || new File([], "");
      formData.append(`${fieldName}[${x}]`, f, newFiles[x].name);
    });

    formData.append(
      "typeDocumentIdentification",
      this.identificationDocument.value
    );

    this.fileUploadStatus = UploadStatus.STATUS_SAVING;
    formData.append("firstName", this.firstName);
    formData.append("lastName", this.lastName);
    if (this.$store.getters.guarantor.id) {
      formData.append("guarantorId", this.$store.getters.guarantor.id);
    }
    const loader = this.$loading.show();
    RegisterService.saveIdentification(formData)
      .then(() => {
        this.fileUploadStatus = UploadStatus.STATUS_INITIAL;
        this.files = [];
        Vue.toasted.global.save_success();
      })
      .catch(() => {
        this.fileUploadStatus = UploadStatus.STATUS_FAILED;
        Vue.toasted.global.save_failed();
      })
      .finally(() => {
        this.$store.dispatch("loadUser");
        loader.hide();
      });
  }

  identificationFiles() {
    const newFiles = this.files.map((f) => {
      return {
        documentSubCategory: this.identificationDocument.value,
        id: f.name,
        name: f.name,
        file: f.file,
        size: f.file?.size,
      };
    });
    const existingFiles =
      this.$store.getters.getDocuments?.find((d: DfDocument) => {
        return d.documentCategory === "IDENTIFICATION";
      })?.files || [];
    return [...newFiles, ...existingFiles];
  }

  remove(file: DfFile, silent = false) {
    if (file.path && file.id) {
      RegisterService.deleteFile(file.id, silent);
    } else {
      this.files = this.files.filter((f: DfFile) => {
        return f.name !== file.name;
      });
    }
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

<i18n>
{
"en": {
  "identity-card": "Carte nationale d’identité",
  "passport": "Passeport",
  "permit": "Permis de conduire",
  "other": "Autre",
  "files": "Documents",
  "lastname": "Lastname",
  "firstname": "Firstname",
  "will-delete-files": "Please note, a change of situation will result in the deletion of your supporting documents. You will have to upload the supporting documents corresponding to your situation again.",
  "register": "Register",
  "select-label": "I add a valid identity document. Attention, be sure to add your double-sided part!",
  "validate": "Validate",
  "cancel": "Cancel",
  "field-required": "This field is required"
},
"fr": {
  "identity-card": "Carte nationale d’identité",
  "passport": "Passeport",
  "permit": "Permis de conduire",
  "other": "Autre",
  "files": "Documents",
  "lastname": "Nom",
  "firstname": "Prénom",
  "will-delete-files": "Attention, un changement de situation entraînera la suppression des justificatifs. Vous devrez charger de nouveau les justificatifs.",
  "register": "Enregistrer la pièce",
  "select-label": "J’ajoute une pièce d’identité en cours de validité. Attention, veillez à ajouter une pièce recto-verso !",
  "validate": "Valider",
  "cancel": "Annuler",
  "field-required": "Ce champ est requis"
}
}
</i18n>
