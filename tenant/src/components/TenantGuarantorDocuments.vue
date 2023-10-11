<template>
  <div class="fr-mb-15w">
    <div>
      <div v-if="selectedGuarantor.typeGuarantor === 'NATURAL_PERSON'">
        <div v-if="substep === 0">
          <TenantGuarantorName
            :tenantId="tenantId"
            :guarantor="selectedGuarantor"
            @on-back="goBack"
            @on-next="goNext"
          ></TenantGuarantorName>
        </div>
        <div v-if="substep === 1">
          <GuarantorIdentification
            :isCotenant="true"
            :tenantId="tenantId"
          ></GuarantorIdentification>
          <GuarantorFooter
            @on-back="goBack"
            @on-next="goNext"
          ></GuarantorFooter>
        </div>
        <div v-if="substep === 2">
          <GuarantorResidency
            :tenantId="tenantId"
            @on-back="goBack"
            @on-next="checkResidencyAndGoNext"
          ></GuarantorResidency>
        </div>
        <div v-if="substep === 3">
          <GuarantorProfessional
            :tenantId="tenantId"
            :isCotenant="true"
          ></GuarantorProfessional>
          <GuarantorFooter
            @on-back="goBack"
            @on-next="goNext"
          ></GuarantorFooter>
        </div>
        <div v-if="substep === 4">
          <GuarantorFinancial
            :tenantId="tenantId"
            @on-back="goBack"
            @on-next="goNext"
          ></GuarantorFinancial>
        </div>
        <div v-if="substep === 5">
          <GuarantorTax
            :tenantId="tenantId"
            :isCotenant="true"
            @on-back="goBack"
            @on-next="nextStep"
          ></GuarantorTax>
        </div>
      </div>
      <div v-if="selectedGuarantor.typeGuarantor === 'ORGANISM'">
        <OrganismCert
          :is-cotenant="true"
          :guarantor="selectedGuarantor"
          :tenantId="tenantId"
        ></OrganismCert>
        <GuarantorFooter
          @on-back="goBack"
          @on-next="nextStep"
        ></GuarantorFooter>
      </div>
      <div v-if="selectedGuarantor.typeGuarantor === 'LEGAL_PERSON'">
        <div v-if="substep === 0">
          <CorporationIdentification
            :tenantId="tenantId"
            :guarantor="selectedGuarantor"
            @on-back="goBack"
            @on-next="goNext"
          ></CorporationIdentification>
        </div>
        <div v-if="substep === 1">
          <RepresentativeIdentification
            :tenantId="tenantId"
            :guarantor="selectedGuarantor"
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
      <span>{{ $t("tenantguarantordocuments.will-delete-guarantor") }}</span>
    </ConfirmModal>
    <ConfirmModal
      v-if="showNbDocumentsResidency"
      :validate-btn-text="$t('add-new-documents')"
      :cancel-btn-text="$t('next-step')"
      @cancel="cancelAndGoNext()"
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

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import TenantGuarantorName from "./documents/naturalGuarantor/TenantGuarantorName.vue";
import RepresentativeIdentification from "./documents/legalPersonGuarantor/RepresentativeIdentification.vue";
import CorporationIdentification from "./documents/legalPersonGuarantor/CorporationIdentification.vue";
import OrganismCert from "./documents/organismGuarantor/OrganismCert.vue";
import GuarantorIdentification from "./documents/naturalGuarantor/GuarantorIdentification.vue";
import GuarantorResidency from "./documents/naturalGuarantor/GuarantorResidency.vue";
import GuarantorProfessional from "./documents/naturalGuarantor/GuarantorProfessional.vue";
import GuarantorFinancial from "./documents/naturalGuarantor/GuarantorFinancial.vue";
import GuarantorTax from "./documents/naturalGuarantor/GuarantorTax.vue";
import { mapState } from "vuex";
import { Guarantor } from "df-shared/src/models/Guarantor";
import { User } from "df-shared/src/models/User";
import DfButton from "df-shared/src/Button/Button.vue";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";
import VGouvFrButton from "df-shared/src/Button/v-gouv-fr-button/VGouvFrButton.vue";
import GuarantorFooter from "./footer/GuarantorFooter.vue";
import GuarantorChoiceHelp from "./helps/GuarantorChoiceHelp.vue";
import VGouvFrModal from "df-shared/src/GouvFr/v-gouv-fr-modal/VGouvFrModal.vue";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import ProfileContainer from "./ProfileContainer.vue";
import { DocumentService } from "@/services/DocumentService";
import { AnalyticsService } from "@/services/AnalyticsService";

