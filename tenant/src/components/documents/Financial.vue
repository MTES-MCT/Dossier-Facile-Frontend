<template>
  <div>
    <ConfirmModal
      v-if="isDocDeleteVisible"
      @valid="validSelect()"
      @cancel="undoSelect()"
    >
      <span>{{ $t("will-delete-files") }}</span>
    </ConfirmModal>
    <Modal v-show="isNoIncomeAndFiles" @close="isNoIncomeAndFiles = false">
      <template v-slot:body>
        <div class="fr-container">
          <div class="fr-grid-row justify-content-center">
            <div class="fr-col-12">
              <p>
                {{ $t("warning-no-income-and-file") }}
              </p>
            </div>
          </div>
        </div>
      </template>
    </Modal>
    <NakedCard v-if="hasNoIncome()">
      <div class="fr-mt-3w fr-mb-3w">
        {{ $t("has-no-income") }}
        <div class="fr-mb-5w">
          <ValidationObserver v-slot="{ validate }">
            <form
              name="customTextForm"
              @submit.prevent="validate().then(save(financialDocuments[0]))"
            >
              <div class="fr-input-group">
                <label class="fr-label" for="customTextNoDocument">
                  {{ $t("custom-text") }}
                </label>
                <input
                  v-model="financialDocuments[0].customText"
                  class="form-control fr-input validate-required"
                  id="customTextNoDocument"
                  name="customText"
                  placeholder=""
                  type="text"
                />
              </div>
            </form>
          </ValidationObserver>
        </div>
      </div>
    </NakedCard>
    <div v-for="(f, k) in getFinancialDocuments()" :key="k">
      <ValidationObserver v-slot="{ validate }">
        <NakedCard class="fr-mb-3w">
          <div
            class="fr-grid-row fr-mb-3w"
            style="justify-content: space-between"
            :id="`income${k}`"
            :ref="`income${k}`"
          >
            <span
              ><b> Revenu {{ k + 1 }} </b></span
            >
            <DfButton
              class="fr-btn"
              size="small"
              @on-click="removeFinancial(f)"
              v-if="k > 0"
            >
              {{ $t("delete-financial") }}
            </DfButton>
          </div>
          <form name="form" @submit.prevent="validate().then(save(f))">
            <div>
              <div class="fr-pl-3v">
                {{ $t("select-label") }}
              </div>

              <v-gouv-fr-modal v-if="k === 0">
                <template v-slot:button>
                  En difficulté pour répondre à la question ?
                </template>
                <template v-slot:title>
                  En difficulté pour répondre à la question ?
                </template>
                <template v-slot:content>
                  <p>
                    <DocumentHelp></DocumentHelp>
                    <DocumentInsert
                      :allow-list="f.documentType.acceptedProofs"
                      :block-list="f.documentType.refusedProofs"
                      v-if="f.documentType.key"
                    ></DocumentInsert>
                  </p>
                </template>
              </v-gouv-fr-modal>

              <div class="fr-mt-3w">
                <fieldset class="fr-fieldset">
                  <div class="fr-fieldset__content">
                    <div class="fr-grid-row">
                      <div v-for="d in getDocuments()" :key="d.key">
                        <BigRadio
                          :val="d"
                          v-model="f.documentType"
                          @input="onSelectChange(f)"
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
            </div>
            <div>
              <div
                class="fr-mb-3w"
                v-if="f.documentType.key && f.documentType.key === 'no-income'"
              >
                <div class="fr-input-group">
                  <label class="fr-label" for="customText">{{
                    $t("custom-text")
                  }}</label>
                  <input
                    v-model="f.customText"
                    class="form-control fr-input"
                    id="customText"
                    name="customText"
                    placeholder=""
                    type="text"
                  />
                </div>
              </div>
            </div>
            <div
              class="fr-mt-3w"
              v-if="f.documentType.key && f.documentType.key !== 'no-income'"
            >
              <div>
                <div
                  v-if="
                    f.documentType &&
                      f.documentType.key &&
                      f.documentType.key !== 'no-income'
                  "
                >
                  <div>
                    <validation-provider
                      :rules="{ required: true, regex: /^[0-9., ]+$/ }"
                      v-slot="{ errors }"
                    >
                      <div
                        class="fr-input-group"
                        :class="errors[0] ? 'fr-input-group--error' : ''"
                      >
                        <label for="monthlySum" class="fr-label"
                          >{{ $t("monthlySum-label") }} :</label
                        >
                        <input
                          id="monthlySum"
                          :placeholder="$t('monthlySum')"
                          type="number"
                          min="0"
                          step="1"
                          v-model="f.monthlySum"
                          name="monthlySum"
                          class="validate-required form-control fr-input"
                          required
                        />
                        <span class="fr-error-text" v-if="errors[0]">{{
                          $t(errors[0])
                        }}</span>
                        <span class="fr-error-text" v-if="f.monthlySum > 10000">
                          {{ $t("high-salary") }}
                        </span>
                        <span class="fr-error-text" v-if="f.monthlySum <= 0">
                          {{ $t("low-salary") }}
                        </span>
                      </div>
                    </validation-provider>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="fr-mt-3w"
              v-if="f.documentType.key && f.documentType.key !== 'no-income'"
            >
              <div>
                <div>
                  <div class="fr-mb-3w">
                    {{ f.documentType.explanationText }}
                  </div>
                  <div class="fr-mb-3w">
                    <FileUpload
                      :current-status="f.fileUploadStatus"
                      @add-files="addFiles(f, ...arguments)"
                      @reset-files="resetFiles(f, ...arguments)"
                    ></FileUpload>
                  </div>
                  <div class="fr-col-12 fr-mb-3w bg-purple">
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
                  <div class="fr-mb-5w" v-if="f.noDocument">
                    <validation-provider
                      :rules="{ required: true }"
                      v-slot="{ errors }"
                    >
                      <div class="fr-input-group">
                        <label class="fr-label" :for="`customText${k}`">
                          {{ $t(`customText-${f.documentType.key}`) }}
                        </label>
                        <input
                          v-model="f.customText"
                          class="form-control fr-input validate-required"
                          :id="`customText${k}`"
                          name="customText"
                          placeholder=""
                          type="text"
                          required
                        />
                        <span class="fr-error-text" v-if="errors[0]">{{
                          $t(errors[0])
                        }}</span>
                      </div>
                    </validation-provider>
                  </div>
                </div>
              </div>
              <div
                v-if="
                  f.documentType.key &&
                    f.documentType.key !== 'no-income' &&
                    financialFiles(f).length > 0
                "
                class="fr-col-md-12 fr-mb-3w"
              >
                <ListItem
                  v-for="(file, k) in financialFiles(f)"
                  :key="k"
                  :file="file"
                  @remove="remove(f, file)"
                />
              </div>
            </div>
          </form>
        </NakedCard>
      </ValidationObserver>
    </div>
    <div class="fr-col-12 fr-mb-5w fr-grid-row space-between">
      <DfButton
        class="fr-btn"
        size="small"
        @on-click="setNoIncome()"
        v-if="!hasNoIncome() && getFinancialDocuments().length <= 0"
      >
        {{ $t("i-have-no-income") }}
      </DfButton>
    </div>
    <FinancialFooter
      @on-back="goBack"
      @on-next="goNext"
      @add-financial="addFinancial()"
    ></FinancialFooter>
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
import Modal from "df-shared/src/components/Modal.vue";
import BigRadio from "df-shared/src/Button/BigRadio.vue";
import DocumentHelp from "../helps/DocumentHelp.vue";
import VGouvFrModal from "df-shared/src/GouvFr/v-gouv-fr-modal/VGouvFrModal.vue";
import { AnalyticsService } from "../../services/AnalyticsService";
import FinancialFooter from "@/components/footer/FinancialFooter.vue";
import NakedCard from "df-shared/src/components/NakedCard.vue";

