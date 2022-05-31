<template>
  <div>
    <NakedCard class="fr-p-md-5w">
      <div>
        <h1 class="fr-h6">{{ $t("title") }}</h1>
        <v-gouv-fr-modal>
          <template v-slot:button>
            En difficulté pour répondre à la question ?
          </template>
          <template v-slot:title>
            En difficulté pour répondre à la question ?
          </template>
          <template v-slot:content>
            <p>
              <GuarantorChoiceHelp></GuarantorChoiceHelp>
              <DocumentInsert
                :allow-list="professionalDocument.acceptedProofs"
                :block-list="professionalDocument.refusedProofs"
                v-if="professionalDocument.key"
              ></DocumentInsert>
            </p>
          </template>
        </v-gouv-fr-modal>
        <div class="fr-mt-3w">
          <validation-provider
            rules="select"
            name="professionalDocument"
            v-slot="{ errors, valid }"
          >
            <label>{{ $t("select-label") }}</label>
            <select
              v-model="professionalDocument"
              class="fr-select fr-mb-3w"
              :class="{
                'fr-select--valid': valid,
                'fr-select--error': errors[0]
              }"
              id="select"
              as="select"
              @change="onSelectChange()"
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
      <span>{{ $t("will-delete-files") }}</span>
    </ConfirmModal>
    <NakedCard
      class="fr-p-md-5w fr-mt-3w"
      v-if="professionalDocument.key || professionalFiles().length > 0"
    >
      <div class="fr-mb-3w">
        {{ professionalDocument.explanationText }}
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
import { Component, Vue, Watch } from "vue-property-decorator";
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
import { extend } from "vee-validate";

extend("select", {
  message: "select-is-empty",
  validate(value) {
    return {
      required: true,
      valid: value.key
    };
  },
  computesRequired: true
});

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
    ValidationProvider
  },
  computed: {
    ...mapState({
      selectedGuarantor: "selectedGuarantor"
    })
  }
})
export default class Professional extends Vue {
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

  @Watch("selectedGuarantor")
  onGuarantorChange() {
    this.updateGuarantorData();
  }

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
          return d.value === doc.documentSubCategory;
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
          doc.documentSubCategory !== this.professionalDocument.value;
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
          return d.value === doc.documentSubCategory;
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
      Vue.toasted.global.max_file({
        message: this.$i18n.t("max-file", [
          this.professionalFiles().length,
          this.professionalDocument.maxFileCount
        ])
      });
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
    if (this.$store.getters.guarantor.id) {
      formData.append("guarantorId", this.$store.getters.guarantor.id);
    }
    const loader = this.$loading.show();
    this.$store
      .dispatch("saveGuarantorProfessional", formData)
      .then(() => {
        this.files = [];
        this.fileUploadStatus = UploadStatus.STATUS_INITIAL;
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
      this.$store.getters.getGuarantorDocuments?.find((d: DfDocument) => {
        return d.documentCategory === "PROFESSIONAL";
      })?.files || [];
    return [...newFiles, ...existingFiles];
  }

  async remove(file: DfFile, silent = false) {
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

<style scoped lang="scss"></style>

<i18n>
{
"en": {
  "title": "Proof of professional and financial situation",
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
  "select-label": "Your current professional situation:",
  "select-is-empty": "Item selection is required"
},
"fr": {
  "title": "Justificatif de situation professionelle et financière",
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
  "select-label": "La situation professionnelle, actuelle, de mon garant :",
  "select-is-empty": "Sélection requise"
}
}
</i18n>
