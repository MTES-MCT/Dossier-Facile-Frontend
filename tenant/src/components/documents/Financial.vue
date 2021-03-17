<template>
  <div>
    <ConfirmModal
      v-if="isDocDeleteVisible"
      @valid="validSelect()"
      @cancel="undoSelect()"
    >
      <span>{{ $t("will-delete-files") }}</span>
    </ConfirmModal>
    <div v-for="(f, k) in financialDocuments" :key="k">
      <ValidationObserver v-slot="{ validate }">
        <div
          class="rf-grid-row rf-mb-3w"
          style="justify-content: space-between"
        >
          <span> Revenu {{ k + 1 }} </span>
          <DfButton class="rf-btn" size="small" @on-click="removeFinancial(f)">
            {{ $t("delete-financial") }}
          </DfButton>
        </div>
        <form name="form" @submit.prevent="validate().then(save(f))">
          <div>
            <label class="rf-label" for="select">
              {{ $t("select-label") }}
            </label>
            <select
              v-model="f.documentType"
              class="rf-select rf-mb-3w"
              id="select"
              name="select"
              @change="onSelectChange(f)"
            >
              <option v-for="d in documents" :value="d" :key="d.key">
                {{ $t(d.key) }}
              </option>
            </select>
          </div>
          <div v-if="f.documentType && f.documentType.key">
            <div>
              <validation-provider
                :rules="{ required: true, regex: /^[0-9., ]+$/ }"
                v-slot="{ errors }"
              >
                <div
                  class="rf-input-group"
                  :class="errors[0] ? 'rf-input-group--error' : ''"
                >
                  <label for="monthlySum" class="rf-label"
                    >{{ $t("monthlySum-label") }} :</label
                  >
                  <input
                    id="monthlySum"
                    :placeholder="$t('monthlySum')"
                    type="text"
                    v-model="f.monthlySum"
                    name="monthlySum"
                    class="validate-required form-control rf-input"
                    required
                  />
                  <span class="rf-error-text" v-if="errors[0]">{{
                    $t(errors[0])
                  }}</span>
                  <span class="rf-error-text" v-if="f.monthlySum > 10000">
                    {{ $t("high-salary") }}
                  </span>
                  <span class="rf-error-text" v-if="f.monthlySum <= 0">
                    {{ $t("low-salary") }}
                  </span>
                </div>
              </validation-provider>
            </div>
            <div class="rf-mb-3w">
              {{ f.documentType.explanationText }}
            </div>
            <div class="rf-mb-3w">
              <FileUpload
                :current-status="f.fileUploadStatus"
                @add-files="addFiles(f, ...arguments)"
                @reset-files="resetFiles(f, ...arguments)"
              ></FileUpload>
            </div>
            <div class="rf-col-12 rf-mb-3w">
              <input
                type="checkbox"
                :id="`noDocument${k}`"
                value="false"
                v-model="f.noDocument"
              />
              <label :for="`noDocument${k}`">
                {{ $t(getCheckboxLabel(f.documentType.key)) }}
              </label>
            </div>
            <div class="rf-mb-5w" v-if="f.noDocument">
              <validation-provider
                :rules="{ required: true }"
                v-slot="{ errors }"
              >
                <div class="rf-input-group">
                  <label class="rf-label" :for="`customText${k}`">
                    {{ $t(getCustomTextLabel(f.documentType.key)) }}
                  </label>
                  <input
                    v-model="f.customText"
                    class="form-control rf-input validate-required"
                    :id="`customText${k}`"
                    name="customText"
                    placeholder=""
                    type="text"
                    required
                  />
                  <span class="rf-error-text" v-if="errors[0]">{{
                    $t(errors[0])
                  }}</span>
                </div>
              </validation-provider>
            </div>
          </div>
          <div
            v-if="financialFiles(f).length > 0"
            class="rf-col-lg-8 rf-col-md-12 rf-mb-3w"
          >
            <ListItem
              v-for="(file, k) in financialFiles(f)"
              :key="k"
              :file="file"
              @remove="remove(f, file)"
            />
          </div>
          <div class="rf-col-12 rf-mb-5w" v-if="f.documentType">
            <button
              class="rf-btn"
              type="submit"
              :disabled="f.files.length <= 0 && !f.noDocument"
            >
              {{ $t("register") }}
            </button>
          </div>
          <div class="rf-mb-5w">
            <DocumentInsert
              :allow-list="f.documentType.acceptedProofs"
              :block-list="f.documentType.refusedProofs"
            ></DocumentInsert>
          </div>
        </form>
      </ValidationObserver>
      <hr />
    </div>
    <div class="rf-col-12 rf-mb-5w">
      <button class="rf-btn" type="submit" @click="addFinancial()">
        Ajouter un revenu
      </button>
    </div>
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
import { RegisterService } from "../../services/RegisterService";
import DfButton from "df-shared/src/Button/Button.vue";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { required, regex } from "vee-validate/dist/rules";
import WarningMessage from "df-shared/src/components/WarningMessage.vue";
import { DocumentTypeConstants } from "./DocumentTypeConstants";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";

