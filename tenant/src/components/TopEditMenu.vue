<template>
  <div class="top-edit-menu">
    <div class="inner-top-edit fr-mt-2w">
      <div class="hline hidden"></div>
      <div class="active step">
        <router-link :to="{ name: 'TenantName' }">
          <step-number number="1"></step-number>
        </router-link>
      </div>
      <div class="hline" :class="getClass(0)"></div>
      <div class="step" :class="getClass(1)">
        <router-link
          :to="{ name: 'TenantDocuments', params: { substep: '1' } }"
        >
          <step-number number="2" active="getStep(1)"></step-number>
        </router-link>
      </div>
      <div class="hline" :class="getClass(1)"></div>
      <div class="step" :class="getClass(2)">
        <router-link :to="{ name: 'GuarantorChoice' }">
          <step-number number="3" active="getStep(2)"></step-number>
        </router-link>
      </div>
      <div class="hline" :class="getClass(2)"></div>
      <div class="step" :class="getClass(3)">
        <router-link :to="{ name: 'ValidateFile' }">
          <step-number number="4" active="getStep(3)"></step-number>
        </router-link>
      </div>
      <div class="hline hidden"></div>
    </div>
    <div>
      <div class="step-title">
        <router-link :to="{ name: 'TenantName' }" v-if="step <= 1">
          Mes informations personnelles</router-link
        >
        <router-link
          :to="{ name: 'TenantDocuments', params: { substep: '1' } }"
          v-if="step === 2"
          >Je joins mes documents</router-link
        >
        <router-link :to="{ name: 'GuarantorChoice' }" v-if="step === 3"
          >Je renseigne mon garant</router-link
        >
        <router-link :to="{ name: 'GuarantorChoice' }" v-if="step === 4"
          >Je valide mon dossier</router-link
        >
      </div>
    </div>
    <div class="menu-grid-row" v-if="step === 2">
      <div class="ml-5">
        <router-link
          class="fr-link"
          :class="getTenantIdentityClass()"
          :to="{ name: 'TenantDocuments', params: { substep: '1' } }"
          >{{ $t("identity") }}</router-link
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
</template>

<script lang="ts">
import StepNumber from "df-shared/src/components/StepNumber.vue";
import { Component, Prop, Vue } from "vue-property-decorator";
import { DocumentService } from "../services/DocumentService";

@Component({
  components: { StepNumber }
})
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

.top-edit-menu {
  white-space: nowrap;
  background-color: var(--w);
  @media all and (min-width: 769px) {
    display: none;
  }
}

.inner-top-edit {
  width: 100%;
  display: flex;
  flex-direction: row;
  overflow: scroll;
  justify-content: space-around;
}

.step {
  display: flex;
  align-items: center;
  height: 4rem;
}

.step-title {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-bottom: 1.5rem;
  padding-top: 0.5rem;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}

.hidden {
  visibility: hidden;
}

.ml-5 {
  margin-left: -1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.valid-menu-link {
  background-color: #e3ebd3;
  color: var(--success);
  &:before {
    content: "\2713";
    display: inline-block;
    padding: 0 6px 0 0;
  }
}

.to-process-menu-link {
  background-color: var(--bf200-bf300);
  color: var(--focus);
  &:before {
    content: "\2192";
    display: inline-block;
    padding: 0 6px 0 0;
  }
}

.declined-menu-link {
  background-color: var(--rm300);
  color: var(--error);
  &:before {
    content: "\00d7";
    display: inline-block;
    padding: 0 6px 0 0;
  }
}

.empty-menu-link {
  background-color: var(--bf200-bf300);
  color: var(--focus);
  &:before {
    content: "\2192";
    display: inline-block;
    padding: 0 6px 0 0;
  }
}

.menu-grid-row {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  overflow: scroll;
}

[href] {
  box-shadow: none;
}

.hline {
  flex: 1;
  border-bottom: 1px solid var(--g400-t);
  z-index: 0;
  min-width: 25px;
  height: 2rem;
  &.active {
    border-bottom: 1px solid var(--primary);
  }
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
