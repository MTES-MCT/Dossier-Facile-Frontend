<template>
  <div>
    <div>
      <NakedCard class="fr-p-md-5w">
        <h1 class="fr-h6">
          {{ $t("select-label") }}
        </h1>

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
      </NakedCard>
    </div>
    <ConfirmModal
      v-if="isDocDeleteVisible"
      @valid="validSelect()"
      @cancel="undoSelect()"
    >
      <span>{{ $t("will-delete-files") }}</span>
    </ConfirmModal>

    <NakedCard
      class="fr-p-md-5w fr-mt-3w"
      v-if="identificationDocument.key || identificationFiles().length > 0"
    >
      <div v-if="identificationDocument.explanationText">
        <div
          class="fr-mb-1w"
          v-html="identificationDocument.explanationText"
        ></div>
      </div>
      <div v-if="tenantIdentificationDocument()">
        <div
          v-for="(m, k) in tenantIdentificationDocument().documentDeniedReasons
            .checkedOptions"
          :key="k"
        >
          <DeclinedMessage :message="m"></DeclinedMessage>
        </div>
        <div
          v-if="tenantIdentificationDocument().documentDeniedReasons.comment"
        >
          <DeclinedMessage
            :message="
              tenantIdentificationDocument().documentDeniedReasons.comment
            "
          ></DeclinedMessage>
        </div>
      </div>
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
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";
import DocumentInsert from "./DocumentInsert.vue";
import FileUpload from "../uploads/FileUpload.vue";
import { DocumentType } from "df-shared/src/models/Document";
import { UploadStatus } from "df-shared/src/models/UploadStatus";
import ListItem from "../uploads/ListItem.vue";
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
import { AnalyticsService } from "../../services/AnalyticsService";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import DeclinedMessage from "df-shared/src/components/DeclinedMessage.vue";

@Component({
  components: {
    DocumentInsert,
    FileUpload,
    ListItem,
    DeclinedMessage,
    ValidationProvider,
    WarningMessage,
    ConfirmModal,
    DfButton,
    BigRadio,
    DocumentHelp,
    VGouvFrModal,
    NakedCard
  },
  computed: {
    ...mapGetters({
      user: "userToEdit"
    })
  }
})
export default class Identification extends Vue {
  documents = DocumentTypeConstants.IDENTIFICATION_DOCS;

  user!: User;
  fileUploadStatus = UploadStatus.STATUS_INITIAL;
  files: DfFile[] = [];
  identificationDocument = new DocumentType();
  isDocDeleteVisible = false;

  getLocalStorageKey() {
    return "identification_" + this.user.email;
  }

  beforeMount() {
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
          localStorage.setItem(
            this.getLocalStorageKey(),
            this.identificationDocument.key || ""
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

  async validSelect() {
    this.isDocDeleteVisible = false;
    if (this.user.documents !== null) {
      const doc = this.user.documents?.find((d: DfDocument) => {
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

  addFiles(fileList: File[]) {
    AnalyticsService.uploadFile("identification");
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
    AnalyticsService.registerFile("identification");
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
        message: this.$i18n.t("max-file", [
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

  tenantIdentificationDocument() {
    return this.$store.getters.getTenantIdentificationDocument;
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
      this.$store.getters.getTenantDocuments?.find((d: DfDocument) => {
        return d.documentCategory === "IDENTIFICATION";
      })?.files || [];
    return [...newFiles, ...existingFiles];
  }

  async remove(file: DfFile, silent = false) {
    AnalyticsService.deleteFile("identification");
    if (file.path && file.id) {
      await RegisterService.deleteFile(file.id, silent);
    } else {
      const firstIndex = this.files.findIndex(f => {
        return f.name === file.name && f.file === file.file && !f.id;
      });
      this.files.splice(firstIndex, 1);
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
  "identity-card": "French identity card",
  "passport": "French passeport",
  "permit": "French residence permit",
  "other": "Autre",
  "files": "Documents",
  "will-delete-files": "Please note, a change of situation will result in the deletion of your supporting documents. You will have to upload the supporting documents corresponding to your situation again.",
  "select-label": "I add a valid identity document.",
  "validate": "Validate",
  "cancel": "Cancel"
},
"fr": {
  "identity-card": "Carte d’identité française",
  "passport": "Passeport français",
  "permit": "Titre de séjour français",
  "other": "Autre",
  "files": "Documents",
  "will-delete-files": "Attention, un changement de situation entraînera la suppression de vos justificatifs. Vous devrez charger de nouveau les justificatifs correspondant à votre situation.",
  "select-label": "Déposez une pièce d'identité en cours de validité.",
  "validate": "Valider",
  "cancel": "Annuler"
}
}
</i18n>
