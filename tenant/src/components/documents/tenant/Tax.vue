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
        </form>
      </NakedCard>
      <div
        class="fr-col-12 fr-mt-3w allowtax-container"
        v-if="taxDocument.key && taxDocument.key === 'my-name'"
      >
        <NakedCard class="fr-p-md-5w bg-transparent">
          <div class="header fr-icon-attachment-line fr-pb-1w">
            {{ $t("automatic-tax-title") }}
          </div>
          <div class="auth-tax-container">
            <div>
              {{ $t("automatic-tax-p1") }}
            </div>
            <ul>
              <li>{{ $t("automatic-tax-l1") }}</li>
              <li>{{ $t("automatic-tax-l2") }}</li>
              <li>{{ $t("automatic-tax-l3") }}</li>
              <li>{{ $t("automatic-tax-l4") }}</li>
            </ul>
            <div>
              {{ $t("automatic-tax-p2-1") }}
              <b>{{ $t("automatic-tax-p2-2") }}</b>
              {{ $t("automatic-tax-p2-3") }}
            </div>
            <div class="tax-btn-container">
              <BigRadio
                :val="'disallow'"
                v-model="allowTax"
                @input="onSelectTaxAuth()"
                class="fr-col-md-3 fr-col-12 disallow-btn no-max-width"
                :class="{ selected: allowTax === 'disallow' }"
              >
                <span>{{ $t("forbid-tax") }}</span>
              </BigRadio>
              <BigRadio
                :val="'allow'"
                v-model="allowTax"
                @input="onSelectTaxAuth()"
                class="fr-col-md-9 fr-col-12 blue-text no-max-width"
                :class="{ selected: allowTax === 'allow' }"
              >
                <span>{{ $t("allow-tax") }}</span>
              </BigRadio>
            </div>
          </div>
        </NakedCard>
      </div>
      <NakedCard
        class="fr-p-md-5w fr-mt-3w"
        v-if="
          ((allowTax === 'allow' || allowTax === 'disallow') &&
            taxDocument.key === 'my-name') ||
            taxFiles().length > 0
        "
      >
        <div class="fr-mb-3w fr-mt-3w" v-if="taxDocument.key === 'my-name'">
          <div v-html="taxDocument.explanationText"></div>
          <div
            class="fr-background-contrast--info fr-p-2w fr-mt-2w warning-box"
          >
            <div class="fr-text-default--info fr-h6 title">
              <span class="material-icons-outlined"> warning_amber </span>
              <span class="fr-ml-1w">
                {{ $t("warning-no-accepted-doc") }}
              </span>
            </div>
            <div class="link">
              <a
                class="fr-link"
                href="https://docs.dossierfacile.fr/guide-dutilisation-de-dossierfacile/avis-dimposition"
                :title="$t('goto-documentation')"
                target="_blank"
                rel="noreferrer"
                >{{ $t("goto-documentation") }}</a
              >
            </div>
          </div>
          <MonFranceConnect class="fr-mt-2w"></MonFranceConnect>
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
        <div
          v-if="
            taxDocument.key === 'my-name' &&
              (allowTax === 'allow' || allowTax === 'disallow')
          "
        >
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
  TENANT_URL = process.env.VUE_APP_FULL_TENANT_URL;

  user!: User;
  tenantTaxDocument!: DfDocument;

  documentDeniedReasons = new DocumentDeniedReasons();

  fileUploadStatus = UploadStatus.STATUS_INITIAL;
  files: DfFile[] = [];
  uploadProgress: {
    [key: string]: { state: string; percentage: number };
  } = {};
  taxDocument = new DocumentType();

  customText = "";

  isDocDeleteVisible = false;
  allowTax = "";

  getTaxLocalStorageKey() {
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
        this.getTaxLocalStorageKey(),
        this.taxDocument.key || ""
      );
    } else {
      const key = localStorage.getItem(this.getTaxLocalStorageKey());
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

    if (this.user.allowCheckTax === true) {
      this.allowTax = "allow";
    }
    if (this.user.allowCheckTax === false) {
      this.allowTax = "disallow";
    }
  }

  onSelectTaxAuth() {
    this.$store.dispatch("saveTaxAuth", {
      allowTax: this.allowTax,
      redirectUri: this.TENANT_URL + this.$route.fullPath
    });
  }

  onSelectChange() {
    localStorage.setItem(this.getTaxLocalStorageKey(), this.taxDocument.key);
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

.warning-box {
  .title {
    display: flex;
  }
  .link {
    text-align: right;
  }
}

.allowtax-container {
  border-radius: 0.5rem;
  background-color: var(--blue-france-925);
  color: var(--info-425-625);
}

.bg-transparent {
  background-color: transparent;
}

.auth-tax-container {
  margin-left: 1.8rem;
}

.tax-btn-container {
  margin-top: 2rem;
  display: flex;
  @media all and (max-width: 767px) {
    flex-direction: column;
  }
}

.blue-text:hover {
  background-color: var(--blue-france-hover);
}

.disallow-btn:hover {
  color: var(--primary);
  background-color: var(--blue-france-hover);
}

.selected {
  // TODO replace buttons by radio and clean styles
  color: var(--primary) !important;
  background-color: var(--blue-france-hover) !important;
}

.no-max-width {
  max-width: none;
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
  "title": "My tax notice",
  "warning-no-accepted-doc": "Attention, l'avis de situation déclarative n'est pas accepté.",
  "goto-documentation" : "Go To documentation",
  "forbid-tax": "I forbid",
  "allow-tax": "I accept automatic verification",
  "automatic-tax-title": "Your tax automatically checked?",
  "automatic-tax-p1": "Vous pouvez accepter ou refuser la vérification automatique des données personnelles suivantes :",
  "automatic-tax-l1": "Mon état civil",
  "automatic-tax-l2": "Mon adresse déclarée au 1er janvier",
  "automatic-tax-l3": "La situation de mon foyer fiscal",
  "automatic-tax-l4": "Le détail de mes revenus",
  "automatic-tax-p2-1": "Si vous acceptez, la mension",
  "automatic-tax-p2-2": " \"Revenu fiscal certifié auprès des impôts\" ",
  "automatic-tax-p2-3": "figurera sur votre dossier et contribuera à renforcer l'image de votre dossier auprès des bailleurs."
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
  "title": "Mon avis d'imposition",
  "warning-no-accepted-doc": "Attention, l'avis de situation déclarative n'est pas accepté.",
  "goto-documentation" : "Consulter la documentation",
  "forbid-tax": "Je refuse",
  "allow-tax": "J'accepte la vérification automatique",
  "automatic-tax-title": "Votre revenu fiscal vérifié automatiquement ?",
  "automatic-tax-p1": "Vous pouvez accepter ou refuser la vérification automatique des données personnelles suivantes :",
  "automatic-tax-l1": "Mon état civil",
  "automatic-tax-l2": "Mon adresse déclarée au 1er janvier",
  "automatic-tax-l3": "La situation de mon foyer fiscal",
  "automatic-tax-l4": "Le détail de mes revenus",
  "automatic-tax-p2-1": "Si vous acceptez, la mension",
  "automatic-tax-p2-2": " \"Revenu fiscal certifié auprès des impôts\" ",
  "automatic-tax-p2-3": "figurera sur votre dossier et contribuera à renforcer l'image de votre dossier auprès des bailleurs."
}
}
</i18n>
