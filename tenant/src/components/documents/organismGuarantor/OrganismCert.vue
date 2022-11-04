<template>
  <div>
    <NakedCard class="fr-p-md-5w">
      <div>
        <h1 class="fr-h6">
          {{ $t("organism-label") }}
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
              <DocumentInsert
                :allow-list="acceptedProofs"
                :block-list="refusedProofs"
              ></DocumentInsert>
            </p>
          </template>
        </v-gouv-fr-modal>
        <AllDeclinedMessages
          class="fr-mb-3w"
          :documentDeniedReasons="documentDeniedReasons"
          :documentStatus="documentStatus"
        ></AllDeclinedMessages>
        <div class="fr-col-md-12 fr-mb-3w">
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
        <div class="fr-mt-3w fr-mb-3w">
          <FileUpload
            :current-status="fileUploadStatus"
            @add-files="addFiles"
            @reset-files="resetFiles"
          ></FileUpload>
        </div>
      </div>
    </NakedCard>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { mapState } from "vuex";
import DocumentInsert from "../share/DocumentInsert.vue";
import FileUpload from "../../uploads/FileUpload.vue";
import { DocumentType } from "df-shared/src/models/Document";
import { UploadStatus } from "df-shared/src/models/UploadStatus";
import ListItem from "../../uploads/ListItem.vue";
import { DfDocument } from "df-shared/src/models/DfDocument";
import { DfFile } from "df-shared/src/models/DfFile";
import { RegisterService } from "../../../services/RegisterService";
import VGouvFrModal from "df-shared/src/GouvFr/v-gouv-fr-modal/VGouvFrModal.vue";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import AllDeclinedMessages from "../share/AllDeclinedMessages.vue";
import { DocumentDeniedReasons } from "df-shared/src/models/DocumentDeniedReasons";
import { cloneDeep } from "lodash";
import { Guarantor } from "df-shared/src/models/Guarantor";

@Component({
  components: {
    AllDeclinedMessages,
    DocumentInsert,
    FileUpload,
    ListItem,
    VGouvFrModal,
    NakedCard
  }
})
export default class OrganismCert extends Vue {
  @Prop() tenantId?: number;
  @Prop() guarantor?: Guarantor;

  MAX_FILE_COUNT = 5;
  acceptedProofs = ["Certificat de garantie valide d'un organisme"];
  refusedProofs = ["Tout autre document"];

  documentDeniedReasons = new DocumentDeniedReasons();
  identificationDocument = new DocumentType();

  files: File[] = [];
  fileUploadStatus = UploadStatus.STATUS_INITIAL;
  uploadProgress: {
    [key: string]: { state: string; percentage: number };
  } = {};

  beforeMount() {
    if (this.guarantorIdentificationDocument()?.documentDeniedReasons) {
      this.documentDeniedReasons = cloneDeep(
        this.guarantorIdentificationDocument()!.documentDeniedReasons!
      );
    }
  }

  guarantorId() {
    if (this.guarantor) {
      return this.guarantor.id;
    }
    return this.$store.getters.guarantor.id;
  }
  get documentStatus() {
    return this.guarantorIdentificationDocument()?.documentStatus;
  }

  guarantorIdentificationDocument(): DfDocument {
    if (this.guarantor) {
      return this.guarantor.documents?.find((d: DfDocument) => {
        return d.documentCategory === "IDENTIFICATION";
      }) as DfDocument;
    }
    return this.$store.getters.getGuarantorIdentificationDocument;
  }

  addFiles(fileList: File[]) {
    this.files = [...this.files, ...fileList];
    this.save();
  }

  save() {
    this.uploadProgress = {};
    const fieldName = "documents";
    const formData = new FormData();
    if (!this.files.length) return;

    if (this.listFiles().length > this.MAX_FILE_COUNT) {
      Vue.toasted.global.max_file({
        message: this.$i18n.t("max-file", [
          this.listFiles().length,
          this.MAX_FILE_COUNT
        ])
      });
      return;
    }

    Array.from(Array(this.files.length).keys()).map(x => {
      formData.append(`${fieldName}[${x}]`, this.files[x], this.files[x].name);
    });

    formData.append("noDocument", "false");

    if (this.guarantorId()) {
      formData.append("guarantorId", this.guarantorId());
    }
    if (this.tenantId) {
      formData.append("tenantId", this.tenantId.toString());
    }

    this.fileUploadStatus = UploadStatus.STATUS_SAVING;
    const loader = this.$loading.show();
    RegisterService.saveOrganismIdentification(formData)
      .then(() => {
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
      this.guarantorIdentificationDocument().files = this.guarantorIdentificationDocument()?.files?.filter(
        f => file.id != f.id
      );
    } else {
      const firstIndex = this.files.findIndex(f => {
        return f.name === file.name && f.size === file.size;
      });
      this.files.splice(firstIndex, 1);
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
    const existingFiles = this.guarantorIdentificationDocument()?.files || [];
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
