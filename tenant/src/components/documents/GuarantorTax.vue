<template>
  <div>
    <ConfirmModal
      v-if="isDocDeleteVisible"
      @valid="validSelect()"
      @cancel="undoSelect()"
    >
      <span>{{ $t("will-delete-files") }}</span>
    </ConfirmModal>
    <ValidationObserver v-slot="{ validate }">
      <NakedCard class="fr-p-md-5w">
        <h5>{{ $t("title") }}</h5>
        <v-gouv-fr-modal>
          <template v-slot:button>
            En difficulté pour répondre à la question ?
          </template>
          <template v-slot:title>
            En difficulté pour répondre à la question ?
          </template>
          <template v-slot:content>
            <p>
              <TaxHelp></TaxHelp>
              <DocumentInsert
                :allow-list="taxDocument.acceptedProofs"
                :block-list="taxDocument.refusedProofs"
                v-if="taxDocument.key && taxDocument.acceptedProofs.length > 0"
              ></DocumentInsert>
            </p>
          </template>
        </v-gouv-fr-modal>

        <div class="fr-mt-4w">{{ $t("situation") }}</div>

        <form name="form" @submit.prevent="validate().then(save)">
          <div class="fr-mt-3w">
            <fieldset class="fr-fieldset">
              <div class="fr-fieldset__content">
                <div class="fr-grid-row">
                  <div v-for="d in documents" :key="d.key">
                    <BigRadio
                      :val="d"
                      v-model="taxDocument"
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
          <div
            class="fr-mb-3w"
            v-if="taxDocument.key && taxDocument.key === 'other-tax'"
          >
            <div class="fr-input-group">
              <label class="fr-label" for="customText">{{
                $t("custom-text")
              }}</label>
              <input
                v-model="customText"
                class="form-control fr-input validate-required"
                id="customText"
                name="customText"
                placeholder=""
                type="text"
                required
              />
            </div>
          </div>
          <div class="fr-col-12 fr-mt-3w" v-if="taxDocument.key === 'my-name'">
            <validation-provider
              rules="is"
              v-slot="{ errors }"
              class="fr-col-10"
            >
              <div
                class="fr-checkbox-group bg-purple"
                :class="errors[0] ? 'fr-input-group--error' : ''"
              >
                <input
                  type="checkbox"
                  id="acceptVerification"
                  value="false"
                  v-model="acceptVerification"
                />
                <label for="acceptVerification">{{
                  $t("accept-verification")
                }}</label>
                <span class="fr-error-text" v-if="errors[0]">{{
                  $t(errors[0])
                }}</span>
              </div>
            </validation-provider>
          </div>
        </form>
      </NakedCard>
      <NakedCard
        class="fr-mt-3w"
        v-if="
          (acceptVerification && taxDocument.key === 'my-name') ||
            taxFiles().length > 0
        "
      >
        <div v-if="taxDocument.key === 'my-name' && acceptVerification">
          <div class="fr-mb-3w">
            <p v-html="taxDocument.explanationText"></p>
          </div>
          <div class="fr-mb-3w">
            <FileUpload
              :current-status="fileUploadStatus"
              @add-files="addFiles"
              @reset-files="resetFiles"
            ></FileUpload>
          </div>
        </div>
        <div v-if="taxFiles().length > 0" class="fr-col-md-12 fr-mb-3w">
          <ListItem
            v-for="(file, k) in taxFiles()"
            :key="k"
            :file="file"
            @remove="remove(file)"
          />
        </div>
      </NakedCard>
    </ValidationObserver>
    <GuarantorFooter @on-back="goBack" @on-next="goNext"></GuarantorFooter>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { DocumentType } from "df-shared/src/models/Document";
