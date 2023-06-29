<template>
  <div>
    <ValidationObserver>
      <NakedCard class="fr-p-md-5w">
        <validation-provider rules="required" v-slot="{ errors, valid }">
          <div
            class="fr-input-group"
            :class="errors[0] ? 'fr-input-group--error' : ''"
          >
            <h1 class="fr-label fr-text--regular" for="firstName">
              {{ $t("representativeidentification.organism-name") }} :
            </h1>
            <input
              v-model="firstName"
              class="form-control fr-input validate-required"
              :class="{
                'fr-input--valid': valid,
                'fr-input--error': errors[0],
              }"
              id="firstName"
              name="firstName"
              :placeholder="
                $t('representativeidentification.organism-name-placeholder')
              "
              type="text"
              required
            />
            <span class="fr-error-text" v-if="errors[0]">{{
              $t(errors[0])
            }}</span>
          </div>
        </validation-provider>
      </NakedCard>
      <NakedCard class="fr-mt-3w fr-p-md-5w">
        <validation-provider
          rules="select"
          name="identificationDocument"
          v-slot="{ errors, valid }"
        >
          <div class="fr-select-group">
            <label class="fr-label" for="select">
              <b>
                J’ajoute une pièce d’identité en cours de validité. Attention,
                veillez à ajouter votre pièce recto-verso !
              </b>
            </label>
            <select
              v-model="identificationDocument"
              class="fr-select fr-mb-3w"
              :class="{
                'fr-select--valid': valid,
                'fr-select--error': errors[0],
              }"
              id="selectID"
              as="select"
            >
              <option v-for="d in documents" :value="d" :key="d.key">
                {{ $t(d.key) }}
              </option>
            </select>

            <span class="fr-error-text" v-if="errors[0]">
              {{ $t(errors[0]) }}
            </span>
          </div>
        </validation-provider>
        <div v-if="identificationDocument && identificationDocument.key">
          <TroubleshootingModal>
            <DocumentInsert
              :allow-list="identificationDocument.acceptedProofs"
              :block-list="identificationDocument.refusedProofs"
            ></DocumentInsert>
          </TroubleshootingModal>
          <AllDeclinedMessages
            class="fr-mb-3w"
            :documentDeniedReasons="documentDeniedReasons"
            :documentStatus="documentStatus"
          ></AllDeclinedMessages>
          <div class="fr-col-md-12 fr-mb-3w" v-if="listFiles().length > 0">
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
          <div class="fr-mb-3w">
            <FileUpload
              :current-status="fileUploadStatus"
              @add-files="addFiles"
              @reset-files="resetFiles"
            ></FileUpload>
          </div>
        </div>
      </NakedCard>
    </ValidationObserver>
    <GuarantorFooter @on-back="goBack" @on-next="goNext"></GuarantorFooter>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import DocumentInsert from "../share/DocumentInsert.vue";
import FileUpload from "../../uploads/FileUpload.vue";
import { DocumentType } from "df-shared/src/models/Document";
import { UploadStatus } from "df-shared/src/models/UploadStatus";
import ListItem from "../../uploads/ListItem.vue";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { DfDocument } from "df-shared/src/models/DfDocument";
import { DfFile } from "df-shared/src/models/DfFile";
import { RegisterService } from "../../../services/RegisterService";
import { Guarantor } from "df-shared/src/models/Guarantor";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import VGouvFrModal from "df-shared/src/GouvFr/v-gouv-fr-modal/VGouvFrModal.vue";
import AllDeclinedMessages from "../share/AllDeclinedMessages.vue";
import { DocumentDeniedReasons } from "df-shared/src/models/DocumentDeniedReasons";
import { cloneDeep } from "lodash";
import GuarantorFooter from "../../footer/GuarantorFooter.vue";
import { DocumentTypeConstants } from "../share/DocumentTypeConstants";
import TroubleshootingModal from "@/components/helps/TroubleshootingModal.vue";

@Component({
  components: {
    AllDeclinedMessages,
    DocumentInsert,
    FileUpload,
    ListItem,
    ValidationProvider,
    ValidationObserver,
    VGouvFrModal,
    NakedCard,
    GuarantorFooter,
    TroubleshootingModal,
  },
})
export default class RepresentativeIdentification extends Vue {
  @Prop() tenantId?: number;
  @Prop() guarantor?: Guarantor;

