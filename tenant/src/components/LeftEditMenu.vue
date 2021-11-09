<template>
  <div class="left-edit-menu">
    <div class="inner-left-edit fr-mt-7w">
      <div class="active step">
        <div class="step-number">1</div>
        <div class="step-title">
          <router-link :to="{ name: 'TenantName' }" class="fr-link">
            Je renseigne mes informations</router-link
          >
        </div>
      </div>
      <div class="vline" :class="getClass(0)"></div>
      <div class="step" :class="getClass(1)">
        <div class="step-number">2</div>
        <div class="step-title">
          <router-link
            class="fr-link"
            :to="{ name: 'TenantDocuments', params: { substep: '1' } }"
            >Je joins mes documents</router-link
          >
        </div>
      </div>
      <div class="vline" :class="getClass(1)">
        <div v-if="step === 2">
          <div class="ml-5">
            <router-link
              class="fr-tag"
              :class="getTenantIdentityClass()"
              :to="{ name: 'TenantDocuments', params: { substep: '1' } }"
              ><StatusIcon :status="tenantStatus('IDENTITY')"></StatusIcon
              >{{ $t("identification") }}</router-link
            >
          </div>
          <div class="ml-5">
            <router-link
              class="fr-tag"
              :class="getTenantResidencyClass()"
              :to="{ name: 'TenantDocuments', params: { substep: '2' } }"
              ><StatusIcon :status="tenantStatus('RESIDENCY')"></StatusIcon
              >{{ $t("residency") }}</router-link
            >
          </div>
          <div class="ml-5">
            <router-link
              class="fr-tag"
              :class="getTenantProfessionalClass()"
              :to="{ name: 'TenantDocuments', params: { substep: '3' } }"
              ><StatusIcon :status="tenantStatus('PROFESSIONAL')"></StatusIcon
              >{{ $t("professional") }}</router-link
            >
          </div>
          <div class="ml-5">
            <router-link
              class="fr-tag"
              :class="getTenantFinancialClass()"
              :to="{ name: 'TenantDocuments', params: { substep: '4' } }"
              ><StatusIcon :status="tenantStatus('FINANCIAL')"></StatusIcon
              >{{ $t("financial") }}</router-link
            >
          </div>
          <div class="ml-5">
            <router-link
              class="fr-tag"
              :class="getTenantTaxClass()"
              :to="{ name: 'TenantDocuments', params: { substep: '5' } }"
              ><StatusIcon :status="tenantStatus('TAX')"></StatusIcon
              >{{ $t("tax") }}</router-link
            >
          </div>
        </div>
      </div>
      <div class="step" :class="getClass(2)">
        <div class="step-number">3</div>
        <div class="step-title">
          <router-link class="fr-link" :to="{ name: 'GuarantorChoice' }"
            >je renseigne mon garant</router-link
          >
        </div>
      </div>
      <div class="vline" :class="getClass(2)">
        <div v-if="step === 3 && selectedGuarantor && expandGuarantorMenu">
          <div v-if="selectedGuarantor.typeGuarantor === 'NATURAL_PERSON'">
            <div class="ml-5">
              <router-link
                class="fr-tag"
                :class="getGuarantorIdentityClass()"
                :to="{ name: 'GuarantorDocuments', params: { substep: '1' } }"
                ><StatusIcon :status="guarantorStatus('IDENTITY')"></StatusIcon
                >{{ $t("identification") }}</router-link
              >
            </div>
            <div class="ml-5">
              <router-link
                class="fr-tag"
                :class="getGuarantorResidencyClass()"
                :to="{ name: 'GuarantorDocuments', params: { substep: '2' } }"
                ><StatusIcon :status="guarantorStatus('RESIDENCY')"></StatusIcon
                >{{ $t("residency") }}</router-link
              >
            </div>
            <div class="ml-5">
              <router-link
                class="fr-tag"
                :class="getGuarantorProfessionalClass()"
                :to="{ name: 'GuarantorDocuments', params: { substep: '3' } }"
                ><StatusIcon
                  :status="guarantorStatus('PROFESSIONAL')"
                ></StatusIcon
                >{{ $t("professional") }}</router-link
              >
            </div>
            <div class="ml-5">
              <router-link
                class="fr-tag"
                :class="getGuarantorFinancialClass()"
                :to="{ name: 'GuarantorDocuments', params: { substep: '4' } }"
                ><StatusIcon :status="guarantorStatus('FINANCIAL')"></StatusIcon
                >{{ $t("financial") }}</router-link
              >
            </div>
            <div class="ml-5">
              <router-link
                class="fr-tag"
                :class="getGuarantorTaxClass()"
                :to="{ name: 'GuarantorDocuments', params: { substep: '5' } }"
                ><StatusIcon :status="guarantorStatus('TAX')"></StatusIcon
                >{{ $t("tax") }}</router-link
              >
            </div>
          </div>
          <div v-if="selectedGuarantor.typeGuarantor === 'LEGAL_PERSON'">
            <div class="ml-5">
              <router-link
                class="fr-tag"
                :class="getGuarantorLegalPersonIdentityClass()"
                :to="{ name: 'GuarantorDocuments', params: { substep: '0' } }"
                ><StatusIcon
                  :status="guarantorStatus('IDENTIFICATION_LEGAL_PERSON')"
                ></StatusIcon
                >{{ $t("identification-legal-person") }}</router-link
              >
            </div>
            <div class="ml-5">
              <router-link
                class="fr-tag"
                :class="getGuarantorLegalPersonRepresentantClass()"
                :to="{ name: 'GuarantorDocuments', params: { substep: '1' } }"
                ><StatusIcon
                  :status="guarantorStatus('IDENTIFICATION')"
                ></StatusIcon
                >{{ $t("identity-represent") }}</router-link
              >
            </div>
          </div>
        </div>
      </div>
      <div class="step" :class="getClass(3)">
        <div class="step-number">4</div>
        <div class="step-title">
          <router-link class="fr-link" :to="{ name: 'ValidateFile' }"
            >Je valide mon dossier</router-link
          >
        </div>
      </div>
      <div class="spacer"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Guarantor } from "df-shared/src/models/Guarantor";