@Component({
  components: {
    DfButton,
    TenantGuarantorName,
    GuarantorTax,
    GuarantorFinancial,
    GuarantorProfessional,
    GuarantorResidency,
    GuarantorIdentification,
    RepresentativeIdentification,
    CorporationIdentification,
    OrganismCert,
    ConfirmModal,
    VGouvFrButton,
    GuarantorFooter,
    GuarantorChoiceHelp,
    VGouvFrModal,
    NakedCard,
    ProfileContainer,
  },
  computed: {
    ...mapState({
      coTenants: "coTenants",
      selectedGuarantor: "selectedGuarantor",
    }),
  },
})
export default class TenantGuarantorDocuments extends Vue {
  @Prop({ default: 0 }) substep!: number;
  @Prop() guarantorId!: number;
  @Prop() tenantId!: number;

  user!: User;
  coTenants!: User[];
  selectedGuarantor!: Guarantor;
  tmpGuarantorType = "";
  changeGuarantorVisible = false;
  showNbDocumentsResidency = false;

  validSelect() {
    this.$store.dispatch("deleteAllGuarantors").then(
      () => {
        this.changeGuarantorVisible = false;
        if (!this.user.guarantors.length || 0 >= 1) {
          this.$router.push({ name: "GuarantorChoice" });
        }
      },
      () => {
        Vue.toasted.global.error();
      }
    );
  }

  undoSelect() {
    this.tmpGuarantorType = this.selectedGuarantor.typeGuarantor || "";
    this.changeGuarantorVisible = false;
  }

  goBack() {
    if (this.substep > 0) {
      this.$router.push({
        name: "TenantGuarantorDocuments",
        params: {
          step: this.$route.params.step,
          substep: (this.substep - 1).toString(),
          tenantId: this.$route.params.tenantId,
          guarantorId: this.$route.params.guarantorId,
        },
      });
    } else {
      this.$emit("on-next");
    }
  }

  checkResidencyAndGoNext() {
    const docs = DocumentService.getGuarantorDocs(
      this.selectedGuarantor,
      "RESIDENCY"
    );
    if (docs.length === 1) {
      const d = docs[0];
      if (d.subCategory === "GUEST") {
        const nbPages = d.files?.reduce(
          (s, a) => s + (a.numberOfPages || 0),
          0
        );
        if ((nbPages || 0) < 3) {
          this.showNbDocumentsResidency = true;
          AnalyticsService.missingResidencyDocumentDetected();
          return;
        }
      }
    }
    this.goNext();
  }

  cancelAndGoNext() {
    AnalyticsService.forceMissingResidencyDocument();
    this.goNext();
  }

  goNext() {
    this.$router.push({
      name: "TenantGuarantorDocuments",
      params: {
        step: this.$route.params.step,
        substep: (this.substep + 1).toString(),
        tenantId: this.$route.params.tenantId,
        guarantorId: this.$route.params.guarantorId,
      },
    });
  }

  nextStep() {
    this.$emit("on-next");
  }
}
</script>

<style scoped lang="scss">
@import "df-shared/src/scss/_variables.scss";

h2 {
  font-size: 1rem;
  margin: 0.5rem;
  display: inline-block;
  align-self: center;
  line-height: 1.5rem;
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
