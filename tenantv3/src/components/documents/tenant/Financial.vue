<template>
  <div>
    <Modal v-show="showContracts == true" @close="showContracts = false" >
      <template v-slot:header>
        <div class="fr-container">
          <h1 id="fr-modal-title-modal-1" class="fr-modal__title">
            Dîtes le nous une fois !
          </h1>
        </div>
      </template>
      <template v-slot:body>
        <div class="fr-container my-modal">
          <div class="fr-grid-row justify-content-center">
            <fieldset class="fr-fieldset" id="checkboxes-hint-el-sm"
                      aria-labelledby="checkboxes-hint-el-sm-legend checkboxes-hint-el-sm-messages">
              <legend class="fr-fieldset__legend--regular fr-fieldset__legend" id="checkboxes-hint-el-sm-legend">
                Sélectionnez les justificatif de revenus que vous souhaitez ajouter:
              </legend>
              <div
                  v-for="contract in user.contracts"
                  v-bind:key="contract.id"
                  class="fr-fieldset__element"
              >
                <div class="fr-checkbox-group fr-checkbox-group--sm">

                  <input
                         :id="'checkboxes-hint-el-sm-1' + contract.id" type="checkbox"
                         aria-describedby="checkboxes-hint-el-sm-1-messages">
                  <label class="fr-label" :for="'checkboxes-hint-el-sm-1' + contract.id"> <b>{{ contract.company }}</b>&nbsp; depuis le {{contract.debut}} <span
                      class="fr-hint-text">{{ contract.nature }} - Montant moyen mens. {{ contract.averageAmount }} </span> </label>
                  <div class="fr-messages-group" id="checkboxes-hint-el-sm-1-messages" aria-live="assertive"></div>

                </div>
              </div>

              <div class="fr-messages-group" id="checkboxes-hint-el-sm-messages" aria-live="assertive"></div>
            </fieldset>
          </div>
        </div>

        <div class="btn-align">
          <DfButton
              @on-click="addRevenus()"
              :primary="true"
          >Ajouter les revenus </DfButton>
        </div>
      </template>
    </Modal>
    <div v-if="editFinancialDocument">
      <FinancialDocumentForm></FinancialDocumentForm>
    </div>
    <div v-if="!editFinancialDocument">
      <NakedCard class="fr-p-md-5w fr-mb-3w">
        <div>
          <h1 class="fr-h6">{{ $t("financial-page.title") }}</h1>
          <div>{{ $t("financial-page.subtitle") }}</div>
        </div>
      </NakedCard>
      <div v-for="(f, k) in financialDocuments" :key="k">
        <CardRow
          @edit="selectFinancialDocument(f)"
          @remove="removeFinancial(f)"
          :danger="tenantFinancialDocument(f)?.documentStatus === 'DECLINED'"
        >
          <template v-slot:tag>
            <div class="fixed-width">
              <ColoredTag
                :text="getDocumentName(f)"
                :status="tenantFinancialDocument(f)?.documentStatus"
              ></ColoredTag>
            </div>
          </template>
          <template v-slot:text>
            <div
              class="text-bold"
              :class="{ declined: tenantFinancialDocument(f)?.documentStatus }"
              :title="$t('financial-page.net-monthly')"
              v-show="f.documentType.key !== 'no-income'"
            >
              {{ f.monthlySum }} {{ $t("financial-page.monthly") }}
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
          {{ $t("financial-page.add-income") }}
        </button>
      </div>
      <SimulationCaf class="fr-mt-4w" />
      <ProfileFooter @on-back="goBack" @on-next="goNext"></ProfileFooter>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FinancialDocument } from "df-shared-next/src/models/FinancialDocument";
import { DfDocument } from "df-shared-next/src/models/DfDocument";
import { DocumentTypeConstants } from "../share/DocumentTypeConstants";
import ProfileFooter from "../../footer/ProfileFooter.vue";
import NakedCard from "df-shared-next/src/components/NakedCard.vue";
import CardRow from "df-shared-next/src/components/CardRow.vue";
import FinancialDocumentForm from "./FinancialDocumentForm.vue";
import ColoredTag from "df-shared-next/src/components/ColoredTag.vue";
import AllDeclinedMessages from "../share/AllDeclinedMessages.vue";
import SimulationCaf from "../share/SimulationCaf.vue";
import {computed, onBeforeMount, ref} from "vue";
import useTenantStore from "@/stores/tenant-store";
import { useI18n } from "vue-i18n";
import { ToastService } from "@/services/ToastService";
import {useLoading} from 'vue-loading-overlay'
import DocumentInsert from "@/components/documents/share/DocumentInsert.vue";
import WarningTaxDeclaration from "@/components/documents/share/WarningTaxDeclaration.vue";
import Modal from "df-shared-next/src/components/Modal.vue";
import ConfirmModal from "df-shared-next/src/components/ConfirmModal.vue";
import DfButton from "df-shared-next/src/Button/Button.vue";
import {DSNService} from "../../../../../df-shared-next/src/services/DSNService";
import keycloak from "owner/src/plugin/keycloak";

const { t } = useI18n();
const store = useTenantStore();
    const user = computed(() => store.userToEdit);
    const editFinancialDocument = computed(() => store.editFinancialDocument);
    let financialDocuments = computed(() => store.tenantFinancialDocuments);
    const showContracts = ref(true);

  const documents = DocumentTypeConstants.FINANCIAL_DOCS;

  const emit = defineEmits(["on-back", "on-next"]);

  onBeforeMount(() => {
    initialize();
  })

  function documentDeniedReasons(f: FinancialDocument) {
    return tenantFinancialDocument(f)?.documentDeniedReasons;
  }

  function documentStatus(f: FinancialDocument) {
    return tenantFinancialDocument(f)?.documentStatus;
  }

  function initialize() {
    store.selectDocumentFinancial(undefined);
    if (financialDocuments.value.length === 0) {
      addAndSelectFinancial();
    }
  }

  function tenantFinancialDocument(f: FinancialDocument) {
    return store.getTenantDocuments?.find((d: DfDocument) => {
      return d.id === f.id;
    });
  }

  async function addAndSelectFinancial() {
    await store.createDocumentFinancial();
  }

  function removeFinancial(f: DfDocument) {
    if (f.id === undefined) {
      return;
    }
    const $loading = useLoading({});
    const loader = $loading.show();
    store.deleteDocument(f.id)
      .then(null, () => {
        ToastService.error();
      })
      .finally(() => {
        loader.hide();
        initialize();
      });
    store.selectDocumentFinancial(undefined);
  }

  function hasNoIncome() {
    return (
      financialDocuments.value.length > 0 &&
      financialDocuments.value.find((f) => {
        return f.documentType && f.documentType.key !== "no-income";
      }) === undefined
    );
  }

  function goBack() {
    emit("on-back");
  }

  function goNext() {
    emit("on-next");
  }

  async function selectFinancialDocument(f: FinancialDocument) {
    await store.selectDocumentFinancial(f);
  }

  function getDocumentName(document: FinancialDocument): string {
    return t(`documents.${document.documentType.key}`).toString();
  }
  function addRevenus() {
    DSNService.addRevenu()
        .then( () =>

              store.loadUser().then(() => {
                initialize();
                showContracts.value = false

              } )
        );
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
.my-modal{
  width:650px;
}
.fixed-width {
  width: 180px;
}
</style>
