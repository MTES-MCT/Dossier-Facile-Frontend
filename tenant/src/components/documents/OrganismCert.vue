<template>
  <div>
    <div>
      <div class="rf-mb-3w">
        {{ $t("organism-label") }}
      </div>
      <div class="rf-mb-3w">
        <FileUpload
          :current-status="fileUploadStatus"
          @add-files="addFiles"
          @reset-files="resetFiles"
        ></FileUpload>
      </div>
      <div class="rf-mb-3w">
        <DocumentInsert
          :allow-list="acceptedProofs"
          :block-list="refusedProofs"
        ></DocumentInsert>
      </div>
    </div>
    <div>
      <ListItem
        v-for="file in files"
        :key="file.name"
        :filename="file.name"
        :uploadState="
          uploadProgress[file.name] ? uploadProgress[file.name].state : 'idle'
        "
        :percentage="
          uploadProgress[file.name] ? uploadProgress[file.name].percentage : 0
        "
        @remove="remove(file.id)"
      />
    </div>
    <div class="rf-col-12 rf-mb-5w" v-if="identificationDocument">
      <button
        class="rf-btn"
        type="submit"
        @click="save"
        :disabled="files.length <= 0"
      >
        Enregistrer la pièce
      </button>
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
import axios from "axios";
import ListItem from "@/components/uploads/ListItem.vue";

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
    Array.from(Array(this.files.length).keys()).map(x => {
      formData.append(`${fieldName}[${x}]`, this.files[x], this.files[x].name);
    });

    formData.append(
      "typeDocumentIdentification",
      this.identificationDocument.value
    );

    this.fileUploadStatus = UploadStatus.STATUS_SAVING;
    const url = `//${process.env.VUE_APP_API_URL}/api/register/guarantorOrganism/documentIdentification`;
    const loader = this.$loading.show();
    axios
      .post(url, formData)
      .then(() => {
        console.log("success");
        this.files = [];
        this.fileUploadStatus = UploadStatus.STATUS_INITIAL;
      })
      .catch(() => {
        console.log("fail");
        this.fileUploadStatus = UploadStatus.STATUS_FAILED;
      })
      .finally(() => {
        this.$store.dispatch("loadUser");
        loader.hide();
      });
  }

  resetFiles() {
    this.fileUploadStatus = UploadStatus.STATUS_INITIAL;
  }

  remove(id: number) {
    const loader = this.$loading.show();
    const url = `//${process.env.VUE_APP_API_URL}/api/file/${id}`;
    axios.delete(url).finally(() => {
      this.$store.dispatch("loadUser");
      loader.hide();
    });
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
