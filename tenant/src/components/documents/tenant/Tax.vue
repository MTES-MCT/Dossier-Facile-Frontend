<template>
  <div class="fr-mb-5w">
    <ValidationObserver v-slot="{ validate }">
      <NakedCard class="fr-p-md-5w">
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
              <TaxHelp></TaxHelp>
              <DocumentInsert
                :allow-list="taxDocument.acceptedProofs"
                :block-list="taxDocument.refusedProofs"
                v-if="taxDocument.key && taxDocument.acceptedProofs.length > 0"
              ></DocumentInsert>
            </p>
          </template>
        </v-gouv-fr-modal>

        <form name="form" @submit.prevent="validate().then(save)">
          <div class="fr-mt-3w">
            <fieldset class="fr-fieldset">
              <div class="fr-fieldset__content">
                <div class="fr-grid-row">
                  <div
                    v-for="d in documents"
                    :key="d.key"
                    class="full-width-xs"
                  >
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
          <div
            class="fr-col-12 fr-mt-3w"
            v-if="taxDocument.key && taxDocument.key === 'my-name'"
          >
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
      <div
        v-if="
          acceptVerification &&
            taxDocument.key === 'my-name' &&
            user.id % 10 === 0
        "
        class="fr-grid-row blue-franceconnect fr-mt-3w"
      >
        <MonFranceConnect></MonFranceConnect>
      </div>
      <NakedCard
        class="fr-p-md-5w fr-mt-3w"
        v-if="
          (acceptVerification && taxDocument.key === 'my-name') ||
            taxFiles().length > 0
        "
      >
        <div
          class="fr-mb-3w fr-mt-3w"
          v-if="taxDocument.key === 'my-name' && acceptVerification"
        >
          <div v-html="taxDocument.explanationText"></div>
        </div>
        <AllDeclinedMessages
          class="fr-mb-3w"
          :documentDeniedReasons="documentDeniedReasons"
          :documentStatus="documentStatus"
        ></AllDeclinedMessages>
        <div v-if="taxFiles().length > 0" class="fr-col-12 fr-mb-3w">
          <ListItem
            v-for="(file, k) in taxFiles()"
            :key="k"
            :file="file"
            @remove="remove(file)"
          />
        </div>
        <div v-if="taxDocument.key === 'my-name' && acceptVerification">
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
    <ProfileFooter @on-back="goBack" @on-next="goNext"></ProfileFooter>
    <ConfirmModal
      v-if="isDocDeleteVisible"
      @valid="validSelect()"
      @cancel="undoSelect()"
    >
      <span>{{ $t("will-delete-files") }}</span>
    </ConfirmModal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { DocumentType } from "df-shared/src/models/Document";
import DocumentInsert from "../share/DocumentInsert.vue";
import FileUpload from "../../uploads/FileUpload.vue";
import { mapGetters } from "vuex";
import { UploadStatus } from "df-shared/src/models/UploadStatus";
import ListItem from "../../uploads/ListItem.vue";
import { User } from "df-shared/src/models/User";
import { DfFile } from "df-shared/src/models/DfFile";
import { DfDocument } from "df-shared/src/models/DfDocument";
import { extend } from "vee-validate";
import { is } from "vee-validate/dist/rules";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { RegisterService } from "../../../services/RegisterService";
import WarningMessage from "df-shared/src/components/WarningMessage.vue";
import { DocumentTypeConstants } from "../share/DocumentTypeConstants";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";
import BigRadio from "df-shared/src/Button/BigRadio.vue";
import TaxHelp from "../../helps/TaxHelp.vue";
import VGouvFrModal from "df-shared/src/GouvFr/v-gouv-fr-modal/VGouvFrModal.vue";
import { AnalyticsService } from "../../../services/AnalyticsService";
import ProfileFooter from "../../footer/ProfileFooter.vue";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import AllDeclinedMessages from "../share/AllDeclinedMessages.vue";
import MonFranceConnect from "../share/MonFranceConnect.vue";
import { DocumentDeniedReasons } from "df-shared/src/models/DocumentDeniedReasons";
import { cloneDeep } from "lodash";

extend("is", {
  ...is,
  message: "field-required",
  validate: value => !!value
});

@Component({
  components: {
    AllDeclinedMessages,
    DocumentInsert,
    FileUpload,
    ListItem,
    MonFranceConnect,
    ValidationObserver,
    ValidationProvider,
    WarningMessage,
    ConfirmModal,
    BigRadio,
    TaxHelp,
    VGouvFrModal,
    ProfileFooter,
    NakedCard
  },
  computed: {
    ...mapGetters({
      user: "userToEdit",
      tenantTaxDocument: "getTenantTaxDocument"
    })
  }
})
export default class Tax extends Vue {
  documents = DocumentTypeConstants.TAX_DOCS;

  user!: User;
  tenantTaxDocument!: DfDocument;

  documentDeniedReasons = new DocumentDeniedReasons();

  fileUploadStatus = UploadStatus.STATUS_INITIAL;
  files: DfFile[] = [];
  uploadProgress: {
    [key: string]: { state: string; percentage: number };
  } = {};
  taxDocument = new DocumentType();

  acceptVerification = false;
  customText = "";

  isDocDeleteVisible = false;

  getLocalStorageKey() {
    return "tax_" + this.user.email;
  }

  get documentStatus() {
    return this.tenantTaxDocument?.documentStatus;
  }