extend("regex", {
  ...regex,
  message: "number-not-valid",
});

extend("required", {
  ...required,
  message: "field-required",
});

class F {
  id?: number;
  documentType = new DocumentType();
  noDocument = false;
  files: DfFile[] = [];
  fileUploadStatus = UploadStatus.STATUS_INITIAL;
  customText = "";
  monthlySum?: number;
}

@Component({
  components: {
    ValidationProvider,
    ValidationObserver,
    DocumentInsert,
    FileUpload,
    ListItem,
    DfButton,
    WarningMessage,
    ConfirmModal,
  },
  computed: {
    ...mapGetters({
      user: "userToEdit",
    }),
  },
})
export default class Financial extends Vue {
  MAX_FILE_COUNT = 5;
  MAX_FILE_SIZE = 5;

  user!: User;
  financialDocuments: F[] = [];

  documents = DocumentTypeConstants.FINANCIAL_DOCS;
  isDocDeleteVisible = false;
  selectedDoc?: F;

  isNewDocument(f: F) {
    if (f.id !== null) {
      const doc = this.user.documents?.find((d: DfDocument) => {
        return d.id === f.id;
      });
      if (doc !== undefined) {
        return doc.documentSubCategory !== f.documentType.value;
      }
    }
    return false;
  }

  onSelectChange(f: F) {
    if (f.id !== null) {
      const doc = this.user.documents?.find((d: DfDocument) => {
        return d.id === f.id;
      });
      if (doc !== undefined) {
        this.selectedDoc = f;
        this.isDocDeleteVisible =
          (doc.files?.length || 0) > 0 &&
          doc.documentSubCategory !== f.documentType.value;
      }
    }
    return false;
  }

  undoSelect() {
    if (this.user.documents !== null) {
      const doc = this.user.documents?.find((d: DfDocument) => {
        return d.id === this.selectedDoc?.id;
      });
      if (doc !== undefined) {
        const localDoc = this.documents.find((d: DocumentType) => {
          return d.value === doc.documentSubCategory;
        });
        if (localDoc !== undefined && this.selectedDoc) {
          this.selectedDoc.documentType = localDoc;
        }
      }
    }
    this.isDocDeleteVisible = false;
  }

  validSelect() {
    if (this.user.documents !== null) {
      const doc = this.user.documents?.find((d: DfDocument) => {
        return d.id === this.selectedDoc?.id;
      });
      if (doc !== undefined) {
        doc.files?.forEach((f) => {
          if (f.id && this.selectedDoc) {
            this.remove(this.selectedDoc, f, true);
          }
        });
      }
    }
    this.isDocDeleteVisible = false;
  }

  mounted() {
    this.initialize();
  }

  initialize() {
    this.financialDocuments = [];
    if (this.user.documents !== null) {
      const docs = this.user.documents?.filter((d: DfDocument) => {
        return d.documentCategory === "FINANCIAL";
      });
      if (docs !== undefined && docs.length > 0) {
        docs
          .sort((a, b) => {
            return (a?.id || 0) - (b?.id || 0);
          })
          .forEach((d: DfDocument) => {
            const f = new F();
            f.noDocument = d.noDocument || false;
            f.customText = d.customText || "";
            f.monthlySum = d.monthlySum || 0;
            f.id = d.id;

            const localDoc = this.documents.find((d2: DocumentType) => {
              return d2.value === d.documentSubCategory;
            });
            if (localDoc !== undefined) {
              f.documentType = localDoc;
            }
            this.financialDocuments.push(f);
          });
      }
    } else {
      this.financialDocuments.push(new F());
    }
  }

