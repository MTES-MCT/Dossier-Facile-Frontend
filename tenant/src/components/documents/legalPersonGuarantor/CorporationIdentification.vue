<template>
  <div>
    <ValidationObserver>
      <NakedCard class="fr-p-md-5w">
        <validation-provider rules="required" v-slot="{ errors, valid }">
          <div
            class="fr-input-group"
            :class="errors[0] ? 'fr-input-group--error' : ''"
          >
            <label class="fr-label" for="organismName"
              >{{ $t("corporationidentification.organism-name") }} :</label
            >
            <input
              v-model="organismName"
              class="form-control fr-input validate-required"
              :class="{
                'fr-input--valid': valid,
                'fr-input--error': errors[0],
              }"
              id="organismName"
              name="organismName"
              :placeholder="
                $t('corporationidentification.organism-name-placeholder')
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
        <div>
          <h1 class="fr-label">
            {{ $t("corporationidentification.kbis-label") }}
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
    </ValidationObserver>
    <GuarantorFooter @on-back="goBack" @on-next="goNext"></GuarantorFooter>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import DocumentInsert from "../share/DocumentInsert.vue";
import FileUpload from "../../uploads/FileUpload.vue";
import { UploadStatus } from "df-shared/src/models/UploadStatus";
import ListItem from "../../uploads/ListItem.vue";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { DfDocument } from "df-shared/src/models/DfDocument";
import { DfFile } from "df-shared/src/models/DfFile";
import { RegisterService } from "../../../services/RegisterService";
import { Guarantor } from "df-shared/src/models/Guarantor";
import VGouvFrModal from "df-shared/src/GouvFr/v-gouv-fr-modal/VGouvFrModal.vue";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import AllDeclinedMessages from "../share/AllDeclinedMessages.vue";
import { DocumentDeniedReasons } from "df-shared/src/models/DocumentDeniedReasons";
import { cloneDeep } from "lodash";
import GuarantorFooter from "../../footer/GuarantorFooter.vue";
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
export default class CorporationIdentification extends Vue {
  @Prop() tenantId?: number;
  @Prop() guarantor?: Guarantor;

  organismName = "";
  acceptedProofs = [
    this.$i18n.t("corporationidentification.kbis"),
    this.$i18n.t("corporationidentification.status"),
    this.$i18n.t("corporationidentification.all-accepted"),
  ];
  refusedProofs = [
    this.$i18n.t("corporationidentification.balance-sheet"),
    this.$i18n.t("corporationidentification.urssaf"),
    this.$i18n.t("corporationidentification.all-other"),
  ];

  documentDeniedReasons = new DocumentDeniedReasons();

  files: DfFile[] = [];
  fileUploadStatus = UploadStatus.STATUS_INITIAL;
  uploadProgress: {
    [key: string]: { state: string; percentage: number };
  } = {};

  beforeMount() {
    this.organismName = this.getGuarantor().legalPersonName || "";
    if (
      this.guarantorIdentificationLegalPersonDocument()?.documentDeniedReasons
    ) {
      this.documentDeniedReasons = cloneDeep(
        this.guarantorIdentificationLegalPersonDocument()!
          .documentDeniedReasons!
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
    return this.guarantorIdentificationLegalPersonDocument()?.documentStatus;
  }

  guarantorIdentificationLegalPersonDocument(): DfDocument {
    if (this.guarantor) {
      return this.guarantor.documents?.find((d: DfDocument) => {
        return d.documentCategory === "IDENTIFICATION_LEGAL_PERSON";
      }) as DfDocument;
    }
    return this.$store.getters.getGuarantorIdentificationLegalPersonDocument;
  }
  addFiles(fileList: File[]) {
    const nf = Array.from(fileList).map((f) => {
      return { name: f.name, file: f, size: f.size };
    });
    this.files = [...this.files, ...nf];
    this.save();
  }

  save() {
    if (!this.organismName) {
      return Promise.resolve(true);
    }
    this.uploadProgress = {};
    const fieldName = "documents";
    const formData = new FormData();
    formData.append("legalPersonName", this.organismName);

    if (this.getGuarantor().id) {
      formData.append("guarantorId", this.getGuarantor().id);
    }
    if (this.tenantId) {
      formData.append("tenantId", this.tenantId.toString());
    }

    const loader = this.$loading.show();
    if (!this.files.length) {
      return RegisterService.saveCorporationName(formData)
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

    Array.from(Array(this.files.length).keys()).map((x) => {
      const f: File = this.files[x].file || new File([], "");
      formData.append(`${fieldName}[${x}]`, f, this.files[x].name);
    });

    this.fileUploadStatus = UploadStatus.STATUS_SAVING;
    return RegisterService.saveCorporationIdentification(formData)
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

  resetFiles() {
    this.fileUploadStatus = UploadStatus.STATUS_INITIAL;
  }

  remove(file: DfFile) {
    if (file.id) {
      RegisterService.deleteFile(file.id);
      this.guarantorIdentificationLegalPersonDocument().files =
        this.guarantorIdentificationLegalPersonDocument()?.files?.filter(
          (f) => file.id != f.id
        );
    } else {
      const firstIndex = this.files.findIndex((f) => {
        return f.name === file.name && f.size === file.size;
      });
      this.files.splice(firstIndex, 1);
    }
  }

  listFiles() {
    const newFiles = this.files.map((f) => {
      return {
        id: f.id,
        name: f.name,
        file: f.file,
        size: f.file?.size,
      };
    });
    const existingFiles =
      this.guarantorIdentificationLegalPersonDocument()?.files || [];
    return [...newFiles, ...existingFiles];
  }

  goBack() {
    this.$emit("on-back");
  }

  goNext() {
    this.save().then(() => {
      this.$emit("on-next");
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
