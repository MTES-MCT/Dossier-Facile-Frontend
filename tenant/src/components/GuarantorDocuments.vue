<template>
  <div class="fr-mb-15w">
    <div>
      <div v-if="guarantor.typeGuarantor === 'NATURAL_PERSON'">
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
      <div v-if="guarantor.typeGuarantor === 'ORGANISM'">
        <OrganismCert :guarantor="guarantor"></OrganismCert>
        <GuarantorFooter
          @on-back="goBack"
          @on-next="nextStep"
        ></GuarantorFooter>
      </div>
      <div v-if="guarantor.typeGuarantor === 'LEGAL_PERSON'">
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

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import GuarantorIdentification from "./documents/naturalGuarantor/GuarantorIdentification.vue";
import GuarantorName from "./documents/naturalGuarantor/GuarantorName.vue";
import RepresentativeIdentification from "./documents/legalPersonGuarantor/RepresentativeIdentification.vue";
import CorporationIdentification from "./documents/legalPersonGuarantor/CorporationIdentification.vue";
import OrganismCert from "./documents/organismGuarantor/OrganismCert.vue";
import GuarantorResidency from "./documents/naturalGuarantor/GuarantorResidency.vue";
import GuarantorProfessional from "./documents/naturalGuarantor/GuarantorProfessional.vue";
import GuarantorFinancial from "./documents/naturalGuarantor/GuarantorFinancial.vue";
import GuarantorTax from "./documents/naturalGuarantor/GuarantorTax.vue";
import { mapGetters, mapState } from "vuex";
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
import { UtilsService } from "@/services/UtilsService";
import { AnalyticsService } from "@/services/AnalyticsService";

@Component({
  components: {
    DfButton,
    GuarantorName,
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
      user: "user",
    }),
    ...mapGetters({
      guarantor: "guarantor",
      guarantors: "guarantors",
    }),
  },
})
export default class GuarantorDocuments extends Vue {
  @Prop({ default: 0 }) substep!: number;
  user!: User;
  guarantor!: Guarantor;
  guarantors!: Guarantor[];
  tmpGuarantorType!: string;
  changeGuarantorVisible = false;
  showNbDocumentsResidency = false;

  beforeMount() {
    const currentGuarantor = this.guarantor.typeGuarantor
      ? this.guarantor
      : UtilsService.getLastAddedGuarantor(this.user);
    this.$store.commit("setSelectedGuarantor", currentGuarantor);
    this.tmpGuarantorType = currentGuarantor?.typeGuarantor as string;
  }

  updateSubstep(s: number) {
    this.$router.push({
      name: "GuarantorDocuments",
      params: { substep: this.substep === s ? "0" : s.toString() },
    });
  }

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
    this.tmpGuarantorType = this.guarantor.typeGuarantor || "";
    this.changeGuarantorVisible = false;
  }

  goBack() {
    if (this.substep > 0) {
      this.$router.push({
        name: "GuarantorDocuments",
        params: { substep: (this.substep - 1).toString() },
      });
    } else {
      this.$router.push({
        name: "GuarantorList",
      });
    }
  }

  goNext() {
    this.updateSubstep(this.substep + 1);
  }

  nextStep() {
    this.$router.push({
      name: "GuarantorList",
    });
  }

  checkResidencyAndGoNext() {
    const docs = DocumentService.getGuarantorDocs(this.guarantor, "RESIDENCY");
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

  cancelAndgoNext() {
    AnalyticsService.forceMissingResidencyDocument();
    this.goNext();
  }

  addNaturalGuarantor() {
    this.$store.dispatch("addNaturalGuarantor");
  }

  hasOneNaturalGuarantor() {
    return (
      this.guarantors.length === 1 &&
      this.guarantors[0].typeGuarantor === "NATURAL_PERSON"
    );
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
