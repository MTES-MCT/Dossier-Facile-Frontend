<template>
  <div>
    <div>
      <label class="rf-label" for="select">
        Votre situation d’hébergement actuelle :
      </label>
      <select
        v-model="residencyDocument"
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
    <div v-if="residencyDocument.key">
      <div class="rf-mb-3w">
        <p v-html="$t(residencyDocument.explanationText)"></p>
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
      v-if="residencyFiles().length > 0"
      class="rf-col-lg-8 rf-col-md-12 rf-mb-3w"
    >
      <ListItem
        v-for="(file, k) in residencyFiles()"
        :key="k"
        :file="file"
        @remove="remove(file)"
      />
    </div>
    <div class="rf-col-12 rf-mb-2w" v-if="residencyDocument">
      <button
        class="rf-btn"
        type="submit"
        @click="save"
        :disabled="files.length <= 0"
      >
        Enregistrer la pièce
      </button>
    </div>
    <div class="rf-mb-5w" v-if="residencyDocument.key">
      <DocumentInsert
        :allow-list="residencyDocument.acceptedProofs"
        :block-list="residencyDocument.refusedProofs"
      ></DocumentInsert>
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
export default class Residency extends Vue {
  user!: User;
  fileUploadStatus = UploadStatus.STATUS_INITIAL;
  files: DfFile[] = [];
  uploadProgress: {
    [key: string]: { state: string; percentage: number };
  } = {};
  residencyDocument = new DocumentType();

  documents = DocumentTypeConstants.RESIDENCY_DOCS;

  mounted() {
    if (this.user.documents !== null) {
      const doc = this.user.documents?.find((d: DfDocument) => {
        return d.documentCategory === "RESIDENCY";
      });
      if (doc !== undefined) {
        const localDoc = this.documents.find((d: DocumentType) => {
          return d.value === doc.documentSubCategory;
        });
        if (localDoc !== undefined) {
          this.residencyDocument = localDoc;
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
          (doc.documentSubCategory === "GUEST" &&
            this.residencyDocument.value === "GUEST_PARENTS") ||
          (doc.documentSubCategory === "GUEST_PARENTS" &&
            this.residencyDocument.value === "GUEST")
        ) {
          return false;
        }
        return doc.documentSubCategory !== this.residencyDocument.value;
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
      this.residencyDocument.maxFileCount &&
      this.residencyFiles().length > this.residencyDocument.maxFileCount
    ) {
      Vue.toasted.global.max_file();
      return;
    }

    Array.from(Array(newFiles.length).keys()).map((x) => {
      const f: File = newFiles[x].file || new File([], "");
      formData.append(`${fieldName}[${x}]`, f, newFiles[x].name);
    });

    formData.append("typeDocumentResidency", this.residencyDocument.value);

    this.fileUploadStatus = UploadStatus.STATUS_SAVING;
    if (this.$store.getters.isGuarantor && this.$store.getters.guarantor.id) {
      formData.append("guarantorId", this.$store.getters.guarantor.id);
    }
    const loader = this.$loading.show();
    RegisterService.saveResidency(formData)
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

  residencyFiles() {
    const newFiles = this.files.map((f) => {
      return {
        documentSubCategory: this.residencyDocument.value,
        id: f.name,
        name: f.name,
        size: f.size,
      };
    });
    const existingFiles =
      this.$store.getters.getDocuments?.find((d: DfDocument) => {
        return d.documentCategory === "RESIDENCY";
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
  "tenant": "Vous êtes locataire",
  "owner": "Vous êtes propriétaire",
  "guest": "Vous êtes hébergé gratuitement",
  "guest-parents": "Vous habitez chez vos parents",
  "files": "Documents",
  "will-delete-files": "Please note, a change of situation will result in the deletion of your supporting documents. You will have to upload the supporting documents corresponding to your situation again."
},
"fr": {
  "tenant": "Vous êtes locataire",
  "owner": "Vous êtes propriétaire",
  "guest": "Vous êtes hébergé gratuitement",
  "guest-parents": "Vous habitez chez vos parents",
  "files": "Documents",
  "will-delete-files": "Attention, un changement de situation entraînera la suppression de vos justificatifs. Vous devrez charger de nouveau les justificatifs correspondant à votre situation."
}
}
</i18n>
