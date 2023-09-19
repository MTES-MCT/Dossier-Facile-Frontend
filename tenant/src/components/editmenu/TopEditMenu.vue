<template>
  <div class="top-edit-menu">
    <h1 class="blue-text text-center fr-mt-1w fr-mb-1v">
      {{ getStepTitle() }}
    </h1>
    <div class="inner-top-edit fr-mb-1w">
      <div class="hline" :class="getClass(0)"></div>
      <div class="hline" :class="getClass(1)"></div>
      <div class="hline" :class="getClass(2)"></div>
      <div class="hline" :class="getClass(3)"></div>
      <div class="hline" :class="getClass(4)" v-if="isCouple()"></div>
      <div class="hline" :class="getClass(5)" v-if="isCouple()"></div>
    </div>
    <hr v-if="step === 2 || step === 3" />
    <div class="menu-grid-row" v-if="step === 2" ref="tcontainer">
      <TenantDocumentLink
        class="ml-5"
        ref="td1"
        document-type="IDENTITY"
        substep="1"
        :active="getTenantCurrentStep(1)"
      />
      <TenantDocumentLink
        class="ml-5"
        ref="td2"
        document-type="RESIDENCY"
        substep="2"
        :active="getTenantCurrentStep(2)"
      />
      <TenantDocumentLink
        class="ml-5"
        ref="td3"
        document-type="PROFESSIONAL"
        substep="3"
        :active="getTenantCurrentStep(3)"
      />
      <TenantDocumentLink
        class="ml-5"
        ref="td4"
        document-type="FINANCIAL"
        substep="4"
        :active="getTenantCurrentStep(4)"
      />
      <TenantDocumentLink
        class="ml-5"
        ref="td5"
        document-type="TAX"
        substep="5"
        :active="getTenantCurrentStep(5)"
      />
    </div>
    <h2 class="small-title" v-if="displayGuarantorName()">
      {{
        $t("topeditmenu.i-add", [
          `${selectedGuarantor.firstName} ${selectedGuarantor.lastName}`,
        ])
      }}
    </h2>
    <div v-if="step === 3 && selectedGuarantor">
      <div
        class="menu-grid-row"
        ref="gcontainer"
        v-if="
          selectedGuarantor.typeGuarantor === 'NATURAL_PERSON' &&
          selectedGuarantor.firstName !== undefined &&
          selectedGuarantor.lastName !== undefined
        "
      >
        <GuarantorDocumentLink
          class="ml-5"
          ref="gd1"
          :guarantor="selectedGuarantor"
          document-type="IDENTITY"
          substep="1"
          :active="getGuarantorCurrentStep(1, selectedGuarantor)"
        />
        <GuarantorDocumentLink
          class="ml-5"
          ref="gd2"
          :guarantor="selectedGuarantor"
          document-type="RESIDENCY"
          substep="2"
          :active="getGuarantorCurrentStep(2, selectedGuarantor)"
        />
        <GuarantorDocumentLink
          class="ml-5"
          ref="gd3"
          :guarantor="selectedGuarantor"
          document-type="PROFESSIONAL"
          substep="3"
          :active="getGuarantorCurrentStep(3, selectedGuarantor)"
        />
        <GuarantorDocumentLink
          class="ml-5"
          ref="gd4"
          :guarantor="selectedGuarantor"
          document-type="FINANCIAL"
          substep="4"
          :active="getGuarantorCurrentStep(4, selectedGuarantor)"
        />
        <GuarantorDocumentLink
          class="ml-5 mr-5"
          ref="gd5"
          :guarantor="selectedGuarantor"
          document-type="TAX"
          substep="5"
          :active="getGuarantorCurrentStep(5, selectedGuarantor)"
        />
      </div>
      <div
        class="menu-grid-row"
        ref="gcontainer"
        v-if="selectedGuarantor.typeGuarantor === 'LEGAL_PERSON'"
      >
        <GuarantorDocumentLink
          class="ml-5"
          ref="gd0"
          :guarantor="selectedGuarantor"
          document-type="IDENTIFICATION_LEGAL_PERSON"
          substep="0"
          :active="getGuarantorCurrentStep(0)"
        />
        <GuarantorDocumentLink
          class="ml-5"
          ref="gd1"
          :guarantor="selectedGuarantor"
          document-type="IDENTIFICATION"
          substep="1"
          :active="getGuarantorCurrentStep(1)"
        />
      </div>
      <div
        class="menu-grid-row"
        ref="gcontainer"
        v-if="selectedGuarantor.typeGuarantor === 'ORGANISM'"
      >
        <GuarantorDocumentLink
          class="ml-5"
          ref="gd0"
          :guarantor="selectedGuarantor"
          document-type="IDENTIFICATION_ORGANISM"
          substep="0"
          :active="getGuarantorCurrentStep(0)"
        />
      </div>
    </div>
    <div class="menu-grid-row" v-if="step === 4 && isCouple()" ref="tcontainer">
      <CoTenantDocumentLink
        class="ml-5"
        ref="td1"
        :co-tenant="coTenants[0]"
        document-type="IDENTITY"
        substep="1"
        :active="getCurrentSubStep() === 1"
      />
      <CoTenantDocumentLink
        class="ml-5"
        ref="td1"
        :co-tenant="coTenants[0]"
        document-type="RESIDENCY"
        substep="2"
        :active="getCurrentSubStep() === 2"
      />
      <CoTenantDocumentLink
        class="ml-5"
        ref="td1"
        :co-tenant="coTenants[0]"
        document-type="PROFESSIONAL"
        substep="3"
        :active="getCurrentSubStep() === 3"
      />
      <CoTenantDocumentLink
        class="ml-5"
        ref="td1"
        :co-tenant="coTenants[0]"
        document-type="FINANCIAL"
        substep="4"
        :active="getCurrentSubStep() === 4"
      />
      <CoTenantDocumentLink
        class="ml-5"
        ref="td1"
        :co-tenant="coTenants[0]"
        document-type="TAX"
        substep="5"
        :active="getCurrentSubStep() === 5"
      />
    </div>
    <div v-if="step === 5 && isCouple() && selectedGuarantor">
      <div
        class="menu-grid-row"
        ref="gcontainer"
        v-if="
          selectedGuarantor.typeGuarantor === 'NATURAL_PERSON' &&
          selectedGuarantor.firstName !== undefined &&
          selectedGuarantor.lastName !== undefined
        "
      >
        <CoTenantGuarantorDocumentLink
          class="ml-5"
          ref="gd1"
          :guarantor="selectedGuarantor"
          :co-tenant="coTenants[0]"
          document-type="IDENTITY"
          substep="1"
          :active="getGuarantorCurrentStep(1, selectedGuarantor)"
        />
        <CoTenantGuarantorDocumentLink
          class="ml-5"
          ref="gd2"
          :guarantor="selectedGuarantor"
          :co-tenant="coTenants[0]"
          document-type="RESIDENCY"
          substep="2"
          :active="getGuarantorCurrentStep(2, selectedGuarantor)"
        />
        <CoTenantGuarantorDocumentLink
          class="ml-5"
          ref="gd3"
          :guarantor="selectedGuarantor"
          :co-tenant="coTenants[0]"
          document-type="PROFESSIONAL"
          substep="3"
          :active="getGuarantorCurrentStep(3, selectedGuarantor)"
        />
        <CoTenantGuarantorDocumentLink
          class="ml-5"
          ref="gd4"
          :guarantor="selectedGuarantor"
          :co-tenant="coTenants[0]"
          document-type="FINANCIAL"
          substep="4"
          :active="getGuarantorCurrentStep(4, selectedGuarantor)"
        />
        <CoTenantGuarantorDocumentLink
          class="ml-5"
          ref="gd5"
          :guarantor="selectedGuarantor"
          :co-tenant="coTenants[0]"
          document-type="TAX"
          substep="5"
          :active="getGuarantorCurrentStep(5, selectedGuarantor)"
        />
      </div>
      <div
        class="menu-grid-row"
        ref="gcontainer"
        v-if="selectedGuarantor.typeGuarantor === 'LEGAL_PERSON'"
      >
        <CoTenantGuarantorDocumentLink
          class="ml-5"
          ref="gd0"
          :guarantor="selectedGuarantor"
          :co-tenant="coTenants[0]"
          document-type="IDENTIFICATION_LEGAL_PERSON"
          substep="0"
          :active="getGuarantorCurrentStep(0, selectedGuarantor)"
        />
        <CoTenantGuarantorDocumentLink
          class="ml-5"
          ref="gd1"
          :guarantor="selectedGuarantor"
          :co-tenant="coTenants[0]"
          document-type="IDENTIFICATION"
          substep="1"
          :active="getGuarantorCurrentStep(1, selectedGuarantor)"
        />
      </div>
      <div
        class="menu-grid-row"
        ref="gcontainer"
        v-if="selectedGuarantor.typeGuarantor === 'ORGANISM'"
      >
        <CoTenantGuarantorDocumentLink
          class="ml-5"
          ref="gd0"
          :guarantor="selectedGuarantor"
          :co-tenant="getCoTenant(0)"
          document-type="IDENTIFICATION_ORGANISM"
          substep="0"
          :active="getGuarantorCurrentStep(0, selectedGuarantor)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import StepNumber from "df-shared/src/components/StepNumber.vue";
