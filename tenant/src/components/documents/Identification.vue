<template>
  <div>
    <div>
      <a href="#" @click="showHelp = true">
        En difficulté pour répondre à la question ?
      </a>

      <button
        class="rf-btn rf-modal-btn"
        title="Titre de modal simple (ouvre une fenêtre modale)"
        aria-expanded="false"
        aria-controls="rf-modal-1"
      >
        Titre de modal simple
      </button>

      <dialog
        aria-labelledby="rf-modal-title-modal-1"
        role="dialog"
        id="rf-modal-1"
        class="rf-modal"
      >
        <div class="rf-container--fluid rf-container-md">
          <div class="rf-grid-row rf-grid-row--center">
            <div class="rf-col-12 rf-col-md-6">
              <div class="rf-modal__body">
                <div class="rf-modal__header">
                  <button
                    class="rf-link--close rf-link"
                    title="Fermer la fenêtre modale"
                    aria-controls="rf-modal-1"
                    target="_self"
                  >
                    Fermer
                  </button>
                </div>
                <div class="rf-modal__content">
                  <h1 id="rf-modal-title-modal-1" class="rf-modal__title">
                    <span class="rf-fi-arrow-right-line rf-fi--lg"></span>Titre
                    de la modale
                  </h1>
                  <p>
                    <DocumentHelp></DocumentHelp>
                    <DocumentInsert
                      :allow-list="identificationDocument.acceptedProofs"
                      :block-list="identificationDocument.refusedProofs"
                    ></DocumentInsert>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </dialog>

      <p>
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
              :allow-list="identificationDocument.acceptedProofs"
              :block-list="identificationDocument.refusedProofs"
              v-if="identificationDocument.key"
            ></DocumentInsert>
          </p>
        </template>
      </v-gouv-fr-modal>

      <div class="rf-mt-1w">
        <fieldset class="rf-fieldset">
          <div class="rf-fieldset__content">
            <div class="rf-grid-row">
              <div v-for="d in documents" :key="d.key">
                <BigRadio
                  :val="d"
                  v-model="identificationDocument"
                  @input="onSelectChange()"
                >
                  <div class="rf-grid-col spa">
                    <span>{{ $t(d.key) }}</span>
                  </div>
                </BigRadio>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
    </div>
    <ConfirmModal
      v-if="isDocDeleteVisible"
      @valid="validSelect()"
      @cancel="undoSelect()"
    >
      <span>{{ $t("will-delete-files") }}</span>
    </ConfirmModal>
    <div v-if="identificationDocument.key">
      <div v-if="identificationDocument.explanationText">
        <div
          class="rf-mt-1w rf-mb-1w rf-ml-2w"
          v-html="identificationDocument.explanationText"
        ></div>
      </div>
      <div class="rf-mb-3w">
        <FileUpload
          :current-status="fileUploadStatus"
          :page="4"
          @add-files="addFiles"
          @reset-files="resetFiles"
        ></FileUpload>
      </div>
    </div>
    <div v-if="identificationFiles().length > 0" class="rf-col-md-12 rf-mb-3w">
      <ListItem
        v-for="(file, k) in identificationFiles()"
        :key="k"
        :file="file"
        @remove="remove(file)"
      />
    </div>
    <div class="rf-col-12 rf-mb-3w rf-mt-2w" v-if="identificationDocument">
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
import { mapGetters } from "vuex";
import DocumentInsert from "@/components/documents/DocumentInsert.vue";
import FileUpload from "@/components/uploads/FileUpload.vue";
import { DocumentType } from "df-shared/src/models/Document";
import { UploadStatus } from "../uploads/UploadStatus";
import ListItem from "@/components/uploads/ListItem.vue";
import { User } from "df-shared/src/models/User";
import { DfFile } from "df-shared/src/models/DfFile";
import { DfDocument } from "df-shared/src/models/DfDocument";
import { ValidationProvider } from "vee-validate";
import { RegisterService } from "../../services/RegisterService";
import WarningMessage from "df-shared/src/components/WarningMessage.vue";
import { DocumentTypeConstants } from "./DocumentTypeConstants";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";
import DfButton from "df-shared/src/Button/Button.vue";
import BigRadio from "df-shared/src/Button/BigRadio.vue";
import DocumentHelp from "../helps/DocumentHelp.vue";
import VGouvFrModal from "df-shared/src/GouvFr/v-gouv-fr-modal/VGouvFrModal.vue";

@Component({
  components: {
    DocumentInsert,
    FileUpload,
    ListItem,
    ValidationProvider,
    WarningMessage,
    ConfirmModal,
    DfButton,
    BigRadio,
    DocumentHelp,
    VGouvFrModal,
    DocumentHelp
  },
  computed: {
    ...mapGetters({
      user: "userToEdit"
    })
  }
})
export default class Identification extends Vue {
  MAX_FILE_COUNT = 3;
  documents = DocumentTypeConstants.IDENTIFICATION_DOCS;

  user!: User;
  fileUploadStatus = UploadStatus.STATUS_INITIAL;
  files: DfFile[] = [];
  identificationDocument = new DocumentType();
  isDocDeleteVisible = false;

  onSelectChange() {
    if (this.user.documents !== null) {
      const doc = this.user.documents?.find((d: DfDocument) => {
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
    if (this.user.documents !== null) {
      const doc = this.user.documents?.find((d: DfDocument) => {
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
    if (this.user.documents !== null) {
      const doc = this.user.documents?.find((d: DfDocument) => {
        return d.documentCategory === "IDENTIFICATION";
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

  mounted() {
    if (this.user.documents !== null) {
      const doc = this.user.documents?.find((d: DfDocument) => {
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
      Vue.toasted.global.max_file();
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

    this.fileUploadStatus = UploadStatus.STATUS_SAVING;
    const loader = this.$loading.show();
    RegisterService.saveIdentification(formData)
      .then(() => {
        this.fileUploadStatus = UploadStatus.STATUS_INITIAL;
        this.files = [];
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
  "will-delete-files": "Please note, a change of situation will result in the deletion of your supporting documents. You will have to upload the supporting documents corresponding to your situation again.",
  "register": "Register",
  "select-label": "I add a valid identity document.",
  "validate": "Validate",
  "cancel": "Cancel"
},
"fr": {
  "identity-card": "Carte nationale d’identité",
  "passport": "Passeport",
  "permit": "Permis de conduire",
  "other": "Autre",
  "files": "Documents",
  "will-delete-files": "Attention, un changement de situation entraînera la suppression de vos justificatifs. Vous devrez charger de nouveau les justificatifs correspondant à votre situation.",
  "register": "Enregistrer la pièce",
  "select-label": "J’ajoute une pièce d’identité en cours de validité.",
  "validate": "Valider",
  "cancel": "Annuler"
}
}
</i18n>
