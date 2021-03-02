<template>
  <div>
    <div>
      <label class="rf-label" for="select">
        {{ $t("select-label") }}
      </label>
      <select
        v-model="professionalDocument"
        class="rf-select rf-mb-3w"
        id="select"
        name="select"
      >
        <option v-for="d in documents" :value="d" :key="d.key">
          {{ $t(d.key) }}
        </option>
      </select>
    </div>
    <WarningMessage class="rf-mb-3w" v-if="isNewDocument()">
      <span>{{ $t("will-delete-files") }}</span>
    </WarningMessage>
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
    <div
      v-if="professionalFiles().length > 0"
      class="rf-col-lg-8 rf-col-md-12 rf-mb-3w"
    >
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
    <div class="rf-mb-5w" v-if="professionalDocument.key">
      <DocumentInsert
        :allow-list="professionalDocument.acceptedProofs"
        :block-list="professionalDocument.refusedProofs"
      ></DocumentInsert>
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
import { User } from "df-shared/src/models/User";
import { DfFile } from "df-shared/src/models/DfFile";
import { DfDocument } from "df-shared/src/models/DfDocument";
import { RegisterService } from "../../services/RegisterService";
import WarningMessage from "df-shared/src/components/WarningMessage.vue";
import { DocumentTypeConstants } from "./DocumentTypeConstants";

@Component({
  components: { DocumentInsert, FileUpload, ListItem, WarningMessage },
  computed: {
    ...mapGetters({
      user: "userToEdit",
    }),
  },
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

  mounted() {
    if (this.$store.getters.isGuarantor) {
      this.documents = DocumentTypeConstants.GUARANTOR_PROFESSIONAL_DOCS;
    }

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

  isNewDocument() {
    if (this.user.documents !== null) {
      const doc = this.user.documents?.find((d: DfDocument) => {
        return d.documentCategory === "PROFESSIONAL";
      });
      if (doc !== undefined) {
        return doc.documentSubCategory !== this.professionalDocument.value;
      }
    }
    return false;
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
      Vue.toasted.global.max_file();
      return;
    }
    Array.from(Array(newFiles.length).keys()).map((x) => {
      const f: File = newFiles[x].file || new File([], "");
      formData.append(`${fieldName}[${x}]`, f, newFiles[x].name);
    });

    formData.append(
      "typeDocumentProfessional",
      this.professionalDocument.value
    );

    this.fileUploadStatus = UploadStatus.STATUS_SAVING;
    if (this.$store.getters.isGuarantor && this.$store.getters.guarantor.id) {
      formData.append("guarantorId", this.$store.getters.guarantor.id);
    }
    const loader = this.$loading.show();
    RegisterService.saveProfessional(formData)
      .then(() => {
        this.files = [];
        this.fileUploadStatus = UploadStatus.STATUS_INITIAL;
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

  professionalFiles() {
    const newFiles = this.files.map((f) => {
      return {
        documentSubCategory: this.professionalDocument.value,
        id: f.name,
        name: f.name,
        size: f.size,
      };
    });
    const existingFiles =
      this.$store.getters.getDocuments?.find((d: DfDocument) => {
        return d.documentCategory === "PROFESSIONAL";
      })?.files || [];
    return [...newFiles, ...existingFiles];
  }

  remove(file: DfFile) {
    if (file.path && file.id) {
      RegisterService.deleteFile(file.id);
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
  "guarantor_cdi": "CDI / CDI (période d'essai) / CDD",
  "register": "Enregistrer",
  "select-label": "Votre situation professionnelle actuelle :"
}
}
</i18n>
