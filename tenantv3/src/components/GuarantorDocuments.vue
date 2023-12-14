<template>
  <div class="fr-mb-15w">
    <div>
      <div v-if="guarantor?.typeGuarantor === 'NATURAL_PERSON'">
        <div v-if="substep === 0">
          <GuarantorName @on-back="goBack" @on-next="goNext"></GuarantorName>
        </div>
        <div v-if="substep === 1">
          <GuarantorIdentification></GuarantorIdentification>
          <GuarantorFooter
          @on-back="goBack"
          @on-next="goNext"
          ></GuarantorFooter>
        </div>
        <div v-if="substep === 2">
          <GuarantorResidency
          @on-back="goBack"
          @on-next="checkResidencyAndGoNext"
          ></GuarantorResidency>
        </div>
        <div v-if="substep === 3">
          <GuarantorProfessional></GuarantorProfessional>
          <GuarantorFooter
          @on-back="goBack"
          @on-next="goNext"
          ></GuarantorFooter>
        </div>
        <div v-if="substep === 4">
          <GuarantorFinancial
          @on-back="goBack"
          @on-next="goNext"
          ></GuarantorFinancial>
        </div>
        <div v-if="substep === 5">
          <GuarantorTax @on-back="goBack" @on-next="nextStep"></GuarantorTax>
        </div>
      </div>
      <div v-if="guarantor?.typeGuarantor === 'ORGANISM'">
        <OrganismCert :guarantor="guarantor"></OrganismCert>
        <GuarantorFooter
        @on-back="goBack"
        @on-next="nextStep"
        ></GuarantorFooter>
      </div>
      <div v-if="guarantor?.typeGuarantor === 'LEGAL_PERSON'">
        <div v-if="substep === 0">
          <CorporationIdentification
          @on-back="goBack"
          @on-next="goNext"
          ></CorporationIdentification>
        </div>
        <div v-if="substep === 1">
          <RepresentativeIdentification
          @on-back="goBack"
          @on-next="nextStep"
          ></RepresentativeIdentification>
        </div>
      </div>
    </div>
    <ConfirmModal
    v-if="changeGuarantorVisible"
    @valid="validSelect()"
    @cancel="undoSelect()"
    >
    <span>{{ $t("guarantordocuments.will-delete-guarantor") }}</span>
  </ConfirmModal>
  <ConfirmModal
  v-if="showNbDocumentsResidency"
  :validate-btn-text="$t('add-new-documents')"
  :cancel-btn-text="$t('next-step')"
  @cancel="cancelAndgoNext()"
  @close="showNbDocumentsResidency = false"
  @valid="showNbDocumentsResidency = false"
  >
  {{ $t("guarantordocuments.warning-need-residency-documents.p1") }}
  <ul>
    <li>
      {{ $t("guarantordocuments.warning-need-residency-documents.list1") }}
    </li>
    <li>
      {{ $t("guarantordocuments.warning-need-residency-documents.list2") }}
    </li>
    <li>
      {{ $t("guarantordocuments.warning-need-residency-documents.list3") }}
    </li>
  </ul>
  {{ $t("guarantordocuments.warning-need-residency-documents.p2") }}
</ConfirmModal>
</div>
</template>

