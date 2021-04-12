<template>
  <div>
    <div>
      <div class="fr-mb-3w">
        {{ $t("organism-label") }}
      </div>
      <div class="fr-mb-3w">
        <FileUpload
          :current-status="fileUploadStatus"
          @add-files="addFiles"
          @reset-files="resetFiles"
        ></FileUpload>
      </div>
    </div>
    <div class="fr-col-lg-8 fr-col-md-12 fr-mb-3w">
      <ListItem
        v-for="(file, k) in listFiles()"
        :key="k"
        :file="file"
        @remove="remove(file)"
        :uploadState="
          uploadProgress[file.id] ? uploadProgress[file.id].state : 'idle'
        "
        :percentage="
          uploadProgress[file.id] ? uploadProgress[file.id].percentage : 0
        "
      />
    </div>
    <div class="fr-col-12 fr-mb-2w" v-if="identificationDocument">
      <button
        class="fr-btn"
        type="submit"
        @click="save"
        :disabled="files.length <= 0"
      >
        Enregistrer la pièce
      </button>
    </div>
    <div class="fr-mb-5w">
      <DocumentInsert
        :allow-list="acceptedProofs"
        :block-list="refusedProofs"
      ></DocumentInsert>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapState } from "vuex";
import DocumentInsert from "@/components/documents/DocumentInsert.vue";
import FileUpload from "@/components/uploads/FileUpload.vue";
import { DocumentType } from "df-shared/src/models/Document";
import { UploadStatus } from "../uploads/UploadStatus";
import ListItem from "@/components/uploads/ListItem.vue";
import { DfDocument } from "df-shared/src/models/DfDocument";
import { DfFile } from "df-shared/src/models/DfFile";
import { RegisterService } from "../../services/RegisterService";

@Component({
  components: {
    DocumentInsert,
    FileUpload,
    ListItem
  },
  computed: {
    ...mapState({
      user: "user"
    })
  }
})
export default class OrganismCert extends Vue {
  MAX_FILE_COUNT = 3;
  acceptedProofs = ["Certificat de garantie valide d'un organisme"];
  refusedProofs = ["Tout autre document"];

  identificationDocument = new DocumentType();

  files: File[] = [];
  fileUploadStatus = UploadStatus.STATUS_INITIAL;
  uploadProgress: {
    [key: string]: { state: string; percentage: number };
  } = {};

  addFiles(fileList: File[]) {
    this.files = [...this.files, ...fileList];
  }

  save() {
    this.uploadProgress = {};
    const fieldName = "documents";
    const formData = new FormData();
    if (!this.files.length) return;

    if (this.listFiles().length > this.MAX_FILE_COUNT) {
      Vue.toasted.global.max_file();
      return;
    }

    Array.from(Array(this.files.length).keys()).map(x => {
      formData.append(`${fieldName}[${x}]`, this.files[x], this.files[x].name);
    });
    if (this.$store.getters.guarantor.id) {
      formData.append("guarantorId", this.$store.getters.guarantor.id);
    }

    formData.append("noDocument", "false");

    this.fileUploadStatus = UploadStatus.STATUS_SAVING;
    const loader = this.$loading.show();
    RegisterService.saveOrganismIdentification(formData)
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

  resetFiles() {
    this.fileUploadStatus = UploadStatus.STATUS_INITIAL;
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

  listFiles() {
    const newFiles = this.files.map(f => {
      return {
        documentSubCategory: this.identificationDocument.value,
        id: f.name,
        name: f.name,
        size: f.size
      };
    });
    const existingFiles =
      this.$store.getters.getDocuments?.find((d: DfDocument) => {
        return d.documentCategory === "IDENTIFICATION";
      })?.files || [];
    return [...newFiles, ...existingFiles];
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
  "organism-label": "J'ajoute un certificat ou un visa délivré par l'organisme qui se porte garant pour moi."
},
"fr": {
  "organism-label": "J'ajoute un certificat ou un visa délivré par l'organisme qui se porte garant pour moi."
}
}
</i18n>