import { Component, Prop, Vue } from "vue-property-decorator";
import ColoredTag from "df-shared/src/components/ColoredTag.vue";
import { mapState } from "vuex";
import { Guarantor } from "df-shared/src/models/Guarantor";
import { User } from "df-shared/src/models/User";
import TenantDocumentLink from "./documents/TenantDocumentLink.vue";
import GuarantorDocumentLink from "./documents/GuarantorDocumentLink.vue";
import CoTenantDocumentLink from "./documents/CoTenantDocumentLink.vue";
import CoTenantGuarantorDocumentLink from "./documents/CoTenantGuarantorDocumentLink.vue";

@Component({
  components: {
    StepNumber,
    ColoredTag,
    TenantDocumentLink,
    GuarantorDocumentLink,
    CoTenantDocumentLink,
    CoTenantGuarantorDocumentLink,
  },
  computed: {
    ...mapState({
      selectedGuarantor: "selectedGuarantor",
      user: "user",
      coTenants: "coTenants",
    }),
  },
})
export default class TopEditMenu extends Vue {
  @Prop({ default: 0 }) step!: number;
  selectedGuarantor!: Guarantor;
  user!: User;
  coTenants!: User[];

  mounted() {
    this.autoScroll("td", "tcontainer");
    this.autoScroll("gd", "gcontainer");
  }