  MAX_FILE_COUNT = 5;

  identificationDocument = new DocumentType();
  documentDeniedReasons = new DocumentDeniedReasons();

  files: File[] = [];
  fileUploadStatus = UploadStatus.STATUS_INITIAL;
  uploadProgress: {
    [key: string]: { state: string; percentage: number };
  } = {};
  firstName = "";

  beforeMount() {
    this.firstName = this.getGuarantor().firstName || "";
    if (this.getGuarantor().documents !== null) {
      const doc = this.guarantorIdentificationDocument();
      if (doc !== undefined) {
        const localDoc = this.documents.find((d: DocumentType) => {
          return d.value === doc.subCategory;
        });
        if (localDoc !== undefined) {
          this.identificationDocument = localDoc;
        }
      }
    }
    if (this.guarantorIdentificationDocument()?.documentDeniedReasons) {
      this.documentDeniedReasons = cloneDeep(
        this.guarantorIdentificationDocument()!.documentDeniedReasons!
      );
    }
  }

  getGuarantor() {
    if (this.guarantor) {
      return this.guarantor;
    }
    return this.$store.getters.guarantor;
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
    if (!this.firstName) {
      return Promise.reject();
    }
    this.uploadProgress = {};
    const fieldName = "documents";
    const formData = new FormData();
    if (this.getGuarantor().id) {
      formData.append("guarantorId", this.getGuarantor().id);
    }
    if (this.tenantId) {
      formData.append("tenantId", this.tenantId.toString());
    }
    if (this.firstName) {
      formData.append("firstName", this.firstName);
    }

    if (!this.files.length) {
      const loader = this.$loading.show();
      return RegisterService.saveLegalPersonRepresentantName(formData)
        .then(() => {
          this.files = [];
          this.fileUploadStatus = UploadStatus.STATUS_INITIAL;
          this.$store.dispatch("loadUser");
          Vue.toasted.global.save_success();
          return Promise.resolve(true);
        })
        .catch((err: unknown) => {
          this.fileUploadStatus = UploadStatus.STATUS_FAILED;
          Vue.toasted.global.save_failed();
          return Promise.reject(err);
        })
        .finally(() => {
          loader.hide();
        });
    }

    if (this.listFiles().length > this.MAX_FILE_COUNT) {
      Vue.toasted.global.max_file({
        message: this.$i18n.t("max-file", [
          this.listFiles().length,
          this.MAX_FILE_COUNT,
        ]),
      });
      return Promise.reject();
    }
    Array.from(Array(this.files.length).keys()).forEach((x) => {
      formData.append(`${fieldName}[${x}]`, this.files[x], this.files[x].name);
    });

    formData.append(
      "typeDocumentIdentification",
      this.identificationDocument.value
    );

    this.fileUploadStatus = UploadStatus.STATUS_SAVING;
    const loader = this.$loading.show();
    return RegisterService.saveRepresentativeIdentification(formData)
      .then(() => {
        this.fileUploadStatus = UploadStatus.STATUS_INITIAL;
        this.$store.dispatch("loadUser");
        Vue.toasted.global.save_success();
        return Promise.resolve(true);
      })
      .catch(() => {
        this.fileUploadStatus = UploadStatus.STATUS_FAILED;
        Vue.toasted.global.save_failed();
        return Promise.reject();
      })
      .finally(() => {
        loader.hide();
      });
  }

  goBack() {
    this.$emit("on-back");
  }

  goNext() {
    this.save().then(() => {
      this.$emit("on-next");
    });
  }

  resetFiles() {
    this.fileUploadStatus = UploadStatus.STATUS_INITIAL;
  }

  remove(file: DfFile) {
    if (file.id) {
      RegisterService.deleteFile(file.id);
    } else {
      const firstIndex = this.files.findIndex((f) => {
        return f.name === file.name && f.size === file.size;
      });
      this.files.splice(firstIndex, 1);
    }
  }
  listFiles() {
    const existingFiles = this.guarantorIdentificationDocument()?.files || [];
    return existingFiles;
  }

  documents = DocumentTypeConstants.REPRESENTATIVE_IDENTIFICATION;
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
