<template>
  <div>
    <div v-if="editFinancialDocument">
      <GuarantorFinancialDocumentForm
        :tenantId="tenantId"
      ></GuarantorFinancialDocumentForm>
    </div>
    <div v-if="!editFinancialDocument">
      <NakedCard class="fr-p-md-5w fr-mb-3w">
        <div>
          <h1 class="fr-h6">{{ $t("guarantorfinancial.title") }}</h1>
          <div>{{ $t("guarantorfinancial.subtitle") }}</div>
        </div>
      </NakedCard>
      <div v-for="(f, k) in financialDocuments" :key="k">
        <CardRow
          @edit="selectFinancialDocument(f)"
          @remove="removeFinancial(f)"
          :danger="guarantorFinancialDocument(f).documentStatus === 'DECLINED'"
        >
          <template v-slot:tag>
            <div class="fixed-width">
              <ColoredTag
                :text="getDocumentName(f)"
                :status="guarantorFinancialDocument(f).documentStatus"
              ></ColoredTag>
            </div>
          </template>
          <template v-slot:text>
            <div
              class="text-bold"
              :title="$t('guarantorfinancial.net-monthly')"
              v-show="f.documentType.key !== 'no-income'"
            >
              {{ f.monthlySum }} {{ $t("guarantorfinancial.monthly") }}
            </div>
          </template>
          <template v-slot:bottom>
            <AllDeclinedMessages
              class="fr-mb-0"
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
          {{ $t("guarantorfinancial.add-income") }}
        </button>
      </div>
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
import { DfDocument } from "df-shared/src/models/DfDocument";

import DfButton from "df-shared/src/Button/Button.vue";

import WarningMessage from "df-shared/src/components/WarningMessage.vue";
import { DocumentTypeConstants } from "../share/DocumentTypeConstants";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";
import Modal from "df-shared/src/components/Modal.vue";
import DocumentHelp from "../../helps/DocumentHelp.vue";
import VGouvFrModal from "df-shared/src/GouvFr/v-gouv-fr-modal/VGouvFrModal.vue";
import ProfileFooter from "../../footer/ProfileFooter.vue";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import CardRow from "df-shared/src/components/CardRow.vue";
import GuarantorFinancialDocumentForm from "./GuarantorFinancialDocumentForm.vue";
import AllDeclinedMessages from "../share/AllDeclinedMessages.vue";
import ColoredTag from "df-shared/src/components/ColoredTag.vue";

@Component({
  components: {
    AllDeclinedMessages,
    ColoredTag,
    DocumentInsert,
    FileUpload,
    ListItem,
    DfButton,
    WarningMessage,
    ConfirmModal,
    Modal,
    DocumentHelp,
    VGouvFrModal,
    ProfileFooter,
    NakedCard,
    CardRow,
    GuarantorFinancialDocumentForm,
  },
  computed: {
    ...mapGetters({
      user: "userToEdit",
      editFinancialDocument: "editGuarantorFinancialDocument",
      financialDocuments: "guarantorFinancialDocuments",
    }),
  },
})
export default class GuarantorFinancial extends Vue {
  @Prop() tenantId?: string;

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

  documentDeniedReasons(f: FinancialDocument) {
    return this.guarantorFinancialDocument(f).documentDeniedReasons;
  }

  documentStatus(f: FinancialDocument) {
    return this.guarantorFinancialDocument(f).documentStatus;
  }

  guarantorFinancialDocument(f: FinancialDocument) {
    return this.$store.getters.getGuarantorDocuments?.find((d: DfDocument) => {
      return d.id === f.id;
    });
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

  hasNoIncome() {
    return (
      this.financialDocuments.length > 0 &&
      this.financialDocuments.find((f) => {
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

  private getDocumentName(document: FinancialDocument): string {
    return this.$t(`documents.${document.documentType.key}`).toString();
  }
}
</script>

<style scoped lang="scss">
.fr-tag {
  background-color: #2a7ffe;
  color: var(--text-inverted-grey);
  max-width: 210px;
}

.add-income-btn {
  margin: 0.5rem 1rem;
  width: calc(100% - 2rem);
  @media (min-width: 768px) {
    margin: 0.5rem 0;
    width: calc(100%);
  }
  border-radius: 0.5rem;
  padding: 1.75rem;
  color: var(--primary);
  border: 1px solid var(--primary);
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
