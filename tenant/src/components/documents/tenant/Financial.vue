<template>
  <div>
    <div v-if="editFinancialDocument">
      <FinancialDocumentForm></FinancialDocumentForm>
    </div>
    <div v-if="!editFinancialDocument">
      <NakedCard class="fr-p-md-5w fr-mb-3w">
        <div>
          <h1 class="fr-h6">{{ $t("title") }}</h1>
          <div>{{ $t("subtitle") }}</div>
        </div>
      </NakedCard>
      <div v-for="(f, k) in financialDocuments" :key="k">
        <CardRow
          @edit="selectFinancialDocument(f)"
          @remove="removeFinancial(f)"
          :danger="tenantFinancialDocument(f).documentStatus === 'DECLINED'"
        >
          <template v-slot:tag>
            <div class="fixed-width">
              <ColoredTag
                :text="$t(f.documentType.key)"
                :status="tenantFinancialDocument(f).documentStatus"
              ></ColoredTag>
            </div>
          </template>
          <template v-slot:text>
            <div
              class="text-bold"
              :class="{ declined: tenantFinancialDocument(f).documentStatus }"
              :title="$t('net-monthly')"
              v-show="f.documentType.key !== 'no-income'"
            >
              {{ f.monthlySum }} {{ $t("monthly") }}
            </div>
          </template>
          <template v-slot:bottom>
            <AllDeclinedMessages
              class="fr-mb-3w"
              :documentDeniedReasons="documentDeniedReasons(f)"
              :documentStatus="documentStatus(f)"
            ></AllDeclinedMessages>
          </template>
        </CardRow>
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
import DocumentInsert from "../share/DocumentInsert.vue";
import FileUpload from "../../uploads/FileUpload.vue";
import { mapGetters } from "vuex";
import { FinancialDocument } from "df-shared/src/models/FinancialDocument";
import ListItem from "../../uploads/ListItem.vue";
import { User } from "df-shared/src/models/User";
import { DfFile } from "df-shared/src/models/DfFile";
import { DfDocument } from "df-shared/src/models/DfDocument";
import WarningMessage from "df-shared/src/components/WarningMessage.vue";
import { DocumentTypeConstants } from "../share/DocumentTypeConstants";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";
import Modal from "df-shared/src/components/Modal.vue";
import BigRadio from "df-shared/src/Button/BigRadio.vue";
import DocumentHelp from "../../helps/DocumentHelp.vue";
import VGouvFrModal from "df-shared/src/GouvFr/v-gouv-fr-modal/VGouvFrModal.vue";
import ProfileFooter from "../../footer/ProfileFooter.vue";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import CardRow from "df-shared/src/components/CardRow.vue";
import FinancialDocumentForm from "./FinancialDocumentForm.vue";
import ColoredTag from "df-shared/src/components/ColoredTag.vue";
import AllDeclinedMessages from "../share/AllDeclinedMessages.vue";

@Component({
  components: {
    AllDeclinedMessages,
    ColoredTag,
    DocumentInsert,
    FileUpload,
    ListItem,
    WarningMessage,
    ConfirmModal,
    Modal,
    BigRadio,
    DocumentHelp,
    VGouvFrModal,
    ProfileFooter,
    NakedCard,
    CardRow,
    FinancialDocumentForm
  },
  computed: {
    ...mapGetters({
      user: "userToEdit",
      editFinancialDocument: "editFinancialDocument",
      financialDocuments: "tenantFinancialDocuments"
    })
  }
})
export default class Financial extends Vue {
  user!: User;
  financialDocuments!: FinancialDocument[];

  documents = DocumentTypeConstants.FINANCIAL_DOCS;

  beforeMount() {
    this.initialize();
  }

  documentDeniedReasons(f: FinancialDocument) {
    return this.tenantFinancialDocument(f).documentDeniedReasons;
  }

  documentStatus(f: FinancialDocument) {
    return this.tenantFinancialDocument(f).documentStatus;
  }

  initialize() {
    this.$store.commit("selectDocumentFinancial", undefined);
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

  tenantFinancialDocument(f: FinancialDocument) {
    return this.$store.getters.getTenantDocuments?.find((d: DfDocument) => {
      return d.id === f.id;
    });
  }

  async addAndSelectFinancial() {
    await this.$store.commit("createDocumentFinancial");
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
    this.$store.commit("selectDocumentFinancial", undefined);
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
    await this.$store.commit("selectDocumentFinancial", f);
  }
}
</script>

<style scoped lang="scss">
.add-income-btn {
  border-radius: 0.5rem;
  padding: 1.75rem;
  color: var(--primary);
  border: 1px solid var(--primary);
  width: 100%;
  font-size: 16px;
  background: var(--blue-france-925);
  &:hover {
    background: var(--blue-france-hover);
  }
  &:active {
    background: var(--blue-france-active);
  }
}

.fixed-width {
  width: 180px;
}
</style>

<i18n>
{
"en": {
  "salary": "Salary",
  "social-service": "Social benefit payments",
  "rent": "Annuities",
  "pension": "Pensions",
  "scholarship": "Scholarship",
  "delete-financial":  "Delete this salary",
  "register": "Register",
  "no-income": "No income",
  "i-have-no-income": "I have no income",
  "title": "Summary of your income",
  "subtitle": "Here is the list of income you declared. You can add new income at any time, if necessary.",
  "monthly": " € net monthly ",
  "net-monthly": "Net salary monthly",
  "add-income": "Add a new income ?"
},
"fr": {
  "salary": "Salaire",
  "social-service": "Prestations sociales",
  "rent": "Rentes",
  "pension": "Pensions",
  "scholarship": "Bourses",
  "delete-financial":  "Supprimer ce revenu",
  "register": "Enregistrer",
  "no-income": "Pas de revenu",
  "i-have-no-income": "Je n'ai pas de revenu",
  "title": "Récapitulatif de vos revenus",
  "subtitle": "Voici la liste des revenus que vous avez déclarés. Vous pouvez, à tout moment ajouter de nouveaux revenus, si cela était nécessaire.",
  "monthly": " € net mensuel ",
  "net-monthly": "Net à payer mensuel",
  "add-income": "Ajouter un nouveau revenu ?"
}
}
</i18n>