extend("regex", {
  ...regex,
  message: "number-not-valid"
});

extend("required", {
  ...required,
  message: "field-required"
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
    Modal,
    BigRadio,
    DocumentHelp,
    VGouvFrModal,
    FinancialFooter,
    NakedCard
  },
  computed: {
    ...mapGetters({
      user: "userToEdit"
    })
  }
})
export default class Financial extends Vue {
  user!: User;
  financialDocuments: F[] = [];

  documents = DocumentTypeConstants.FINANCIAL_DOCS;
  isDocDeleteVisible = false;
  selectedDoc?: F;
  isNoIncomeAndFiles = false;

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
        doc.files?.forEach(f => {
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
            if (f.customText === "-") {
              f.customText = "";
            }
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
      this.addFinancial();
    }
  }

  addFiles(f: F, fileList: File[]) {
    AnalyticsService.uploadFile("financial");
    const nf = Array.from(fileList).map(f => {
      return { name: f.name, file: f, size: f.size };
    });
    f.files = [...f.files, ...nf];
    this.save(f);
  }
  resetFiles(f: F) {
    f.fileUploadStatus = UploadStatus.STATUS_INITIAL;
  }
  save(f: F) {
    AnalyticsService.registerFile("financial");
    const fieldName = "documents";
    const formData = new FormData();
    if (!f.noDocument) {
      const newFiles = f.files.filter(f => {
        return !f.id;
      });
      if (
        !this.financialFiles(f).length &&
        f.documentType.key !== "no-income"
      ) {
        Vue.toasted.global.max_file({
          message: this.$i18n.t("missing-file")
        });
        return false;
      }

      if (
        f.documentType.maxFileCount &&
        this.financialFiles(f).length > f.documentType.maxFileCount
      ) {
        Vue.toasted.global.max_file({
          message: this.$i18n.t("max-file", [
            this.financialFiles(f).length,
            f.documentType.maxFileCount
          ])
        });
        return false;
      }

      Array.from(Array(newFiles.length).keys()).map(x => {
        const f: File = newFiles[x].file || new File([], "");
        formData.append(`${fieldName}[${x}]`, f, newFiles[x].name);
      });
    } else {
      if (this.financialFiles(f).length > 0) {
        this.isNoIncomeAndFiles = true;
        return false;
      }
    }

    const typeDocumentFinancial = f.documentType?.value || "";
    formData.append("typeDocumentFinancial", typeDocumentFinancial);

    if (f.documentType.key === "no-income") {
      f.noDocument = true;
    }

    formData.append("noDocument", f.noDocument ? "true" : "false");
    if (f.documentType.key === "no-income" && !f.customText) {
      formData.append("customText", "-");
    } else {
      formData.append("customText", f.customText);
    }

    if (f.monthlySum) {
      formData.append("monthlySum", f.monthlySum.toString());
    } else {
      if (f.documentType.key !== "no-income") {
        formData.append("monthlySum", "0");
      }
    }
    if (f.id) {
      formData.append("id", f.id.toString());
    }

    f.fileUploadStatus = UploadStatus.STATUS_SAVING;
    const loader = this.$loading.show();
    this.$store
      .dispatch("saveTenantFinancial", formData)
      .then(() => {
        f.files = [];
        f.fileUploadStatus = UploadStatus.STATUS_INITIAL;
        Vue.toasted.global.save_success();
        this.$store.dispatch("loadUser").then(() => {
          this.initialize();
        });
      })
      .catch(() => {
        f.fileUploadStatus = UploadStatus.STATUS_FAILED;
        Vue.toasted.global.save_failed();
      })
      .finally(() => {
        loader.hide();
      });
    return true;
  }