import DocumentInsert from "@/components/documents/DocumentInsert.vue";
import FileUpload from "@/components/uploads/FileUpload.vue";
import { mapState } from "vuex";
import { UploadStatus } from "df-shared/src/models/UploadStatus";
import ListItem from "@/components/uploads/ListItem.vue";
import { DfFile } from "df-shared/src/models/DfFile";
import { DfDocument } from "df-shared/src/models/DfDocument";
import { Guarantor } from "df-shared/src/models/Guarantor";
import { extend } from "vee-validate";
import { is } from "vee-validate/dist/rules";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { RegisterService } from "../../services/RegisterService";
import WarningMessage from "df-shared/src/components/WarningMessage.vue";
import { DocumentTypeConstants } from "./DocumentTypeConstants";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";
import BigRadio from "df-shared/src/Button/BigRadio.vue";
import VGouvFrModal from "df-shared/src/GouvFr/v-gouv-fr-modal/VGouvFrModal.vue";
import TaxHelp from "../helps/TaxHelp.vue";
import GuarantorFooter from "@/components/footer/GuarantorFooter.vue";
import NakedCard from "df-shared/src/components/NakedCard.vue";

extend("is", {
  ...is,
  message: "field-required",
  validate: value => !!value
});

@Component({
  components: {
    DocumentInsert,
    FileUpload,
    ListItem,
    ValidationObserver,
    ValidationProvider,
    WarningMessage,
    ConfirmModal,
    BigRadio,
    VGouvFrModal,
    TaxHelp,
    GuarantorFooter,
    NakedCard
  },
  computed: {
    ...mapState({
      selectedGuarantor: "selectedGuarantor"
    })
  }
})
export default class Tax extends Vue {
  selectedGuarantor!: Guarantor;
  fileUploadStatus = UploadStatus.STATUS_INITIAL;
  files: DfFile[] = [];
  uploadProgress: {
    [key: string]: { state: string; percentage: number };
  } = {};
  taxDocument = new DocumentType();

  acceptVerification = false;
  customText = "";

  documents = DocumentTypeConstants.GUARANTOR_TAX_DOCS;
  isDocDeleteVisible = false;

  getRegisteredDoc() {
    if (this.selectedGuarantor.documents !== null) {
      const doc = this.selectedGuarantor.documents?.find((d: DfDocument) => {
        return d.documentCategory === "TAX";
      });
      return doc;
    }
    return undefined;
  }

  getLocalDoc() {
    const doc = this.getRegisteredDoc();
    if (doc !== undefined) {
      const localDoc = this.documents.find((d: DocumentType) => {
        return d.value === doc.documentSubCategory;
      });
      return localDoc;
    }
    return undefined;
  }

  onSelectChange() {
    if (this.selectedGuarantor.documents !== null) {
      const doc = this.selectedGuarantor.documents?.find((d: DfDocument) => {
        return d.documentCategory === "TAX";
      });
      if (doc !== undefined) {
        this.isDocDeleteVisible =
          (doc.files?.length || 0) > 0 &&
          doc.documentSubCategory !== this.taxDocument.value;
      }
    }
    return false;
  }

  undoSelect() {
    if (this.selectedGuarantor.documents !== null) {
      const doc = this.selectedGuarantor.documents?.find((d: DfDocument) => {
        return d.documentCategory === "TAX";
      });
      if (doc !== undefined) {
        const localDoc = this.documents.find((d: DocumentType) => {
          return d.value === doc.documentSubCategory;
        });
        if (localDoc !== undefined) {
          this.taxDocument = localDoc;
        }
      }
    }
    this.isDocDeleteVisible = false;
  }