  addFiles(f: F, fileList: File[]) {
    const nf = Array.from(fileList).map((f) => {
      return { name: f.name, file: f, size: f.size };
    });
    f.files = [...f.files, ...nf];
  }
  resetFiles(f: F) {
    f.fileUploadStatus = UploadStatus.STATUS_INITIAL;
  }
  save(f: F) {
    const fieldName = "documents";
    const formData = new FormData();
    if (!f.noDocument) {
      const newFiles = f.files.filter((f) => {
        return !f.id;
      });
      if (!newFiles.length) return;

      if (
        f.documentType.maxFileCount &&
        this.financialFiles(f).length > f.documentType.maxFileCount
      ) {
        Vue.toasted.global.max_file();
        return;
      }

      Array.from(Array(newFiles.length).keys()).map((x) => {
        const f: File = newFiles[x].file || new File([], "");
        formData.append(`${fieldName}[${x}]`, f, newFiles[x].name);
      });
    }

    const typeDocumentFinancial = f.documentType?.value || "";
    formData.append("typeDocumentFinancial", typeDocumentFinancial);
    formData.append("noDocument", f.noDocument ? "true" : "false");
    if (f.monthlySum) {
      formData.append("monthlySum", f.monthlySum.toString());
    }
    if (f.id) {
      formData.append("id", f.id.toString());
    }
    if (f.customText != "") {
      formData.append("customText", f.customText);
    }

    f.fileUploadStatus = UploadStatus.STATUS_SAVING;
    const loader = this.$loading.show();
    RegisterService.saveFinancial(formData)
      .then(() => {
        f.files = [];
        f.fileUploadStatus = UploadStatus.STATUS_INITIAL;
        Vue.toasted.global.save_success();
      })
      .catch(() => {
        f.fileUploadStatus = UploadStatus.STATUS_FAILED;
        Vue.toasted.global.save_failed();
      })
      .finally(() => {
        this.$store.dispatch("loadUser").then(() => {
          this.initialize();
        });
        loader.hide();
      });
  }

  financialFiles(f: F) {
    const newFiles = f.files.map((file: DfFile) => {
      return {
        documentSubCategory: f.documentType?.value,
        id: file.name,
        name: file.name,
        size: file.size,
      };
    });
    const existingFiles =
      this.$store.getters.getDocuments?.find((d: DfDocument) => {
        return d.id === f.id;
      })?.files || [];
    return [...newFiles, ...existingFiles];
  }

  remove(f: F, file: DfFile, silent = false) {
    if (file.path && file.id) {
      RegisterService.deleteFile(file.id, silent);
    } else {
      f.files = f.files.filter((f: DfFile) => {
        return f.name !== file.name;
      });
    }
  }

  addFinancial() {
    this.financialDocuments.push(new F());
  }

  removeFinancial(f: DfDocument) {
    if (f.id) {
      const loader = Vue.$loading.show();
      this.$store
        .dispatch("deleteDocument", f.id)
        .then(null, () => {
          Vue.toasted.global.error();
        })
        .finally(() => {
          loader.hide();
          this.initialize();
        });
    } else {
      this.financialDocuments = this.financialDocuments.filter(
        (d: DfDocument) => {
          return d !== f;
        }
      );
    }
  }

  getCheckboxLabel(key: string) {
    if (key === "salary") {
      return "noDocument-salary";
    }
    if (key === "pension") {
      return "noDocument-pension";
    }
    if (key === "rent") {
      return "noDocument-rent";
    }
    if (key === "scholarship") {
      return "noDocument-scholarship";
    }
    if (key === "social-service") {
      return "noDocument-social";
    }
  }

  getCustomTextLabel(key: string) {
    if (key === "salary") {
      return "customText-salary";
    }
    if (key === "pension") {
      return "customText-pension";
    }
    if (key === "rent") {
      return "customText-rent";
    }
    if (key === "scholarship") {
      return "customText-scholarship";
    }
    if (key === "social-service") {
      return "customText-social";
    }
  }
}
</script>