  financialFiles(f: F) {
    const newFiles = f.files.map((file: DfFile) => {
      return {
        documentSubCategory: f.documentType?.value,
        id: file.name,
        name: file.name,
        size: file.size
      };
    });
    const existingFiles =
      this.$store.getters.getTenantDocuments?.find((d: DfDocument) => {
        return d.id === f.id;
      })?.files || [];
    return [...newFiles, ...existingFiles];
  }

  remove(f: F, file: DfFile, silent = false) {
    AnalyticsService.deleteFile("financial");
    if (file.path && file.id) {
      RegisterService.deleteFile(file.id, silent);
    } else {
      const firstIndex = f.files.findIndex(f => {
        return f.name === file.name && f.file === file.file && !f.id;
      });
      f.files.splice(firstIndex, 1);
    }
  }

  addFinancial() {
    if (
      this.financialDocuments.length > 0 &&
      this.financialDocuments[0].documentType.key === "no-income"
    ) {
      if (this.financialDocuments[0].id) {
        this.$store
          .dispatch("deleteDocument", this.financialDocuments[0].id)
          .then(
            () => {
              this.financialDocuments = [new F()];
            },
            () => {
              Vue.toasted.global.error();
            }
          );
      } else {
        this.financialDocuments = [new F()];
      }
    } else {
      this.financialDocuments.push(new F());
    }
    this.$nextTick(() => {
      const container: Element[] = this.$refs[
        `income${this.financialDocuments.length - 1}`
      ] as Element[];
      container[0].scrollIntoView();
    });
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
    return "";
  }

