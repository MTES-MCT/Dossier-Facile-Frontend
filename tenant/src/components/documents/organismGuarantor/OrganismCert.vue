<template>
  <div>
    <NakedCard class="fr-p-md-5w">
      <div>
        <h1 class="fr-h6">
          {{ getTitle() }}
        </h1>
        <TroubleshootingModal>
          <DocumentInsert
            :allow-list="acceptedProofs"
            :block-list="refusedProofs"
          ></DocumentInsert>
        </TroubleshootingModal>
        <AllDeclinedMessages
          class="fr-mb-3w"
          :documentDeniedReasons="documentDeniedReasons"
          :documentStatus="documentStatus"
        ></AllDeclinedMessages>
        <div class="fr-col-md-12 fr-mb-3w fr-mt-3w">
          <ListItem
            v-for="(file, k) in files"
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
import DocumentInsert from "../share/DocumentInsert.vue";
import FileUpload from "../../uploads/FileUpload.vue";
import { UploadStatus } from "df-shared/src/models/UploadStatus";
import ListItem from "../../uploads/ListItem.vue";
import { DfDocument } from "df-shared/src/models/DfDocument";
import { DfFile } from "df-shared/src/models/DfFile";
import { RegisterService } from "../../../services/RegisterService";
import VGouvFrModal from "df-shared/src/GouvFr/v-gouv-fr-modal/VGouvFrModal.vue";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import AllDeclinedMessages from "../share/AllDeclinedMessages.vue";
import { DocumentDeniedReasons } from "df-shared/src/models/DocumentDeniedReasons";
import { Guarantor } from "df-shared/src/models/Guarantor";
import TroubleshootingModal from "@/components/helps/TroubleshootingModal.vue";

@Component({
  components: {
    AllDeclinedMessages,
    DocumentInsert,
    FileUpload,
    ListItem,
    VGouvFrModal,
    NakedCard,
    TroubleshootingModal,
  },
})
export default class OrganismCert extends Vue {
  @Prop() tenantId?: number;
  @Prop() isCotenant?: boolean;
  @Prop() guarantor?: Guarantor;

  MAX_FILE_COUNT = 5;
  acceptedProofs = ["Certificat de garantie valide d'un organisme"];
  refusedProofs = ["Tout autre document"];

  documentDeniedReasons?: DocumentDeniedReasons;

  files: DfFile[] = [];
  fileUploadStatus = UploadStatus.STATUS_INITIAL;
  uploadProgress: {
    [key: string]: { state: string; percentage: number };
  } = {};

  mounted() {
    this.loadDocument();
  }

  getTitle() {
    const userType = this.isCotenant ? "cotenant" : "tenant";
    return this.$t(`explanation-text.${userType}.organism-guarantor`);
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

  addFiles(newFiles: File[]) {
    if (this.files.length >= this.MAX_FILE_COUNT) {
      this.displayTooManyFilesToast();
      return;
    }
    this.save(newFiles);
  }

  save(files: File[]) {
    this.uploadProgress = {};
    const fieldName = "documents";
    const formData = new FormData();
    if (!files.length) return;

    Array.from(Array(files.length).keys()).forEach((x) => {
      formData.append(`${fieldName}[${x}]`, files[x], files[x].name);
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
      .then(async (response: any) => {
        this.fileUploadStatus = UploadStatus.STATUS_INITIAL;
        Vue.toasted.global.save_success();
        await this.$store.commit("loadUser", response.data);
        this.loadDocument();
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
    if (file.id) {
      RegisterService.deleteFile(file.id);
    }
    const firstIndex = this.files.findIndex((f) => f.id === file.id);
    this.files.splice(firstIndex, 1);
    this.documentDeniedReasons = undefined;
  }

  private loadDocument() {
    // This is a needed workaround for now, since we can't identify the currently
    // edited guarantor (and thus the corresponding document) from state
    const document = this.guarantorIdentificationDocument();
    this.documentDeniedReasons = document?.documentDeniedReasons;
    this.files = document?.files || [];
  }

  private displayTooManyFilesToast() {
    Vue.toasted.global.max_file({
      message: this.$i18n.t("max-file", [
        this.files.length,
        this.MAX_FILE_COUNT,
      ]),
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