import { Component, Prop, Vue } from "vue-property-decorator";
import { mapState } from "vuex";
import { DocumentService } from "../services/DocumentService";
import StatusIcon from "./StatusIcon.vue";

@Component({
  components: { StatusIcon },
  computed: {
    ...mapState({
      selectedGuarantor: "selectedGuarantor",
      expandGuarantorMenu: "expandGuarantorMenu"
    })
  }
})
export default class LeftEditMenu extends Vue {
  @Prop({ default: 0 }) step!: number;
  selectedGuarantor!: Guarantor;
  expandGuarantorMenu!: boolean;

  getClass(s: number) {
    if (this.getStep(s)) {
      return "active";
    }
    return "";
  }

  getLinkClass() {
    return "valid-menu-link";
  }
  guarantorStatus(documentType: string) {
    let status;
    if (documentType === "IDENTITY") {
      status = DocumentService.getGuarantorIdentityStatus();
    }
    if (documentType === "RESIDENCY") {
      status = DocumentService.getGuarantorResidencyStatus();
    }
    if (documentType === "PROFESSIONAL") {
      status = DocumentService.getGuarantorProfessionalStatus();
    }
    if (documentType === "FINANCIAL") {
      status = DocumentService.getGuarantorFinancialStatus();
    }
    if (documentType === "TAX") {
      status = DocumentService.getGuarantorTaxStatus();
    }
    return status || "TODO";
  }
  tenantStatus(documentType: string) {
    let status;
    if (documentType === "IDENTITY") {
      status = DocumentService.getTenantIdentityStatus();
    }
    if (documentType === "RESIDENCY") {
      status = DocumentService.getTenantResidencyStatus();
    }
    if (documentType === "PROFESSIONAL") {
      status = DocumentService.getTenantProfessionalStatus();
    }
    if (documentType === "FINANCIAL") {
      status = DocumentService.getTenantFinancialStatus();
    }
    if (documentType === "TAX") {
      status = DocumentService.getTenantTaxStatus();
    }
    return status || "TODO";
  }
  getTenantIdentityClass() {
    const status = DocumentService.getTenantIdentityStatus();
    return this.getClassByStatus(status) + this.getTenantCurrentStep(1);
  }

  getTenantResidencyClass() {
    const status = DocumentService.getTenantResidencyStatus();
    return this.getClassByStatus(status) + this.getTenantCurrentStep(2);
  }

  getTenantProfessionalClass() {
    const status = DocumentService.getTenantProfessionalStatus();
    return this.getClassByStatus(status) + this.getTenantCurrentStep(3);
  }

  getTenantFinancialClass() {
    const status = DocumentService.getTenantFinancialStatus();
    return this.getClassByStatus(status) + this.getTenantCurrentStep(4);
  }

  getTenantTaxClass() {
    const status = DocumentService.getTenantTaxStatus();
    return this.getClassByStatus(status) + this.getTenantCurrentStep(5);
  }

