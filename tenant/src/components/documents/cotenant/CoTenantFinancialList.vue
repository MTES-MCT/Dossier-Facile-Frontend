<template>
  <div>
    <div v-if="editFinancialDocument">
      <CoTenantFinancialForm
        :coTenantId="coTenantId"
        :financialDocument="financialDocument"
        @on-edit="setEditFinancialDocument"
        @on-next="goNext"
        @on-back="goBack"
      ></CoTenantFinancialForm>
    </div>
    <div v-if="!editFinancialDocument">
      <NakedCard class="fr-p-md-5w fr-mb-3w">
        <div>
          <h1 class="fr-h6">{{ $t("title") }}</h1>
          <div>{{ $t("subtitle") }}</div>
        </div>
      </NakedCard>
      <div v-for="f in tenantFinancialDocuments.value" :key="f.id">
        <CardRow
          @edit="selectFinancialDocument(f)"
          @remove="removeFinancial(f)"
          :danger="documentStatus(f) === 'DECLINED'"
        >
          <template v-slot:tag>
            <div class="fixed-width">
              <ColoredTag
                :text="$t(f.documentType.key)"
                :status="documentStatus(f)"
              ></ColoredTag>
            </div>
          </template>
          <template v-slot:text>
            <div
              class="text-bold"
              :class="{ declined: documentStatus(f) }"
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
        <button @click="addFinancialDocument()" class="add-income-btn">
          {{ $t("add-income") }}
        </button>
      </div>
      <SimulationCaf class="fr-mt-4w" />
      <ProfileFooter @on-back="goBack" @on-next="goNext"></ProfileFooter>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
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
import CoTenantFinancialForm from "./CoTenantFinancialForm.vue";
import ColoredTag from "df-shared/src/components/ColoredTag.vue";
import AllDeclinedMessages from "../share/AllDeclinedMessages.vue";
import SimulationCaf from "../share/SimulationCaf.vue";
import { Ref, ref } from "@vue/reactivity";
import { UtilsService } from "@/services/UtilsService";

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
    CoTenantFinancialForm,
    VGouvFrModal,
    ProfileFooter,
    NakedCard,
    CardRow,
    SimulationCaf
  }
})
export default class CoTenantFinancialList extends Vue {
  @Prop() readonly coTenantId!: number;

  tenantFinancialDocuments: Ref<FinancialDocument[]> = ref([]);
  tenantOriginalDocuments?: DfDocument[];
  financialDocument: FinancialDocument = new FinancialDocument();
  editFinancialDocument = false;

  tenantFinancialDocumentsGet() {
    return this.tenantFinancialDocuments;
  }

  private getOriginalDocuments(): DfDocument[] {
    const tenant = UtilsService.getTenant(Number(this.coTenantId));

    if (tenant.documents) {
      const docs = tenant.documents?.filter((d: DfDocument) => {
        return d.documentCategory === "FINANCIAL";
      });
      if (docs !== undefined && docs.length > 0) {
        docs.sort((a: DfDocument, b: DfDocument) => {
          return (a?.id || 0) - (b?.id || 0);
        });
        return docs;
      }
    }
    return [];
  }

  private getTenantFinancialDocuments(
    documents: DfDocument[]
  ): FinancialDocument[] {
    const financialDocuments: FinancialDocument[] = [];
    if (documents.length > 0) {
      documents.forEach((d: DfDocument) => {
        const f = new FinancialDocument();
        f.noDocument = d.noDocument || false;
        f.customText = d.customText || "";
        if (f.customText === "-") {
          f.customText = "";
        }
        f.monthlySum = d.monthlySum || 0;
        f.id = d.id;

        const localDoc = DocumentTypeConstants.FINANCIAL_DOCS.find(d2 => {
          return d2.value === d.documentSubCategory;
        });
        if (localDoc !== undefined) {
          f.documentType = localDoc;
        }
        financialDocuments.push(f);
      });
    }

    return financialDocuments;
  }

  setEditFinancialDocument(value: boolean) {
    this.editFinancialDocument = value;
  }

  documents = DocumentTypeConstants.FINANCIAL_DOCS;

  beforeMount() {
    this.initialize();
  }

  private hasNoIncome(financialDocuments?: FinancialDocument[]): boolean {
    return (financialDocuments &&
      financialDocuments.length > 0 &&
      financialDocuments.find(f => {
        return f.documentType && f.documentType.key !== "no-income";
      }) === undefined) as boolean;
  }
  initialize() {
    this.tenantOriginalDocuments = this.getOriginalDocuments();
    this.tenantFinancialDocuments.value = this.getTenantFinancialDocuments(
      this.tenantOriginalDocuments
    );

    if (this.hasNoIncome(this.tenantFinancialDocuments.value)) {
      this.financialDocument = this.tenantFinancialDocuments.value.find(f => {
        return f.documentType && f.documentType.key !== "no-income";
      }) as FinancialDocument;
      this.editFinancialDocument = true;
    }
  }

  documentDeniedReasons(f: FinancialDocument) {
    const d = this.tenantOriginalDocuments?.find(
      (d: DfDocument) => f.id === d.id
    );

    return d ? d.documentDeniedReasons : "unknown";
  }

  documentStatus(f: FinancialDocument) {
    const d = this.tenantOriginalDocuments?.find(
      (d: DfDocument) => f.id === d.id
    );
    return d ? d.documentStatus : "EMPTY";
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
      this.tenantOriginalDocuments?.find((d: DfDocument) => {
        return d.id === f.id;
      })?.files || [];
    return [...newFiles, ...existingFiles];
  }

  tenantFinancialDocument(f: FinancialDocument) {
    this.tenantFinancialDocuments.value?.find((d: DfDocument) => {
      return d.id === f.id;
    });
  }

  addFinancialDocument() {
    this.financialDocument = new FinancialDocument();
    this.editFinancialDocument = true;
  }
  selectFinancialDocument(f?: FinancialDocument) {
    console.log("set financial with " + f?.id);
    this.financialDocument = f ? f : new FinancialDocument();
    this.editFinancialDocument = true;
  }

  removeFinancial(f?: FinancialDocument) {
    console.log("delete " + f?.id);
    const loader = Vue.$loading.show();
    this.$store
      .dispatch("deleteDocument", f?.id)
      .then(
        () => {
          this.tenantFinancialDocuments.value = this.tenantFinancialDocuments.value?.filter(
            d => d.id != f?.id
          );
        },
        () => {
          Vue.toasted.global.error();
        }
      )
      .finally(() => {
        loader.hide();
        this.initialize();
      });
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

  goBack() {
    this.$emit("on-back");
  }

  goNext() {
    this.$emit("on-next");
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
  "title": "Récapitulatif des revenus conjoint·e",
  "subtitle": "Voici la liste des revenus que vous avez déclarés. Vous pouvez, à tout moment ajouter de nouveaux revenus, si cela était nécessaire.",
  "monthly": " € net mensuel ",
  "net-monthly": "Net à payer mensuel",
  "add-income": "Ajouter un nouveau revenu ?"
}
}
</i18n>
