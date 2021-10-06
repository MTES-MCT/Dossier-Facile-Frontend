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
              class="fr-link"
              :class="getTenantIdentityClass()"
              :to="{ name: 'TenantDocuments', params: { substep: '1' } }"
              >{{ $t("identification") }}</router-link
            >
          </div>
          <div class="ml-5">
            <router-link
              class="fr-link"
              :class="getTenantResidencyClass()"
              :to="{ name: 'TenantDocuments', params: { substep: '2' } }"
              >{{ $t("residency") }}</router-link
            >
          </div>
          <div class="ml-5">
            <router-link
              class="fr-link"
              :class="getTenantProfessionalClass()"
              :to="{ name: 'TenantDocuments', params: { substep: '3' } }"
              >{{ $t("professional") }}</router-link
            >
          </div>
          <div class="ml-5">
            <router-link
              class="fr-link"
              :class="getTenantFinancialClass()"
              :to="{ name: 'TenantDocuments', params: { substep: '4' } }"
              >{{ $t("financial") }}</router-link
            >
          </div>
          <div class="ml-5">
            <router-link
              class="fr-link"
              :class="getTenantTaxClass()"
              :to="{ name: 'TenantDocuments', params: { substep: '5' } }"
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
      <div class="vline" :class="getClass(2)"></div>
      <div class="step" :class="getClass(3)">
        <div class="step-number">4</div>
        <div class="step-title">je valide mon dossier</div>
      </div>
      <div class="spacer"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { DocumentService } from "../services/DocumentService";

@Component
export default class LeftEditMenu extends Vue {
  @Prop({ default: 0 }) step!: number;

  getClass(s: number) {
    if (this.getStep(s)) {
      return "active";
    }
    return "";
  }

  getLinkClass() {
    return "valid-menu-link";
  }

  getTenantIdentityClass() {
    const status = DocumentService.getTenantIdentityStatus();
    return this.getClassByStatus(status);
  }

  getTenantResidencyClass() {
    const status = DocumentService.getTenantResidencyStatus();
    return this.getClassByStatus(status);
  }

  getTenantProfessionalClass() {
    const status = DocumentService.getTenantProfessionalStatus();
    return this.getClassByStatus(status);
  }

  getTenantFinancialClass() {
    const status = DocumentService.getTenantFinancialStatus();
    return this.getClassByStatus(status);
  }

  getTenantTaxClass() {
    const status = DocumentService.getTenantTaxStatus();
    return this.getClassByStatus(status);
  }

  getClassByStatus(status: string) {
    switch (status) {
      case "VALIDATED":
        return "valid-menu-link";
      case "TO_PROCESS":
        return "to-process-menu-link";
      case "DECLINED":
        return "declined-menu-link";
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
  margin-left: 17px;
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
  display: inline-block;
  height: 25px;
  width: 25px;
  min-width: 25px;
  text-align: center;
  z-index: 1;
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

.fr-link.valid-menu-link {
  background-color: #e3ebd3;
  color: var(--success);
  &:before {
    content: "\2713";
    display: inline-block;
    padding: 0 6px 0 0;
  }
}

.fr-link.to-process-menu-link {
  background-color: var(--bf200-bf300);
  color: var(--focus);
  &:before {
    content: "\2192";
    display: inline-block;
    padding: 0 6px 0 0;
  }
}

.fr-link.declined-menu-link {
  background-color: var(--rm300);
  color: var(--error);
  &:before {
    content: "\00d7";
    display: inline-block;
    padding: 0 6px 0 0;
  }
}

.fr-link.empty-menu-link {
  background-color: var(--bf200-bf300);
  color: var(--focus);
  &:before {
    content: "\2192";
    display: inline-block;
    padding: 0 6px 0 0;
  }
}

.fr-link {
  width: fit-content;
  color: var(--g800-plain);
  font-size: 14px;
}
</style>

<i18n>
{
"en": {
		"identification": "Identification",
		"professional": "Professional",
		"residency": "Residency",
		"financial": "Financial",
		"tax": "Tax"
},
"fr": {
		"identification": "Pièce d'identité",
		"residency": "Justificatif de domicile",
		"professional": "Justificatif de situation professionnelle",
		"financial": "Justificatif de ressources",
		"tax": "Avis d'imposition"
}
}
</i18n>
