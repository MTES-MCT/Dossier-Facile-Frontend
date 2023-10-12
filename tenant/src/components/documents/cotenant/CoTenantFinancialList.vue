<template>
  <div>
    <div v-if="editFinancialDocument">
      <CoTenantFinancialForm
        :coTenantId="coTenantId"
        :financialDocument="financialDocument"
        :allowNoIncome="allowNoIncome()"
        @on-edit="setEditFinancialDocument"
        @on-next="goNext"
        @on-back="goBack"
      ></CoTenantFinancialForm>
    </div>
    <div v-else>
      <NakedCard class="fr-p-md-5w fr-mb-3w">
        <div>
          <h1 class="fr-h6">{{ $t("cotenantfinanciallist.title") }}</h1>
          <div>{{ $t("cotenantfinanciallist.subtitle") }}</div>
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
                :text="getDocumentName(f)"
                :status="documentStatus(f)"
              ></ColoredTag>
            </div>
          </template>
          <template v-slot:text>
            <div
              class="text-bold"
              :class="{ declined: documentStatus(f) }"
              :title="$t('cotenantfinanciallist.net-monthly')"
              v-show="f.documentType.key !== 'no-income'"
            >
              {{ f.monthlySum }} {{ $t("cotenantfinanciallist.monthly") }}
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
      <div v-if="financialDocument.documentType.key !== 'no-income'">
        <button @click="addFinancialDocument()" class="add-income-btn">
          {{ $t("cotenantfinanciallist.add-income") }}
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
import { FinancialDocument } from "df-shared/src/models/FinancialDocument";
import ListItem from "../../uploads/ListItem.vue";
import { DfDocument } from "df-shared/src/models/DfDocument";
import WarningMessage from "df-shared/src/components/WarningMessage.vue";
import { DocumentTypeConstants } from "../share/DocumentTypeConstants";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";
import Modal from "df-shared/src/components/Modal.vue";
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
    DocumentHelp,
    CoTenantFinancialForm,
    VGouvFrModal,
    ProfileFooter,
    NakedCard,
    CardRow,
    SimulationCaf,
  },
})
export default class CoTenantFinancialList extends Vue {
  @Prop() readonly coTenantId!: number;

  tenantFinancialDocuments: Ref<FinancialDocument[]> = ref([]);
  tenantOriginalDocuments?: DfDocument[];
  financialDocument!: FinancialDocument;
  editFinancialDocument = false;

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

        const localDoc = DocumentTypeConstants.FINANCIAL_DOCS.find((d2) => {
          return d2.value === d.subCategory;
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
      financialDocuments.find((f) => {
        return f.documentType && f.documentType.key !== "no-income";
      }) === undefined) as boolean;
  }

  initialize() {
    this.tenantOriginalDocuments = this.getOriginalDocuments();
    this.tenantFinancialDocuments.value = this.getTenantFinancialDocuments(
      this.tenantOriginalDocuments
    );
    if (this.hasNoIncome(this.tenantFinancialDocuments.value)) {
      this.financialDocument = this.tenantFinancialDocuments.value.find((f) => {
        return f.documentType && f.documentType.key === "no-income";
      }) as FinancialDocument;
    } else {
      this.financialDocument = new FinancialDocument();
      this.editFinancialDocument = !this.hasFinancial();
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

  hasFinancial() {
    const tenant = UtilsService.getTenant(Number(this.coTenantId));
    if (tenant === undefined) {
      return false;
    }
    const docs = tenant.documents?.filter((d: DfDocument) => {
      return d.documentCategory === "FINANCIAL";
    });
    return docs?.length !== 0;
  }

  addFinancialDocument() {
    this.financialDocument = new FinancialDocument();
    this.editFinancialDocument = true;
  }

  selectFinancialDocument(f?: FinancialDocument) {
    this.financialDocument = f ? f : new FinancialDocument();
    this.editFinancialDocument = true;
  }

  removeFinancial(f?: FinancialDocument) {
    const loader = Vue.$loading.show();
    this.$store
      .dispatch("deleteDocument", f?.id)
      .then(
        () => {
          this.tenantFinancialDocuments.value =
            this.tenantFinancialDocuments.value?.filter((d) => d.id != f?.id);
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

  goBack() {
    this.$emit("on-back");
  }

  goNext() {
    if (this.editFinancialDocument) {
      this.editFinancialDocument = false;
      this.initialize();
    } else {
      this.$emit("on-next");
    }
  }

  private getDocumentName(document: FinancialDocument): string {
    return this.$t(`documents.${document.documentType.key}`).toString();
  }

  allowNoIncome(): boolean {
    return (
      !this.hasFinancial() ||
      this.financialDocument.documentType.key === "no-income"
    );
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