  getDocuments() {
    return this.documents.filter(d => {
      return d.key !== "no-income";
    });
  }

  setNoIncome() {
    const doc = this.documents?.find(d => {
      return d.key === "no-income";
    });
    if (doc !== undefined) {
      const f = new F();
      f.documentType = doc;
      this.financialDocuments.forEach(f => {
        this.removeFinancial(f);
      });
      this.financialDocuments = [f];

      this.selectedDoc = f;
      this.save(f);
    }
  }

  getFinancialDocuments() {
    return this.financialDocuments.filter(f => {
      return !f.documentType || f.documentType.key !== "no-income";
    });
  }

  hasNoIncome() {
    return (
      this.financialDocuments.length > 0 &&
      this.financialDocuments.find(f => {
        return f.documentType && f.documentType.key !== "no-income";
      }) === undefined
    );
  }
  goBack() {
    this.$emit("on-back");
  }

  goNext() {
    let res = true;
    for (const f of this.financialDocuments) {
      const s = this.save(f);
      if (!s) {
        res = false;
      }
    }
    if (res) {
      this.$emit("on-next");
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
  "customText-social-service": "In order to improve my file, I explain why I cannot provide my justificatives:",
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
  "select-label": "Attention, Please enter only your own income.",
  "no-income": "No income",
  "custom-text": "In order to improve your file, you can add an eplanation :",
  "i-have-no-income": "I have no income",
  "has-no-income": "You have no income",
  "warning-no-income-and-file": "You can't have files and no income. You must uncheck the box or delete your files.",
  "save": "Save",
  "missing-file": "You must add files to save this income."
},
"fr": {
  "salary": "Salaire",
  "guarantor_salary": "Salaires ou autres revenus d’activité professionnelle",
  "social-service": "Prestations sociales",
  "rent": "Rentes",
  "pension": "Pensions",
  "scholarship": "Bourses",
  "monthlySum": "Montant en euros",
  "monthlySum-label": "J'indique le montant de mon revenu mensuel net à payer (avant prélèvement à la source)",
  "noDocument-social": "Je ne peux pas fournir de justificatifs de versement de prestations sociales",
  "noDocument-salary": "Je ne peux pas fournir mes trois derniers bulletins de salaire",
  "noDocument-pension": "Je ne peux pas fournir de justificatifs de versement de pension",
  "noDocument-rent": "Je ne peux pas fournir de justificatifs de versement de rente",
  "noDocument-scholarship": "Je ne peux pas fournir de justificatifs d'attribution de bourse",
  "customText-social-service": "Afin d'améliorer mon dossier, j'explique pourquoi je ne peux pas fournir mes justificatifs :",
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
  "select-label": "Attention, Veuillez renseigner uniquement vos propres revenus.",
  "no-income": "Pas de revenu",
  "custom-text": "Afin d'améliorer votre dossier, vous pouvez ajouter une explication :",
  "i-have-no-income": "Je n'ai pas de revenu",
  "has-no-income": "Vous avez indiqué ne pas avoir de revenu",
  "warning-no-income-and-file": "Vous ne pouvez pas avoir des fichiers et indiquer ne pas pouvoir fournir tous les fichiers. Veuillez décocher la case ou supprimer vos fichiers.",
  "save": "Sauvegarder",
  "missing-file": "Vous devez ajouter des fichiers pour sauvegarder ce revenu."
}
}
</i18n>
