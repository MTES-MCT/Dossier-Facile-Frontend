<template>
  <div>
    <ConfirmModal
      v-if="isDocDeleteVisible"
      @valid="validSelect()"
      @cancel="undoSelect()"
    >
      <span>{{ $t("will-delete-files") }}</span>
    </ConfirmModal>
    <ValidationObserver v-slot="{ invalid, validate }">
      <form name="form" @submit.prevent="validate().then(save)">
        <div class="rf-mt-3w">
          <fieldset class="rf-fieldset">
            <div class="rf-fieldset__content">
              <div class="rf-grid-row">
                <div v-for="d in documents" :key="d.key">
                  <BigRadio
                    :val="d"
                    v-model="taxDocument"
                    @input="onSelectChange()"
                  >
                    <div class="rf-grid-col spa">
                      <span>{{ $t(d.key) }}</span>
                    </div>
                  </BigRadio>
                </div>
              </div>
            </div>
          </fieldset>
        </div>
        <div
          class="rf-mb-3w"
          v-if="taxDocument.key && taxDocument.key === 'other-tax'"
        >
          <div class="rf-input-group">
            <label class="rf-label" for="customText">{{
              $t("custom-text")
            }}</label>
            <input
              v-model="customText"
              class="form-control rf-input validate-required"
              id="customText"
              name="customText"
              placeholder=""
              type="text"
              required
            />
          </div>
        </div>
        <div v-if="taxDocument.key && taxDocument.key === 'my-name'">
          <div class="rf-mb-3w">
            <p v-html="taxDocument.explanationText"></p>
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
          v-if="taxFiles().length > 0"
          class="rf-col-lg-8 rf-col-md-12 rf-mb-3w"
        >
          <ListItem
            v-for="(file, k) in taxFiles()"
            :key="k"
            :file="file"
            @remove="remove(file)"
          />
        </div>
        <div
          class="rf-col-12 rf-mb-3w"
          v-if="taxDocument.key && taxDocument.key === 'my-name'"
        >
          <validation-provider rules="is" v-slot="{ errors }" class="rf-col-10">
            <div
              class="rf-input-group"
              :class="errors[0] ? 'rf-input-group--error' : ''"
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
              <span class="rf-error-text" v-if="errors[0]">{{
                $t(errors[0])
              }}</span>
            </div>
          </validation-provider>
        </div>
        <div class="rf-col-12 rf-mb-5w" v-if="taxDocument">
          <button class="rf-btn" type="submit" :disabled="isButtonDisabled()">
            {{ $t("register") }}
          </button>
        </div>
        <div
          class="rf-mb-5w"
          v-if="taxDocument.key && taxDocument.key === 'my-name'"
        >
          <DocumentInsert
            :allow-list="taxDocument.acceptedProofs"
            :block-list="taxDocument.refusedProofs"
          ></DocumentInsert>
        </div>
      </form>
    </ValidationObserver>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { DocumentType } from "df-shared/src/models/Document";
import DocumentInsert from "@/components/documents/DocumentInsert.vue";
import FileUpload from "@/components/uploads/FileUpload.vue";
import { mapGetters } from "vuex";
import { UploadStatus } from "../uploads/UploadStatus";
import ListItem from "@/components/uploads/ListItem.vue";
import { User } from "df-shared/src/models/User";
import { DfFile } from "df-shared/src/models/DfFile";
import { DfDocument } from "df-shared/src/models/DfDocument";
import { extend } from "vee-validate";
import { is } from "vee-validate/dist/rules";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { RegisterService } from "../../services/RegisterService";
import WarningMessage from "df-shared/src/components/WarningMessage.vue";
import { DocumentTypeConstants } from "./DocumentTypeConstants";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";
import BigRadio from "df-shared/src/Button/BigRadio.vue";

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
    BigRadio
  },
  computed: {
    ...mapGetters({
      user: "userToEdit"
    })
  }
})
export default class Tax extends Vue {
  user!: User;
  fileUploadStatus = UploadStatus.STATUS_INITIAL;
  files: DfFile[] = [];
  uploadProgress: {
    [key: string]: { state: string; percentage: number };
  } = {};
  taxDocument = new DocumentType();

  acceptVerification = false;
  customText = "";

  documents = DocumentTypeConstants.TAX_DOCS;
  isDocDeleteVisible = false;

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

  onSelectChange() {
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

  validSelect() {
    if (this.user.documents !== null) {
      const doc = this.user.documents?.find((d: DfDocument) => {
        return d.documentCategory === "TAX";
      });
      if (doc !== undefined) {
        doc.files?.forEach(f => {
          if (f.id) {
            this.remove(f, true);
          }
        });
      }
    }
    this.isDocDeleteVisible = false;
  }

  mounted() {
    const doc = this.getRegisteredDoc();
    if (doc !== undefined) {
      this.customText = doc.customText || "";
    }
    const localDoc = this.getLocalDoc();
    if (localDoc !== undefined) {
      this.taxDocument = localDoc;
    }
  }

  addFiles(fileList: File[]) {
    const nf = Array.from(fileList).map(f => {
      return { name: f.name, file: f, size: f.size };
    });
    this.files = [...this.files, ...nf];
  }

  resetFiles() {
    this.fileUploadStatus = UploadStatus.STATUS_INITIAL;
  }

  save() {
    if (
      !this.taxDocument.key ||
      (this.taxDocument.key === "my-name" && !this.acceptVerification)
    ) {
      return;
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
        Vue.toasted.global.max_file();
        return;
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
      formData.append("customText", this.customText);
    }

    this.fileUploadStatus = UploadStatus.STATUS_SAVING;
    const loader = this.$loading.show();
    RegisterService.saveTax(formData)
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
      this.$store.getters.getDocuments?.find((d: DfDocument) => {
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

  remove(file: DfFile, silent = false) {
    if (file.path && file.id) {
      RegisterService.deleteFile(file.id, silent);
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
  "my-name": "Vous avez un avis d’imposition à votre nom",
  "my-parents": "Vous êtes rattaché fiscalement à vos parents",
  "less-than-year": "Vous êtes en France depuis moins d’un an",
  "other-tax": "Autre",
  "accept-verification": "J'accepte que DossierFacile procède à une vérification automatisée de ma fiche d'imposition auprès des services des impôts",
  "custom-text": "Afin d'améliorer votre dossier, veuillez expliquer ci-dessous pourquoi vous ne recevez pas d'avis d'impositon. Votre explication sera ajoutée à votre dossier :",
  "files": "Documents",
  "register": "Register",
  "field-required": "This field is required",
  "will-delete-files": "Please note, a change of situation will result in the deletion of your supporting documents. You will have to upload the supporting documents corresponding to your situation again."
},
"fr": {
  "my-name": "Vous avez un avis d’imposition à votre nom",
  "my-parents": "Vous êtes rattaché fiscalement à vos parents",
  "less-than-year": "Vous êtes en France depuis moins d’un an",
  "other-tax": "Autre",
  "accept-verification": "J'accepte que DossierFacile procède à une vérification automatisée de ma fiche d'imposition auprès des services des impôts",
  "custom-text": "Afin d'améliorer votre dossier, veuillez expliquer ci-dessous pourquoi vous ne recevez pas d'avis d'impositon. Votre explication sera ajoutée à votre dossier :",
  "files": "Documents",
  "register": "Enregistrer",
  "field-required": "Ce champ est requis",
  "will-delete-files": "Attention, un changement de situation entraînera la suppression de vos justificatifs. Vous devrez charger de nouveau les justificatifs correspondant à votre situation."
}
}
</i18n>
