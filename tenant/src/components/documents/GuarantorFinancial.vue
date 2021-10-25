<template>
  <div>
    <div v-if="editFinancialDocument">
      <GuarantorFinancialDocumentForm></GuarantorFinancialDocumentForm>
    </div>
    <div v-if="!editFinancialDocument">
      <NakedCard class="fr-p-md-5w fr-mb-3w">
        <div>
          <h5>{{ $t("title") }}</h5>
          <div>{{ $t("subtitle") }}</div>
        </div>
      </NakedCard>
      <div v-for="(f, k) in financialDocuments" :key="k">
        <NakedCard class="fr-mb-3w">
          <div class="fr-grid-row space-between">
            <div class="v-center">
              <div class="fr-tag">{{ $t(f.documentType.key) }}</div>
            </div>
            <div
              :title="$t('net-monthly')"
              v-show="f.documentType.key !== 'no-income'"
              class="text-bold v-center"
            >
              {{ f.monthlySum }} {{ $t("monthly") }}
            </div>
            <div>
              <button
                @click="selectFinancialDocument(f)"
                class="fr-p-0 fr-mr-3w icon-btn"
              >
                <div class="color--primary material-icons md-24 fr-m-1w">
                  edit
                </div>
              </button>
              <button
                @click="removeFinancial(f)"
                class="fr-p-0 fr-mr-3w icon-btn"
              >
                <div class="color--primary material-icons md-24 fr-m-1w">
                  delete
                </div>
              </button>
            </div>
          </div>
        </NakedCard>
      </div>
      <div>
        <button
          @click="addAndSelectFinancial()"
          v-if="!hasNoIncome()"
          class="add-income-btn"
        >
          {{ $t("add-income") }}
        </button>
      </div>
      <ProfileFooter @on-back="goBack" @on-next="goNext"></ProfileFooter>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DocumentInsert from "@/components/documents/DocumentInsert.vue";
import FileUpload from "@/components/uploads/FileUpload.vue";
import { mapGetters } from "vuex";
import { FinancialDocument } from "df-shared/src/models/FinancialDocument";
import ListItem from "@/components/uploads/ListItem.vue";
import { User } from "df-shared/src/models/User";
import { DfFile } from "df-shared/src/models/DfFile";
import { DfDocument } from "df-shared/src/models/DfDocument";
import { extend } from "vee-validate";
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
import ProfileFooter from "@/components/footer/ProfileFooter.vue";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import GuarantorFinancialDocumentForm from "./GuarantorFinancialDocumentForm.vue";

extend("regex", {
  ...regex,
  message: "number-not-valid"
});

extend("required", {
  ...required,
  message: "field-required"
});

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
    ProfileFooter,
    NakedCard,
    GuarantorFinancialDocumentForm
  },
  computed: {
    ...mapGetters({
      user: "userToEdit",
      editFinancialDocument: "editGuarantorFinancialDocument",
      financialDocuments: "guarantorFinancialDocuments"
    })
  }
})
export default class GuarantorFinancial extends Vue {
  user!: User;
  financialDocuments!: FinancialDocument[];

  documents = DocumentTypeConstants.GUARANTOR_FINANCIAL_DOCS;

  beforeMount() {
    this.initialize();
  }

  initialize() {
    this.$store.commit("selectGuarantorDocumentFinancial", undefined);
    if (this.financialDocuments.length === 0) {
      this.addAndSelectFinancial();
    }
  }

  financialFiles(f: FinancialDocument) {
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

  async addAndSelectFinancial() {
    await this.$store.commit("createGuarantorDocumentFinancial");
  }

  removeFinancial(f: DfDocument) {
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
    this.$store.commit("selectGuarantorDocumentFinancial", undefined);
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
    this.$emit("on-next");
  }

  async selectFinancialDocument(f: FinancialDocument) {
    await this.$store.commit("selectGuarantorDocumentFinancial", f);
  }
}
</script>

<style scoped lang="scss">
.fr-tag {
  background-color: #2a7ffe;
  color: var(--w);
  max-width: 210px;
}

.icon-btn {
  border: 1px solid var(--primary);
  background-color: var(--w);
}

.v-center {
  display: inline-flex;
  align-items: center;
}

.add-income-btn {
  border-radius: 0.5rem;
  background: var(--blue-france-200);
  padding: 1.75rem;
  color: var(--primary);
  border: 1px solid var(--primary);
  width: 100%;
  font-size: 16px;
}
</style>

<i18n>
{
"en": {
  "salary": "Salary",
  "guarantor_salary": "Salary or other professional income",
  "social-service": "Social benefit payments",
  "rent": "Annuities",
  "pension": "Pensions",
  "scholarship": "Scholarship",
  "number-not-valid": "Number not valid",
  "delete-financial":  "Delete this salary",
  "field-required": "This field is required",
  "register": "Register",
  "select-label": "Attention, Please enter only your own income.",
  "no-income": "No income",
  "i-have-no-income": "I have no income",
  "warning-no-income-and-file": "You can't have files and no income. You must uncheck the box or delete your files.",
  "title": "Summary of your guarantor income",
  "subtitle": "Here is the list of income you declared. You can add new income at any time, if necessary.",
  "monthly": " € net monthly ",
  "net-monthly": "Net salary monthly",
  "add-income": "Add a new income ?"
},
"fr": {
  "salary": "Salaire",
  "guarantor_salary": "Salaires ou autres revenus d’activité professionnelle",
  "social-service": "Prestations sociales",
  "rent": "Rentes",
  "pension": "Pensions",
  "scholarship": "Bourses",
  "monthlySum-label": "J'indique le montant de mon revenu mensuel net à payer (avant prélèvement à la source)",
  "number-not-valid": "Nombre incorrect",
  "delete-financial":  "Supprimer ce revenu",
  "field-required": "Ce champ est requis",
  "register": "Enregistrer",
  "select-label": "Attention, Veuillez renseigner uniquement vos propres revenus.",
  "no-income": "Pas de revenu",
  "i-have-no-income": "Je n'ai pas de revenu",
  "warning-no-income-and-file": "Vous ne pouvez pas avoir des fichiers et indiquer ne pas pouvoir fournir tous les fichiers. Veuillez décocher la case ou supprimer vos fichiers.",
  "title": "Récapitulatif des revenus du garant",
  "subtitle": "Voici la liste des revenus que vous avez déclarés. Vous pouvez, à tout moment ajouter de nouveau revenu, si cela était nécessaire.",
  "monthly": " € net mensuel ",
  "net-monthly": "Net à payer mensuel",
  "add-income": "Ajouter un nouveau revenu ?"
}
}
</i18n>
