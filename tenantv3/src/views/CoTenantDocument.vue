<template>
  <ProfileContainer :step="getStep()">
    <div v-if="getSubStep() === 0">
      <CoTenantName
        :coTenantId="getTenantId()"
        @on-next="goNext()"
        @on-back="goBack()"
      />
    </div>

    <div v-if="getSubStep() === 1">
      <CoTenantIdentification
        :coTenantId="getTenantId()"
      ></CoTenantIdentification>
      <FooterContainer>
        <BackNext :showBack="true" @on-next="goNext()" @on-back="goBack()">
        </BackNext>
      </FooterContainer>
    </div>
    <div v-if="getSubStep() === 2">
      <CoTenantResidency
        :coTenantId="getTenantId()"
        @on-next="checkResidencyAndGoNext"
        @on-back="goBack()"
      ></CoTenantResidency>
      <ConfirmModal
        v-if="showNbDocumentsResidency"
        :validate-btn-text="t('add-new-documents')"
        :cancel-btn-text="t('next-step')"
        @cancel="cancelAndgoNext()"
        @close="showNbDocumentsResidency = false"
        @valid="showNbDocumentsResidency = false"
      >
        {{ t("cotenantdocument.warning-need-residency-documents.p1") }}
        <ul>
          <li>
            {{ t("cotenantdocument.warning-need-residency-documents.list1") }}
          </li>
          <li>
            {{ t("cotenantdocument.warning-need-residency-documents.list2") }}
          </li>
          <li>
            {{ t("cotenantdocument.warning-need-residency-documents.list3") }}
          </li>
        </ul>
        {{ t("cotenantdocument.warning-need-residency-documents.p2") }}
      </ConfirmModal>
    </div>
    <div v-if="getSubStep() === 3">
      <CoTenantProfessional :coTenantId="getTenantId()"></CoTenantProfessional>
      <FooterContainer>
        <BackNext :showBack="true" @on-next="goNext()" @on-back="goBack()">
        </BackNext>
      </FooterContainer>
    </div>
    <div v-if="getSubStep() === 4">
      <CoTenantFinancialList
        :coTenantId="getTenantId()"
        @on-next="goNext"
        @on-back="goBack"
      ></CoTenantFinancialList>
    </div>
    <div v-if="getSubStep() === 5">
      <CoTenantTax
        :coTenantId="getTenantId()"
        @on-next="goNext"
        @on-back="goBack"
      ></CoTenantTax>
    </div>
  </ProfileContainer>
</template>

<script setup lang="ts">
import ProfileContainer from "../components/ProfileContainer.vue";
import FooterContainer from "../components/footer/FooterContainer.vue";
import BackNext from "../components/footer/BackNext.vue";
import CoTenantIdentification from "../components/documents/cotenant/CoTenantIdentification.vue";
import CoTenantResidency from "../components/documents/cotenant/CoTenantResidency.vue";
import CoTenantName from "../components/documents/cotenant/CoTenantName.vue";
import CoTenantProfessional from "../components/documents/cotenant/CoTenantProfessional.vue";
import CoTenantFinancialList from "../components/documents/cotenant/CoTenantFinancialList.vue";
import CoTenantTax from "../components/documents/cotenant/CoTenantTax.vue";
import { DocumentService } from "@/services/DocumentService";
import ConfirmModal from "df-shared-next/src/components/ConfirmModal.vue";
import { AnalyticsService } from "@/services/AnalyticsService";
import { useI18n } from "vue-i18n";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import useTenantStore from "@/stores/tenant-store";


declare global {
  interface Window {
    _paq: any;
    Beacon: any;
  }
}

const { t } = useI18n();
const store = useTenantStore();

const router = useRouter();
const route = useRoute();
  const showNbDocumentsResidency = ref(false);

  onMounted(() => {
    window.Beacon("init", "e9f4da7d-11be-4b40-9514-ac7ce3e68f67");
  })

  onBeforeUnmount(() => {
    window.Beacon("destroy");
  })

  function goBack() {
    if (getSubStep() > 0) {
      router.push({
        name: "CoTenantDocuments",
        params: {
          substep: Number(getSubStep() - 1).toString(),
          tenantId: getTenantId().toString(),
        },
      });
      return;
    }
    router.push({
      name: "GuarantorChoice",
    });
  }

  function goNext() {
    if (getSubStep() < 5) {
      router.push({
        name: "CoTenantDocuments",
        params: {
          substep: Number(getSubStep() + 1).toString(),
          tenantId: getTenantId().toString(),
        },
      });
      return;
    } else {
      router.push({
        name: "TenantGuarantors",
        params: {
          tenantId: getTenantId().toString(),
          step: "5",
        },
      });
    }
  }

  function checkResidencyAndGoNext() {
    const user = store.getTenant(Number(getTenantId()));
    const docs = DocumentService.getDocs("RESIDENCY", user);
    if (docs.length === 1) {
      const d = docs[0];
      if (d.subCategory === "GUEST_PARENTS" || d.subCategory === "GUEST") {
        const nbPages = d.files?.reduce(
          (s, a) => s + (a.numberOfPages || 0),
          0
        );
        if ((nbPages || 0) < 3) {
          showNbDocumentsResidency.value = true;
          AnalyticsService.missingResidencyDocumentDetected();
          return;
        }
      }
    }
    goNext();
  }

  function cancelAndgoNext() {
    AnalyticsService.forceMissingResidencyDocument();
    goNext();
  }

  function getTenantId() {
    return Number(route.params.tenantId);
  }

  function getStep() {
    return Number(route.params.step) || 0;
  }
  function getSubStep() {
    return Number(route.params.substep) || 0;
  }
</script>

<style lang="scss" scoped>
h4 {
  margin: 0;
}
</style>
