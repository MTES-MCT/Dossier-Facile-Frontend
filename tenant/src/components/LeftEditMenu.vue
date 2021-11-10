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
              :to="{ name: 'TenantDocuments', params: { substep: '1' } }"
              ><ColoredTag
                :text="$t('identification')"
                :status="tenantStatus('IDENTITY')"
                :active="getTenantCurrentStep(1)"
              ></ColoredTag
            ></router-link>
          </div>
          <div class="ml-5">
            <router-link
              :to="{ name: 'TenantDocuments', params: { substep: '2' } }"
              ><ColoredTag
                :text="$t('residency')"
                :status="tenantStatus('RESIDENCY')"
                :active="getTenantCurrentStep(2)"
              ></ColoredTag
            ></router-link>
          </div>
          <div class="ml-5">
            <router-link
              :to="{ name: 'TenantDocuments', params: { substep: '3' } }"
              ><ColoredTag
                :text="$t('professional')"
                :status="tenantStatus('PROFESSIONAL')"
                :active="getTenantCurrentStep(3)"
              ></ColoredTag
            ></router-link>
          </div>
          <div class="ml-5">
            <router-link
              :to="{ name: 'TenantDocuments', params: { substep: '4' } }"
              ><ColoredTag
                :text="$t('financial')"
                :status="tenantStatus('FINANCIAL')"
                :active="getTenantCurrentStep(4)"
              ></ColoredTag
            ></router-link>
          </div>
          <div class="ml-5">
            <router-link
              :to="{ name: 'TenantDocuments', params: { substep: '5' } }"
              ><ColoredTag
                :text="$t('tax')"
                :status="tenantStatus('TAX')"
                :active="getTenantCurrentStep(5)"
              ></ColoredTag
            ></router-link>
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
                :to="{ name: 'GuarantorDocuments', params: { substep: '1' } }"
                ><ColoredTag
                  :text="$t('identification')"
                  :status="guarantorStatus('IDENTITY')"
                  :active="getGuarantorCurrentStep(1)"
                ></ColoredTag
              ></router-link>
            </div>
            <div class="ml-5">
              <router-link
                :to="{ name: 'GuarantorDocuments', params: { substep: '2' } }"
                ><ColoredTag
                  :text="$t('residency')"
                  :status="guarantorStatus('RESIDENCY')"
                  :active="getGuarantorCurrentStep(2)"
                ></ColoredTag
              ></router-link>
            </div>
            <div class="ml-5">
              <router-link
                :to="{ name: 'GuarantorDocuments', params: { substep: '3' } }"
                ><ColoredTag
                  :text="$t('professional')"
                  :status="guarantorStatus('PROFESSIONAL')"
                  :active="getGuarantorCurrentStep(3)"
                ></ColoredTag
              ></router-link>
            </div>
            <div class="ml-5">
              <router-link
                :to="{ name: 'GuarantorDocuments', params: { substep: '4' } }"
                ><ColoredTag
                  :text="$t('financial')"
                  :status="guarantorStatus('FINANCIAL')"
                  :active="getGuarantorCurrentStep(4)"
                ></ColoredTag
              ></router-link>
            </div>
            <div class="ml-5">
              <router-link
                :to="{ name: 'GuarantorDocuments', params: { substep: '5' } }"
                ><ColoredTag
                  :text="$t('tax')"
                  :status="guarantorStatus('TAX')"
                  :active="getGuarantorCurrentStep(5)"
                ></ColoredTag
              ></router-link>
            </div>
          </div>
          <div v-if="selectedGuarantor.typeGuarantor === 'LEGAL_PERSON'">
            <div class="ml-5">
              <router-link
                :to="{ name: 'GuarantorDocuments', params: { substep: '0' } }"
                ><ColoredTag
                  :text="$t('identification-legal-person')"
                  :status="guarantorStatus('IDENTIFICATION_LEGAL_PERSON')"
                  :active="getGuarantorCurrentStep(0)"
                ></ColoredTag
              ></router-link>
            </div>
            <div class="ml-5">
              <router-link
                :to="{ name: 'GuarantorDocuments', params: { substep: '1' } }"
                ><ColoredTag
                  :text="$t('identity-represent')"
                  :status="guarantorStatus('IDENTIFICATION')"
                  :active="getGuarantorCurrentStep(1)"
                ></ColoredTag
              ></router-link>
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
import StatusIcon from "df-shared/src/components/StatusIcon.vue";
import ColoredTag from "df-shared/src/components/ColoredTag.vue";

@Component({
  components: { StatusIcon, ColoredTag },
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

  guarantorStatus(documentType: string) {
    switch (documentType) {
      case "IDENTITY":
        return DocumentService.getGuarantorIdentityStatus() || "EMPTY";
      case "RESIDENCY":
        return DocumentService.getGuarantorResidencyStatus() || "EMPTY";
      case "PROFESSIONAL":
        return DocumentService.getGuarantorProfessionalStatus() || "EMPTY";
      case "FINANCIAL":
        return DocumentService.getGuarantorFinancialStatus() || "EMPTY";
      case "TAX":
        return DocumentService.getGuarantorTaxStatus() || "EMPTY";
      case "IDENTIFICATION_LEGAL_PERSON":
        return (
          DocumentService.getGuarantorLegalPersonIdentityStatus() || "EMPTY"
        );
      case "IDENTIFICATION":
        return (
          DocumentService.getGuarantorLegalPersonRepresentantStatus() || "EMPTY"
        );
    }
    return "EMPTY";
  }

  tenantStatus(documentType: string) {
    switch (documentType) {
      case "IDENTITY":
        return DocumentService.getTenantIdentityStatus() || "EMPTY";
      case "RESIDENCY":
        return DocumentService.getTenantResidencyStatus() || "EMPTY";
      case "PROFESSIONAL":
        return DocumentService.getTenantProfessionalStatus() || "EMPTY";
      case "FINANCIAL":
        return DocumentService.getTenantFinancialStatus() || "EMPTY";
      case "TAX":
        return DocumentService.getTenantTaxStatus() || "EMPTY";
    }
    return "EMPTY";
  }

  getTenantCurrentStep(substep: number): boolean {
    const s = Number(this.$route.params.substep) || 0;
    return this.step === 2 && s === substep;
  }

  getGuarantorCurrentStep(substep: number): boolean {
    const s = Number(this.$route.params.substep) || 0;
    return this.step === 3 && s === substep;
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

.fr-link {
  width: fit-content;
  color: var(--g800-plain);
  font-size: 14px;
}

[href] {
  box-shadow: none;
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