  getTenantCurrentStep(substep: number) {
    const s = Number(this.$route.params.substep) || 0;
    return this.step === 2 && s === substep ? " current-step" : "";
  }

  getGuarantorCurrentStep(substep: number) {
    const s = Number(this.$route.params.substep) || 0;
    return this.step === 3 && s === substep ? " current-step" : "";
  }

  getClassByStatus(status: string) {
    switch (status) {
      case "VALIDATED":
        return "valid-menu-link";
      case "TO_PROCESS":
        return "to-process-menu-link";
      case "DECLINED":
        return "declined-menu-link";
      case "FILLED":
        return "filled-menu-link";
    }
    return "empty-menu-link";
  }

  getStep(s: number) {
    switch (this.step) {
      case 0:
      case 1:
        return s <= 0;
      case 2:
        return s <= 1;
      case 3:
        return s <= 2;
      case 4:
        return s <= 3;
      default:
        return s <= 0;
    }
  }

  getGuarantorIdentityClass() {
    const status = DocumentService.getGuarantorIdentityStatus();
    return this.getClassByStatus(status) + this.getGuarantorCurrentStep(1);
  }

  getGuarantorResidencyClass() {
    const status = DocumentService.getGuarantorResidencyStatus();
    return this.getClassByStatus(status) + this.getGuarantorCurrentStep(2);
  }

  getGuarantorProfessionalClass() {
    const status = DocumentService.getGuarantorProfessionalStatus();
    return this.getClassByStatus(status) + this.getGuarantorCurrentStep(3);
  }

  getGuarantorFinancialClass() {
    const status = DocumentService.getGuarantorFinancialStatus();
    return this.getClassByStatus(status) + this.getGuarantorCurrentStep(4);
  }

  getGuarantorTaxClass() {
    const status = DocumentService.getGuarantorTaxStatus();
    return this.getClassByStatus(status) + this.getGuarantorCurrentStep(5);
  }

  getGuarantorLegalPersonIdentityClass() {
    const status = DocumentService.getGuarantorLegalPersonIdentityStatus();
    return this.getClassByStatus(status) + this.getGuarantorCurrentStep(0);
  }

  getGuarantorLegalPersonRepresentantClass() {
    const status = DocumentService.getGuarantorLegalPersonRepresentantStatus();
    return this.getClassByStatus(status) + this.getGuarantorCurrentStep(1);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "df-shared/src/scss/_variables.scss";

.left-edit-menu {
  background-color: var(--w);
  @media all and (max-width: 768px) {
    display: none;
  }
}

.inner-left-edit {
  min-height: 300px;
  height: 100%;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding-left: 10px;
}

.vline {
  margin-left: 23px;
  border-left: 1px solid var(--g400-t);
  z-index: 0;
  min-height: 25px;
  &.active {
    border-left: 1px solid var(--primary);
  }
}

.step {
  display: flex;
  align-items: center;
  height: 3rem;
}

.step-number {
  background-color: white;
  border: 1px solid var(--g400-t);
  margin: 0 5px;
  border-radius: 50%;
  height: 2.25rem;
  width: 2.25rem;
  min-width: 2.25rem;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.active .step-number {
  background-color: var(--primary);
  color: white;
}

.step-title {
  padding: 5px 5px 0;
}

.hidden {
  visibility: hidden;
}

.ml-5 {
  margin-left: -1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.fr-tag.valid-menu-link {
  background-color: #e7f5ef;
  color: #169b62;
  &.current-step {
    border: 1px solid #169b62;
  }
}

.fr-tag.to-process-menu-link {
  background-color: #fcf3ef;
  color: #ff9940;
  &.current-step {
    border: 1px solid #ff9940;
  }
}

.fr-tag.declined-menu-link {
  background-color: #fce5e7;
  color: #e10600;
  &.current-step {
    border: 1px solid #e10600;
  }
}

.fr-tag.empty-menu-link {
  background-color: var(--bf200-bf300);
  color: var(--primary);
  &.current-step {
    background-color: var(--w);
    border: 1px solid #e5e5f4;
  }
}

.fr-tag.filled-menu-link {
  background-color: var(--bf200-bf300);
  color: var(--focus);
  &.current-step {
    border: 1px solid #e5e5f4;
  }
}

.fr-tag,
.fr-link {
  width: fit-content;
  color: var(--g800-plain);
  font-size: 14px;
}
</style>

<i18n>
{
"en": {
},
"fr": {
}
}
</i18n>