<script setup lang="ts">
import GuarantorIdentification from "./documents/naturalGuarantor/GuarantorIdentification.vue";
import GuarantorName from "./documents/naturalGuarantor/GuarantorName.vue";
import RepresentativeIdentification from "./documents/legalPersonGuarantor/RepresentativeIdentification.vue";
import CorporationIdentification from "./documents/legalPersonGuarantor/CorporationIdentification.vue";
import OrganismCert from "./documents/organismGuarantor/OrganismCert.vue";
import GuarantorResidency from "./documents/naturalGuarantor/GuarantorResidency.vue";
import GuarantorProfessional from "./documents/naturalGuarantor/GuarantorProfessional.vue";
import GuarantorFinancial from "./documents/naturalGuarantor/GuarantorFinancial.vue";
import GuarantorTax from "./documents/naturalGuarantor/GuarantorTax.vue";
import ConfirmModal from "df-shared-next/src/components/ConfirmModal.vue";
import GuarantorFooter from "./footer/GuarantorFooter.vue";
import { DocumentService } from "@/services/DocumentService";
import { UtilsService } from "@/services/UtilsService";
import { AnalyticsService } from "@/services/AnalyticsService";
import useTenantStore from "@/stores/tenant-store";
import { computed, onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";
import { ToastService } from "@/services/ToastService";

const store = useTenantStore();
const guarantor = computed(() => {
  return store.guarantor;
});
const user = computed(() => {
  return store.user;
});

const props = withDefaults(
defineProps<{
  substep: number;
}>(),
{
  substep: 0,
}
);

const router = useRouter();

const tmpGuarantorType = ref("");
const changeGuarantorVisible = ref(false);
const showNbDocumentsResidency = ref(false);

onBeforeMount(() => {
  const currentGuarantor = guarantor.value?.typeGuarantor
  ? guarantor.value
  : UtilsService.getLastAddedGuarantor(user.value);
  store.setSelectedGuarantor(currentGuarantor);
  tmpGuarantorType.value = currentGuarantor?.typeGuarantor as string;
})

function updateSubstep(s: number) {
  router.push({
    name: "GuarantorDocuments",
    params: { substep: props.substep === s ? "0" : s.toString() },
  });
}

function validSelect() {
  store.deleteAllGuarantors().then(
  () => {
    changeGuarantorVisible.value = false;
    if (!user.value.guarantors.length || 0 >= 1) {
      router.push({ name: "GuarantorChoice" });
    }
  },
  () => {
    ToastService.error();
  }
  );
}

function undoSelect() {
  tmpGuarantorType.value = guarantor.value?.typeGuarantor || "";
  changeGuarantorVisible.value = false;
}

function goBack() {
  if (props.substep > 0) {
    router.push({
      name: "GuarantorDocuments",
      params: { substep: (props.substep - 1).toString() },
    });
  } else {
    router.push({
      name: "GuarantorList",
    });
  }
}

function goNext() {
  showNbDocumentsResidency.value = false
  updateSubstep(props.substep + 1);
}

function nextStep() {
  router.push({
    name: "GuarantorList",
  });
}

function checkResidencyAndGoNext() {
  const docs = DocumentService.getGuarantorDocs(guarantor.value, "RESIDENCY");
  if (docs.length === 1) {
    const d = docs[0];
    if (d.subCategory === "GUEST") {
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
  showNbDocumentsResidency.value = false;
  goNext();
}

</script>

<style scoped lang="scss">
@import "df-shared-next/src/scss/_variables.scss";

h2 {
  font-size: 1rem;
  margin: 0.5rem;
  display: inline-block;
  align-self: center;
}

.icon {
  align-self: center;
}

.document-title {
  border: 1px solid #ececec;
  border-radius: 5px;
  margin-bottom: 5px;
  cursor: pointer;
  display: flex;
}

.selected {
  background-color: $secondary;
}

.check {
  padding: 0.5rem;
  margin-left: auto;
  color: green;
}

.buttons {
  justify-content: space-between;
}

.guarantorselected {
  background-color: $light-blue-transparent;
}

.title-bar {
  display: flex;
  align-items: center;
  span {
    padding: 0.5rem;
    line-height: 1rem;
  }
}

.btn-group {
  width: fit-content;
}

h2 {
  line-height: 1.5rem;
}

.remark {
  background-color: #e5e5f4;
  padding: 1rem;
  border-radius: 0.25rem;
}

.card {
  padding: 1rem;
}

.card-container {
  @media all and (min-width: 992px) {
    width: fit-content;
  }
}

.small-font {
  font-size: 14px;
}
</style>