<style scoped lang="scss"></style>

<i18n>
{
"en": {
  "salary": "Salary",
  "guarantor_salary": "Salary or other professional income",
  "social-service": "Social benefit payments",
  "rent": "Annuities",
  "pension": "Pensions",
  "scholarship": "Scholarship",
  "monthlySum": "Value in euros",
  "monthlySum-label": "Salary (after tax)",
  "noDocument-social": "I cannot provide proof of payment of social benefits",
  "noDocument-salary": "I cannot provide my last three payslips",
  "noDocument-rent": "I cannot provide proof of rent",
  "noDocument-pension": "I cannot provide proof of pension",
  "noDocument-scholarship": "I cannot provide proof of scholarship",
  "customText-social": "In order to improve my file, I explain why I cannot provide my justificatives:",
  "customText-salary": "In order to improve my file, I explain why I cannot provide my last three payslips:",
  "customText-pension": "In order to improve my file, I explain why I cannot provide my justificatives:",
  "customText-rent": "In order to improve my file, I explain why I cannot provide my justificatives:",
  "customText-scholarship": "In order to improve my file, I explain why I cannot provide my justificatives:",
  "high-salary": "You have entered a salary greater than € 10,000 are you sure you have entered your monthly salary?",
  "low-salary": "You have entered a salary equal to 0 € are you sure you have entered your monthly salary?",
  "number-not-valid": "Number not valid",
  "delete-financial":  "Delete this salary",
  "field-required": "This field is required",
  "will-delete-files": "Please note, a change of situation will result in the deletion of your supporting documents. You will have to upload the supporting documents corresponding to your situation again.",
  "register": "Register",
  "select-label": "Attention, Please enter only your own income."
},
"fr": {
  "salary": "Salaire",
  "guarantor_salary": "Salaires ou autres revenus d’activité professionnelle",
  "social-service": "Versement de prestations sociales",
  "rent": "Rentes",
  "pension": "Pensions",
  "scholarship": "Bourses",
  "monthlySum": "Montant en euros",
  "monthlySum-label": "Montant du revenu (après impôts)",
  "noDocument-social": "Je ne peux pas fournir de justificatifs de versement de prestations sociales",
  "noDocument-salary": "Je ne peux pas fournir mes trois derniers bulletins de salaire",
  "noDocument-pension": "Je ne peux pas fournir de justificatifs de versement de pension",
  "noDocument-rent": "Je ne peux pas fournir de justificatifs de versement de rente",
  "noDocument-scholarship": "Je ne peux pas fournir de justificatifs d'attribution de bourse",
  "customText-social": "Afin d'améliorer mon dossier, j'explique pourquoi je ne peux pas fournir mes justificatifs :",
  "customText-salary": "Afin d'améliorer mon dossier, j'explique pourquoi je ne peux pas fournir mes trois derniers bulletins de salaire :",
  "customText-pension": "Afin d'améliorer mon dossier, j'explique pourquoi je ne peux pas fournir mes justificatifs :",
  "customText-rent": "Afin d'améliorer mon dossier, j'explique pourquoi je ne peux pas fournir mes justificatifs :",
  "customText-scholarship": "Afin d'améliorer mon dossier, j'explique pourquoi je ne peux pas fournir mes justificatifs :",
  "high-salary": "Vous avez saisi un salaire supérieur à 10 000€ êtes-vous sûr d'avoir saisi votre salaire mensuel ?",
  "low-salary": "Vous avez saisi un salaire égal à 0€ êtes-vous sûr d'avoir saisi votre salaire mensuel ?",
  "number-not-valid": "Nombre incorrect",
  "delete-financial":  "Supprimer ce revenu",
  "field-required": "Ce champ est requis",
  "will-delete-files": "Attention, un changement de situation entraînera la suppression de vos justificatifs. Vous devrez charger de nouveau les justificatifs correspondant à votre situation.",
  "register": "Enregistrer",
  "select-label": "Attention, Veuillez renseigner uniquement vos propres revenus."
}
}
</i18n>