  mounted() {
    const doc = this.getRegisteredDoc();
    if (doc !== undefined) {
      this.customText = doc.customText || "";
    }
    const localDoc = this.getLocalDoc();
    if (localDoc !== undefined) {
      this.taxDocument = localDoc;
      localStorage.setItem(
        this.getLocalStorageKey(),
        this.taxDocument.key || ""
      );
    } else {
      const key = localStorage.getItem(this.getLocalStorageKey());
      if (key) {
        const localDoc = this.documents.find((d: DocumentType) => {
          return d.key === key;
        });
        if (localDoc !== undefined) {
          this.taxDocument = localDoc;
        }
      }
    }
    if (this.tenantTaxDocument?.documentDeniedReasons) {
      this.documentDeniedReasons = cloneDeep(
        this.tenantTaxDocument.documentDeniedReasons
      );
    }

    if (this.taxDocument.key === "my-name" && this.taxFiles().length > 0) {
      this.acceptVerification = true;
    }
  }

  onSelectChange() {
    localStorage.setItem(this.getLocalStorageKey(), this.taxDocument.key);
    if (this.user.documents !== null) {
      const doc = this.user.documents?.find((d: DfDocument) => {
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

  getRegisteredDoc() {
    if (this.user.documents !== null) {
      const doc = this.user.documents?.find((d: DfDocument) => {
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

  undoSelect() {
    if (this.user.documents !== null) {
      const doc = this.user.documents?.find((d: DfDocument) => {
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
    if (this.user.documents !== null) {
      const doc = this.user.documents?.find((d: DfDocument) => {
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

  addFiles(fileList: File[]) {
    AnalyticsService.uploadFile("tax");
    const nf = Array.from(fileList).map(f => {
      return { name: f.name, file: f, size: f.size };
    });
    this.files = [...this.files, ...nf];
    this.save();
  }

  resetFiles() {
    this.fileUploadStatus = UploadStatus.STATUS_INITIAL;
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

  async save(): Promise<boolean> {
    if (this.taxDocument.key === undefined) {
      return true;
    }
    AnalyticsService.registerFile("tax");
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

    const d = this.getRegisteredDoc();
    if (
      this.taxDocument.value === d?.documentSubCategory &&
      this.customText === (d?.customText || "") &&
      newFiles.length <= 0
    ) {
      return true;
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
      if (!this.customText || this.customText === "") {
        return false;
      }
      formData.append("customText", this.customText);
    }

    this.fileUploadStatus = UploadStatus.STATUS_SAVING;
    const loader = this.$loading.show();
    return await this.$store
      .dispatch("saveTenantTax", formData)
      .then(() => {
        this.files = [];
        this.fileUploadStatus = UploadStatus.STATUS_INITIAL;
        Vue.toasted.global.save_success();
        return true;
      })
      .catch(err => {
        this.fileUploadStatus = UploadStatus.STATUS_FAILED;
        if (err.response.data.message.includes("NumberOfPages")) {
          Vue.toasted.global.save_failed_num_pages();
        } else {
          Vue.toasted.global.save_failed();
        }
        return false;
      })
      .finally(() => {
        loader.hide();
      });
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
      this.$store.getters.getTenantDocuments?.find((d: DfDocument) => {
        return d.documentCategory === "TAX";
      })?.files || [];
    return [...newFiles, ...existingFiles];
  }

  async remove(file: DfFile, silent = false) {
    AnalyticsService.deleteFile("tax");
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

<style scoped lang="scss">
.spa {
  height: 3rem;
  @media all and (min-width: 768px) {
    width: 14rem;
  }
}

.blue-franceconnect {
  padding: 2rem;
  color: var(--primary);
  background-color: var(--bf200-bf300);
  border-radius: 0.25rem;
  .fr-h4 {
    color: var(--primary);
  }
}
</style>

<i18n>
{
"en": {
  "my-name": "Vous avez un avis d’imposition à votre nom",
  "my-parents": "Vous êtes rattaché fiscalement à vos parents",
  "less-than-year": "Vous êtes en France depuis moins d’un an",
  "other-tax": "Autre",
  "accept-verification": "J'accepte que DossierFacile procède à une vérification automatisée de ma fiche d'imposition auprès des services des impôts",
  "custom-text": "Afin d'améliorer votre dossier, veuillez expliquer ci-dessous pourquoi vous ne recevez pas d'avis d'imposition. Votre explication sera ajoutée à votre dossier :",
  "files": "Documents",
  "register": "Register",
  "field-required": "This field is required",
  "will-delete-files": "Please note, a change of situation will result in the deletion of your supporting documents. You will have to upload the supporting documents corresponding to your situation again.",
  "title": "My tax notice"
},
"fr": {
  "my-name": "Vous avez un avis d’imposition à votre nom",
  "my-parents": "Vous êtes rattaché fiscalement à vos parents",
  "less-than-year": "Vous êtes en France depuis moins d’un an",
  "other-tax": "Autre",
  "accept-verification": "J'accepte que DossierFacile procède à une vérification automatisée de ma fiche d'imposition auprès des services des impôts",
  "custom-text": "Afin d'améliorer votre dossier, veuillez expliquer ci-dessous pourquoi vous ne recevez pas d'avis d'imposition. Votre explication sera ajoutée à votre dossier :",
  "files": "Documents",
  "register": "Enregistrer",
  "field-required": "Ce champ est requis",
  "will-delete-files": "Attention, un changement de situation entraînera la suppression de vos justificatifs. Vous devrez charger de nouveau les justificatifs correspondant à votre situation.",
  "title": "Mon avis d'imposition"
}
}
</i18n>