  async validSelect() {
    this.isDocDeleteVisible = false;
    if (this.selectedGuarantor.documents !== null) {
      const doc = this.selectedGuarantor.documents?.find((d: DfDocument) => {
        return d.documentCategory === "TAX";
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

  updateGuarantorData() {
    const doc = this.getRegisteredDoc();
    if (doc !== undefined) {
      this.customText = doc.customText || "";
    }
    const localDoc = this.getLocalDoc();
    if (localDoc !== undefined) {
      this.taxDocument = localDoc;
    }
    if (this.taxDocument.key === "my-name" && this.taxFiles().length > 0) {
      this.acceptVerification = true;
    }
  }

  mounted() {
    this.updateGuarantorData();
  }

  @Watch("selectedGuarantor")
  onGuarantorChange() {
    this.updateGuarantorData();
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

  async save() {
    if (!this.taxDocument.key) {
      return true;
    }
    if (this.taxDocument.key === "my-name" && !this.acceptVerification) {
      return false;
    }
    this.uploadProgress = {};
    const fieldName = "documents";
    const formData = new FormData();
    const newFiles = this.files.filter(f => {
      return !f.id;
    });
    if (newFiles.length) {
      if (
        this.taxDocument.maxFileCount &&
        this.taxFiles().length > this.taxDocument.maxFileCount
      ) {
        Vue.toasted.global.max_file({
          message: this.$i18n.t("max-file", [
            this.taxFiles().length,
            this.taxDocument.maxFileCount
          ])
        });
        return false;
      }

      Array.from(Array(newFiles.length).keys()).map(x => {
        const f: File = newFiles[x].file || new File([], "");
        formData.append(`${fieldName}[${x}]`, f, newFiles[x].name);
      });
    }
    if (this.taxDocument.key === "my-name") {
      formData.append(
        "acceptVerification",
        this.acceptVerification ? "true" : "false"
      );
      formData.append("noDocument", "false");
    } else {
      formData.append("noDocument", "true");
    }

    formData.append("typeDocumentTax", this.taxDocument.value);

    if (this.taxDocument.key === "other-tax") {
      if (!this.customText) {
        // TODO : would be better to validate form
        return false;
      }
      formData.append("customText", this.customText);
    }

    this.fileUploadStatus = UploadStatus.STATUS_SAVING;
    formData.append("guarantorId", this.$store.getters.guarantor.id);
    const loader = this.$loading.show();
    await this.$store
      .dispatch("saveGuarantorTax", formData)
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
    return true;
  }

  taxFiles() {
    const newFiles = this.files.map(f => {
      return {
        documentSubCategory: this.taxDocument.value,
        id: f.name,
        name: f.name,
        file: f,
        size: f.size
      };
    });
    const existingFiles =
      this.$store.getters.getGuarantorDocuments?.find((d: DfDocument) => {
        return d.documentCategory === "TAX";
      })?.files || [];
    return [...newFiles, ...existingFiles];
  }

  isButtonDisabled() {
    if (!this.taxDocument.key) {
      return true;
    }
    if (this.taxDocument.key === "my-name") {
      return this.files.length <= 0;
    }
    const localDoc = this.getLocalDoc();
    if (localDoc && localDoc.key === this.taxDocument.key) {
      return true;
    }
    return false;
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

  async goNext() {
    const res = await this.save();
    if (res) {
      this.$emit("on-next");
    }
  }

  goBack() {
    this.$emit("on-back");
  }
}
</script>

<style scoped lang="scss">
.spa {
  min-height: 2rem;
  width: 14rem;
}
</style>

<i18n>
{
  "en": {
    "my-name": "J’ai un avis d’imposition au nom de mon garant",
    "less-than-year": "Vous êtes en France depuis moins d’un an",
    "other-tax": "Autre",
    "accept-verification": "J'accepte que DossierFacile procède à une vérification automatisée de ma fiche d'imposition auprès des services des impôts",
    "custom-text": "Afin d'améliorer votre dossier, veuillez expliquer ci-dessous pourquoi vous ne recevez pas d'avis d'imposition. Votre explication sera ajoutée à votre dossier :",
    "files": "Documents",
    "register": "Register",
    "field-required": "This field is required",
    "will-delete-files": "Please note, a change of situation will result in the deletion of your supporting documents. You will have to upload the supporting documents corresponding to your situation again.",
    "title": "My guarantor tax file",
    "situation": "What is her/his tax situation?"
  },
  "fr": {
    "my-name": "J’ai un avis d’imposition au nom de mon garant",
    "less-than-year": "Mon garant est en France depuis moins d'un an",
    "other-tax": "Autre",
    "accept-verification": "J'accepte que DossierFacile procède à une vérification automatisée de ma fiche d'imposition auprès des services des impôts",
    "custom-text": "Afin d'améliorer votre dossier, veuillez expliquer ci-dessous pourquoi vous ne recevez pas d'avis d'imposition. Votre explication sera ajoutée à votre dossier :",
    "files": "Documents",
    "register": "Enregistrer",
    "field-required": "Ce champ est requis",
    "will-delete-files": "Attention, un changement de situation entraînera la suppression de vos justificatifs. Vous devrez charger de nouveau les justificatifs correspondant à votre situation.",
    "title": "L'avis d'imposition de mon garant",
    "situation": "Quelle est sa situation fiscale ?"
  }
}
</i18n>
