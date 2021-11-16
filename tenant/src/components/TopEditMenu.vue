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
    </div>
    <hr v-if="step === 2" />
    <div class="menu-grid-row" v-if="step === 2" ref="tcontainer">
      <div class="ml-5" ref="td1">
        <router-link :to="{ name: 'TenantDocuments', params: { substep: '1' } }"
          ><ColoredTag
            :text="$t('identification')"
            :status="tenantStatus('IDENTITY')"
            :active="getTenantCurrentStep(1)"
          ></ColoredTag
        ></router-link>
      </div>
      <div class="ml-5" ref="td2">
        <router-link :to="{ name: 'TenantDocuments', params: { substep: '2' } }"
          ><ColoredTag
            :text="$t('residency')"
            :status="tenantStatus('RESIDENCY')"
            :active="getTenantCurrentStep(2)"
          ></ColoredTag
        ></router-link>
      </div>
      <div class="ml-5" ref="td3">
        <router-link :to="{ name: 'TenantDocuments', params: { substep: '3' } }"
          ><ColoredTag
            :text="$t('professional')"
            :status="tenantStatus('PROFESSIONAL')"
            :active="getTenantCurrentStep(3)"
          ></ColoredTag
        ></router-link>
      </div>
      <div class="ml-5" ref="td4">
        <router-link :to="{ name: 'TenantDocuments', params: { substep: '4' } }"
          ><ColoredTag
            :text="$t('financial')"
            :status="tenantStatus('FINANCIAL')"
            :active="getTenantCurrentStep(4)"
          ></ColoredTag
        ></router-link>
      </div>
      <div class="ml-5" ref="td5">
        <router-link :to="{ name: 'TenantDocuments', params: { substep: '5' } }"
          ><ColoredTag
            :text="$t('tax')"
            :status="tenantStatus('TAX')"
            :active="getTenantCurrentStep(5)"
          ></ColoredTag
        ></router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import StepNumber from "df-shared/src/components/StepNumber.vue";
import { Component, Prop, Vue } from "vue-property-decorator";
import { DocumentService } from "../services/DocumentService";
import ColoredTag from "df-shared/src/components/ColoredTag.vue";

@Component({
  components: { StepNumber, ColoredTag }
})
export default class LeftEditMenu extends Vue {
  @Prop({ default: 0 }) step!: number;

  mounted() {
    const element = this.$refs["td" + this.$route.params.substep] as any;
    if (element === undefined) {
      return;
    }
    const tcontainer = this.$refs["tcontainer"] as any;
    if (tcontainer === undefined) {
      return;
    }
    const left =
      element.offsetLeft - (tcontainer.offsetWidth - element.offsetWidth) / 2;
    tcontainer.scrollTo(left, 0);
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
    if (this.step === 4) {
      return this.$i18n.t("validate-file");
    }
    return "";
  }

  tenantStatus(documentType: string) {
    return DocumentService.tenantStatus(documentType);
  }

  getTenantCurrentStep(substep: number): boolean {
    const s = Number(this.$route.params.substep) || 0;
    return this.step === 2 && s === substep;
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
  margin-top: 1rem;
  margin-bottom: 1rem;
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
</style>

<i18n>
{
"en": {
},
"fr": {
}
}
</i18n>