  displayGuarantorName(): boolean {
    const isGuarantorSelected =
      !!this.selectedGuarantor?.lastName && !!this.selectedGuarantor?.firstName;
    if (this.step === 3) {
      return isGuarantorSelected;
    }
    if (this.step === 5 && this.isCouple()) {
      return isGuarantorSelected;
    }
    return false;
  }

  autoScroll(refd: string, refContainer: string) {
    const element = this.$refs[refd + this.$route.params.substep] as any;
    if (element === undefined) {
      return;
    }
    const container = this.$refs[refContainer] as any;
    if (container === undefined) {
      return;
    }
    const left =
      element.offsetLeft - (container.offsetWidth - element.offsetWidth) / 2;
    container.scrollTo(left, 0);
  }

  getClass(s: number) {
    let res = "";
    if (this.step !== s + 1) {
      res += " small ";
    }
    if (this.step === 2 && s === 1) {
      res += ` rad${this.$route.params.substep} `;
    }
    if (this.getStep(s)) {
      return res + "active";
    }
    return res;
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
      case 5:
        return s <= 4;
      case 6:
        return s <= 5;
      default:
        return s <= 0;
    }
  }

  getStepTitle() {
    if (this.step <= 1) {
      return this.$i18n.t("personal-information");
    }
    if (this.step === 2) {
      return this.$i18n.t("my-document");
    }
    if (this.step === 3) {
      return this.$i18n.t("my-guarantor");
    }
    if (this.step === 4 && this.isCouple()) {
      return this.$i18n.t("my-cotenant");
    }
    if (this.step === 5 && this.isCouple()) {
      return this.$i18n.t("my-cotenant-guarantor");
    }
    if (this.step === 6 && this.isCouple()) {
      return this.$i18n.t("validate-file");
    }
    if (this.step === 4 && !this.isCouple()) {
      return this.$i18n.t("validate-file");
    }
    return "";
  }

  getGuarantorCurrentStep(substep: number, g: Guarantor): boolean {
    const s = Number(this.$route.params.substep) || 0;
    return (
      (this.step === 3 || this.step === 5) &&
      s === substep &&
      (g === undefined || this.selectedGuarantor.id === g.id)
    );
  }

  getCurrentSubStep() {
    return Number(this.$route.params.substep) || 0;
  }

  getTenantCurrentStep(substep: number): boolean {
    const s = Number(this.$route.params.substep) || 0;
    return this.step === 2 && s === substep;
  }

  isCouple() {
    return this.user.applicationType === "COUPLE";
  }

  getCoTenant(index: number): User {
    return this.coTenants[index];
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "df-shared/src/scss/_variables.scss";

h1 {
  font-size: 0.9rem;
  font-weight: 400;
  line-height: 1rem;
  padding-top: 0.5rem;
}

.top-edit-menu {
  white-space: nowrap;
  background-color: var(--background-default-grey);
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
  height: 5px;
}

.step-title {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-bottom: 1.5rem;
  padding-top: 0.5rem;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  line-height: 6px;
}

.hidden {
  visibility: hidden;
}

.ml-5 {
  margin-left: 1rem;
  margin-top: 0.25rem;
  margin-bottom: 1rem;
}

.mr-5 {
  margin-right: 1rem;
}

.menu-grid-row {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  overflow: scroll;
}

hr {
  height: 1px;
  opacity: 0.25;
}

[href] {
  box-shadow: none;
  background-image: none;
}

.hline {
  height: 0.3rem;
  border-radius: 0.15rem;
  background-color: var(--g200);
  z-index: 0;
  margin: 2%;
  width: 60%;

  &.active {
    background-color: var(--primary);
  }
}

.small {
  width: 8% !important;
}

.rad1 {
  background: linear-gradient(90deg, var(--primary) 20%, var(--g200) 20%);
}

.rad2 {
  background: linear-gradient(90deg, var(--primary) 40%, var(--g200) 40%);
}

.rad3 {
  background: linear-gradient(90deg, var(--primary) 60%, var(--g200) 60%);
}

.rad4 {
  background: linear-gradient(90deg, var(--primary) 80%, var(--g200) 80%);
}

.small-title {
  font-size: 1rem;
  margin-bottom: 0;
  font-style: normal;
  font-weight: 400;
  margin-left: 1rem;
}
</style>
