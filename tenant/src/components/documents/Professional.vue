<template>
  <div>
    <div>
      <div class="rf-pl-3v">
        {{ $t("select-label") }}
      </div>

      <v-gouv-fr-modal>
        <template v-slot:button>
          En difficulté pour répondre à la question ?
        </template>
        <template v-slot:title>
          En difficulté pour répondre à la question ?
        </template>
        <template v-slot:content>
          <p>
            <DocumentHelp></DocumentHelp>
            <DocumentInsert
              :allow-list="professionalDocument.acceptedProofs"
              :block-list="professionalDocument.refusedProofs"
              v-if="professionalDocument.key"
            ></DocumentInsert>
          </p>
        </template>
      </v-gouv-fr-modal>

      <select
        v-model="professionalDocument"
        class="rf-select rf-mb-3w rf-mt-2w"
        id="select"
        name="select"
        @change="onSelectChange()"
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
    <div v-if="professionalDocument.key">
      <div class="rf-mb-3w">
        {{ professionalDocument.explanationText }}
      </div>
      <div class="rf-mb-3w">
        <FileUpload
          :current-status="fileUploadStatus"
          @add-files="addFiles"
          @reset-files="resetFiles"
        ></FileUpload>
      </div>
    </div>
    <div v-if="professionalFiles().length > 0" class="rf-col-md-12 rf-mb-3w">
      <ListItem
        v-for="(file, k) in professionalFiles()"
        :key="k"
        :file="file"
        @remove="remove(file)"
      />
    </div>
    <div class="rf-col-12 rf-mb-2w" v-if="professionalDocument">
      <button
        class="rf-btn"
        type="submit"
        @click="save"
        :disabled="files.length <= 0"
      >
        {{ $t("register") }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DocumentInsert from "@/components/documents/DocumentInsert.vue";
import FileUpload from "@/components/uploads/FileUpload.vue";
import { mapGetters } from "vuex";
import { DocumentType } from "df-shared/src/models/Document";
import { UploadStatus } from "../uploads/UploadStatus";
import ListItem from "@/components/uploads/ListItem.vue";
import { DfFile } from "df-shared/src/models/DfFile";
import { DfDocument } from "df-shared/src/models/DfDocument";
import { RegisterService } from "../../services/RegisterService";
import WarningMessage from "df-shared/src/components/WarningMessage.vue";
import { DocumentTypeConstants } from "./DocumentTypeConstants";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";
import { User } from "df-shared/src/models/User";
import DocumentHelp from "../helps/DocumentHelp.vue";
import VGouvFrModal from "df-shared/src/GouvFr/v-gouv-fr-modal/VGouvFrModal.vue";

@Component({
  components: {
    DocumentInsert,
    FileUpload,
    ListItem,
    WarningMessage,
    ConfirmModal,
    DocumentHelp,
    VGouvFrModal
  },
  computed: {
    ...mapGetters({
      user: "userToEdit"
    })
  }
})
export default class Professional extends Vue {
  MAX_FILE_COUNT = 5;
  user!: User;
  fileUploadStatus = UploadStatus.STATUS_INITIAL;
  files: DfFile[] = [];
  uploadProgress: {
    [key: string]: { state: string; percentage: number };
  } = {};
  professionalDocument = new DocumentType();
  documents = DocumentTypeConstants.PROFESSIONAL_DOCS;
  isDocDeleteVisible = false;

  mounted() {
    if (this.user.documents !== null) {
      const doc = this.user.documents?.find((d: DfDocument) => {
        return d.documentCategory === "PROFESSIONAL";
      });
      if (doc !== undefined) {
        const localDoc = this.documents.find((d: DocumentType) => {
          return d.value === doc.documentSubCategory;
        });
        if (localDoc !== undefined) {
          this.professionalDocument = localDoc;
        }
      }
    }
  }

  onSelectChange() {
    if (this.user.documents !== null) {
      const doc = this.user.documents?.find((d: DfDocument) => {
        return d.documentCategory === "PROFESSIONAL";
      });
      if (doc !== undefined) {
        this.isDocDeleteVisible =
          (doc.files?.length || 0) > 0 &&
          doc.documentSubCategory !== this.professionalDocument.value;
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
          return d.value === doc.documentSubCategory;
        });
        if (localDoc !== undefined) {
          this.professionalDocument = localDoc;
        }
      }
    }
    this.isDocDeleteVisible = false;
  }

  validSelect() {
    if (this.user.documents !== null) {
      const doc = this.user.documents?.find((d: DfDocument) => {
        return d.documentCategory === "PROFESSIONAL";
      });
      if (doc !== undefined) {
        doc.files?.forEach(f => {
          if (f.id) {
            this.remove(f, true);
          }
        });
      }
    }
    this.isDocDeleteVisible = false;
  }

  addFiles(fileList: File[]) {
    const nf = Array.from(fileList).map(f => {
      return { name: f.name, file: f, size: f.size };
    });
    this.files = [...this.files, ...nf];
  }
  resetFiles() {
    this.fileUploadStatus = UploadStatus.STATUS_INITIAL;
  }
  save() {
    this.uploadProgress = {};
    const fieldName = "documents";
    const formData = new FormData();
    const newFiles = this.files.filter(f => {
      return !f.id;
    });
    if (!newFiles.length) return;

    if (
      this.professionalDocument.maxFileCount &&
      this.professionalFiles().length > this.professionalDocument.maxFileCount
    ) {
      Vue.toasted.global.max_file();
      return;
    }
    Array.from(Array(newFiles.length).keys()).map(x => {
      const f: File = newFiles[x].file || new File([], "");
      formData.append(`${fieldName}[${x}]`, f, newFiles[x].name);
    });

    formData.append(
      "typeDocumentProfessional",
      this.professionalDocument.value
    );

    this.fileUploadStatus = UploadStatus.STATUS_SAVING;
    const loader = this.$loading.show();
    RegisterService.saveProfessional(formData)
      .then(() => {
        this.files = [];
        this.fileUploadStatus = UploadStatus.STATUS_INITIAL;
        Vue.toasted.global.save_success();
        this.$store.dispatch("loadUser");
      })
      .catch(() => {
        this.fileUploadStatus = UploadStatus.STATUS_FAILED;
        Vue.toasted.global.save_failed();
      })
      .finally(() => {
        loader.hide();
      });
  }

  professionalFiles() {
    const newFiles = this.files.map(f => {
      return {
        documentSubCategory: this.professionalDocument.value,
        id: f.name,
        name: f.name,
        size: f.size
      };
    });
    const existingFiles =
      this.$store.getters.getDocuments?.find((d: DfDocument) => {
        return d.documentCategory === "PROFESSIONAL";
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

<style scoped lang="scss"></style>

<i18n>
{
"en": {
  "cdi": "CDI",
  "cdi-trial": "CDI (période d’essai)",
  "cdd": "CDD",
  "alternation": "Alternance",
  "internship": "Stage",
  "student": "Études",
  "public": "Fonction publique",
  "ctt": "CTT (intérimaire)",
  "retired": "Retraité",
  "unemployed": "Chômage",
  "independent": "Indépendant",
  "other": "Autre",
  "will-delete-files": "Please note, a change of situation will result in the deletion of your supporting documents. You will have to upload the supporting documents corresponding to your situation again.",
  "register": "Register",
  "select-label": "Your current professional situation:"
},
"fr": {
  "cdi": "CDI",
  "cdi-trial": "CDI (période d’essai)",
  "cdd": "CDD",
  "alternation": "Alternance",
  "internship": "Stage",
  "student": "Études",
  "public": "Fonction publique",
  "ctt": "CTT (intérimaire)",
  "retired": "Retraité",
  "unemployed": "Chômage",
  "independent": "Indépendant",
  "other": "Autre",
  "will-delete-files": "Attention, un changement de situation entraînera la suppression de vos justificatifs. Vous devrez charger de nouveau les justificatifs correspondant à votre situation.",
  "register": "Enregistrer",
  "select-label": "Votre situation professionnelle actuelle :"
}
}
</i18n>
