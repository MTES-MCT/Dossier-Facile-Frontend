<template>
  <div class="left-edit-menu fr-pt-7w fr-pb-12w" id="funnel-menu">
    <div class="inner-left-edit">
      <div class="step" :class="getClass(getStepNumber('information'))">
        <div class="step-number">{{ getStepNumber("information") }}</div>
        <div class="step-title">
          <router-link :to="{ name: 'TenantName' }" class="fr-link">
            {{ $t("personal-information") }}
          </router-link>
        </div>
      </div>
      <div class="vline" :class="getClass(getStepNumber('information'))">
        <div class="ml-5">
          <router-link :to="{ name: 'Profile' }">
            <ColoredTag
              :label="$tc('lefteditmenu.identity')"
              :text="user | fullName"
              status="NAME"
            />
          </router-link>
        </div>
        <div class="ml-5" v-if="user.applicationType">
          <router-link :to="{ name: 'TenantType' }">
            <ColoredTag
              :label="$tc('lefteditmenu.file-type')"
              :text="$tc(`lefteditmenu.${user.applicationType}`)"
              :status="user.applicationType"
              :active="step < 2"
            ></ColoredTag>
          </router-link>
        </div>
      </div>
      <div class="step" :class="getClass(getStepNumber('documents'))">
        <div class="step-number">{{ getStepNumber("documents") }}</div>
        <div class="step-title">
          <router-link
            class="fr-link"
            :to="{ name: 'TenantDocuments', params: { substep: '1' } }"
            >{{ $t("my-document") }}
          </router-link>
        </div>
      </div>
      <div class="vline" :class="getClass(getStepNumber('documents'))">
        <div v-if="step === 2">
          <TenantDocumentLink
            class="ml-5"
            document-type="IDENTITY"
            substep="1"
            :active="getTenantCurrentStep(1)"
          />
          <TenantDocumentLink
            class="ml-5"
            document-type="RESIDENCY"
            substep="2"
            :active="getTenantCurrentStep(2)"
          />
          <TenantDocumentLink
            class="ml-5"
            document-type="PROFESSIONAL"
            substep="3"
            :active="getTenantCurrentStep(3)"
          />
          <TenantDocumentLink
            class="ml-5"
            document-type="FINANCIAL"
            substep="4"
            :active="getTenantCurrentStep(4)"
          />
          <TenantDocumentLink
            class="ml-5"
            document-type="TAX"
            substep="5"
            :active="getTenantCurrentStep(5)"
          />
        </div>
      </div>
      <div class="step" :class="getClass(getStepNumber('guarantor'))">
        <div class="step-number">{{ getStepNumber("guarantor") }}</div>
        <div class="step-title">
          <router-link class="fr-link" :to="getGuarantorLink()"
            >{{ $t("my-guarantor") }}
          </router-link>
        </div>
      </div>
      <div class="vline" :class="getClass(getStepNumber('guarantor'))">
        <div v-if="step === getStepNumber('guarantor') && selectedGuarantor">
          <div
            v-if="
              selectedGuarantor.typeGuarantor === 'NATURAL_PERSON' &&
              selectedGuarantor.firstName !== undefined &&
              selectedGuarantor.lastName !== undefined
            "
          >
            <div v-for="(g, k) in user.guarantors" :key="k">
              <div class="ml-5 bold">
                <router-link
                  :to="{
                    name: 'GuarantorDocuments',
                    params: { substep: '0', guarantorId: g.id },
                  }"
                >
                  <ColoredTag
                    :text="`${g.firstName} ${g.lastName}`"
                    status="NONE"
                    :active="getGuarantorCurrentStep(0, g)"
                  ></ColoredTag>
                </router-link>
              </div>
              <GuarantorDocumentLink
                class="ml-10"
                :guarantor="g"
                document-type="IDENTITY"
                substep="1"
                :active="getGuarantorCurrentStep(1, g)"
              />
              <GuarantorDocumentLink
                class="ml-10"
                :guarantor="g"
                document-type="RESIDENCY"
                substep="2"
                :active="getGuarantorCurrentStep(2, g)"
              />
              <GuarantorDocumentLink
                class="ml-10"
                :guarantor="g"
                document-type="PROFESSIONAL"
                substep="3"
                :active="getGuarantorCurrentStep(3, g)"
              />
              <GuarantorDocumentLink
                class="ml-10"
                :guarantor="g"
                document-type="FINANCIAL"
                substep="4"
                :active="getGuarantorCurrentStep(4, g)"
              />
              <GuarantorDocumentLink
                class="ml-10"
                :guarantor="g"
                document-type="TAX"
                substep="5"
                :active="getGuarantorCurrentStep(5, g)"
              />
            </div>
          </div>
          <div v-if="selectedGuarantor.typeGuarantor === 'LEGAL_PERSON'">
            <GuarantorDocumentLink
              class="ml-5"
              :guarantor="selectedGuarantor"
              document-type="IDENTIFICATION_LEGAL_PERSON"
              substep="0"
              :active="getGuarantorCurrentStep(0)"
            />
            <GuarantorDocumentLink
              class="ml-5"
              :guarantor="selectedGuarantor"
              document-type="IDENTIFICATION"
              substep="1"
              :active="getGuarantorCurrentStep(1)"
            />
          </div>
          <div v-if="selectedGuarantor.typeGuarantor === 'ORGANISM'">
            <GuarantorDocumentLink
              class="ml-5"
              :guarantor="selectedGuarantor"
              document-type="IDENTIFICATION_ORGANISM"
              substep="0"
              :active="getGuarantorCurrentStep(0)"
            />
          </div>
        </div>
      </div>
      <div
        v-if="isCouple()"
        class="step"
        :class="getClass(getStepNumber('coTenant'))"
      >
        <div class="step-number">{{ getStepNumber("coTenant") }}</div>
        <div class="step-title">
          <router-link
            class="fr-link"
            :to="{
              name: 'CoTenantDocuments',
              params: {
                step: getStepNumber('coTenant'),
                substep: '0',
                tenantId: getCoTenant(0).id,
              },
            }"
            >{{ $t("my-cotenant") }}
          </router-link>
        </div>
      </div>
      <div
        v-if="isCouple()"
        class="vline"
        :class="getClass(getStepNumber('coTenant'))"
      >
        <div v-if="step === getStepNumber('coTenant')">
          <div>
            <div v-for="(coTenant, k) in coTenants" :key="k">
              <div class="ml-5 bold">
                <router-link
                  :to="{
                    name: 'CoTenantDocuments',
                    params: { substep: '0', tenantId: coTenant.id },
                  }"
                >
                  <ColoredTag
                    :text="getName(coTenant)"
                    status="NONE"
                    :active="getCurrentSubStep() == 0"
                  ></ColoredTag>
                </router-link>
              </div>
              <CoTenantDocumentLink
                class="ml-10"
                :co-tenant="coTenant"
                document-type="IDENTITY"
                substep="1"
                :active="getCurrentSubStep() === 1"
              />
              <CoTenantDocumentLink
                class="ml-10"
                :co-tenant="coTenant"
                document-type="RESIDENCY"
                substep="2"
                :active="getCurrentSubStep() === 2"
              />
              <CoTenantDocumentLink
                class="ml-10"
                :co-tenant="coTenant"
                document-type="PROFESSIONAL"
                substep="3"
                :active="getCurrentSubStep() === 3"
              />
              <CoTenantDocumentLink
                class="ml-10"
                :co-tenant="coTenant"
                document-type="FINANCIAL"
                substep="4"
                :active="getCurrentSubStep() === 4"
              />
              <CoTenantDocumentLink
                class="ml-10"
                :co-tenant="coTenant"
                document-type="TAX"
                substep="5"
                :active="getCurrentSubStep() === 5"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="isCouple()"
        class="step"
        :class="getClass(getStepNumber('coTenantGuarantor'))"
      >
        <div class="step-number">
          {{ getStepNumber("coTenantGuarantor") }}
        </div>
        <div class="step-title">
          <router-link
            class="fr-link"
            :to="
              getTenantGuarantorLink(
                getCoTenant(0),
                getStepNumber('coTenantGuarantor')
              )
            "
          >
            {{ $t("my-cotenant-guarantor") }}
          </router-link>
        </div>
      </div>
      <div
        v-if="isCouple()"
        class="vline"
        :class="getClass(getStepNumber('coTenantGuarantor'))"
      >
        <div v-if="step === getStepNumber('coTenantGuarantor')">
          <div
            v-if="
              selectedGuarantor &&
              selectedGuarantor.typeGuarantor === 'NATURAL_PERSON' &&
              selectedGuarantor.firstName !== undefined &&
              selectedGuarantor.lastName !== undefined
            "
          >
            <div v-for="(g, k) in getCoTenant(0).guarantors" :key="k">
              <div class="ml-5 bold">
                <router-link
                  :to="{
                    name: 'TenantGuarantorDocuments',
                    params: {
                      step: getStepNumber('coTenantGuarantor'),
                      substep: '0',
                      tenantId: getCoTenant(0).id,
                      guarantorId: g.id,
                    },
                  }"
                >
                  <ColoredTag
                    :text="`${g.firstName} ${g.lastName}`"
                    status="NONE"
                    :active="getGuarantorCurrentStep(0, g)"
                  ></ColoredTag>
                </router-link>
              </div>
              <CoTenantGuarantorDocumentLink
                class="ml-10"
                :guarantor="g"
                :co-tenant="getCoTenant(0)"
                document-type="IDENTITY"
                substep="1"
                :active="getGuarantorCurrentStep(1, g)"
              />
              <CoTenantGuarantorDocumentLink
                class="ml-10"
                :guarantor="g"
                :co-tenant="getCoTenant(0)"
                document-type="RESIDENCY"
                substep="2"
                :active="getGuarantorCurrentStep(2, g)"
              />
              <CoTenantGuarantorDocumentLink
                class="ml-10"
                :guarantor="g"
                :co-tenant="getCoTenant(0)"
                document-type="PROFESSIONAL"
                substep="3"
                :active="getGuarantorCurrentStep(3, g)"
              />
              <CoTenantGuarantorDocumentLink
                class="ml-10"
                :guarantor="g"
                :co-tenant="getCoTenant(0)"
                document-type="FINANCIAL"
                substep="4"
                :active="getGuarantorCurrentStep(4, g)"
              />
              <CoTenantGuarantorDocumentLink
                class="ml-10"
                :guarantor="g"
                :co-tenant="getCoTenant(0)"
                document-type="TAX"
                substep="5"
                :active="getGuarantorCurrentStep(5, g)"
              />
            </div>
          </div>
          <div v-if="selectedGuarantor.typeGuarantor === 'LEGAL_PERSON'">
            <CoTenantGuarantorDocumentLink
              class="ml-5"
              :guarantor="selectedGuarantor"
              :co-tenant="getCoTenant(0)"
              document-type="IDENTIFICATION_LEGAL_PERSON"
              substep="0"
              :active="getGuarantorCurrentStep(0, selectedGuarantor)"
            />
            <CoTenantGuarantorDocumentLink
              class="ml-5"
              :guarantor="selectedGuarantor"
              :co-tenant="getCoTenant(0)"
              document-type="IDENTIFICATION"
              substep="1"
              :active="getGuarantorCurrentStep(1, selectedGuarantor)"
            />
          </div>
          <div v-if="selectedGuarantor.typeGuarantor === 'ORGANISM'">
            <CoTenantGuarantorDocumentLink
              class="ml-5"
              :guarantor="selectedGuarantor"
              :co-tenant="getCoTenant(0)"
              document-type="IDENTIFICATION_ORGANISM"
              substep="0"
              :active="getGuarantorCurrentStep(0, selectedGuarantor)"
            />
          </div>
        </div>
      </div>
      <div class="step" :class="getClass(getStepNumber('validate'))">
        <div class="step-number">{{ getStepNumber("validate") }}</div>
        <div class="step-title">
          <router-link
            class="fr-link"
            :to="{
              name: 'ValidateFileStep',
              params: { step: getStepNumber('validate') },
            }"
            >{{ $t("validate-file") }}
          </router-link>
        </div>
      </div>

      <div class="spacer"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Guarantor } from "df-shared/src/models/Guarantor";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { mapState } from "vuex";
import StatusIcon from "df-shared/src/components/StatusIcon.vue";
import ColoredTag from "df-shared/src/components/ColoredTag.vue";
import { User } from "df-shared/src/models/User";
import DocumentLink from "./documents/DocumentLink.vue";
import GuarantorDocumentLink from "./documents/GuarantorDocumentLink.vue";
import TenantDocumentLink from "./documents/TenantDocumentLink.vue";
import CoTenantDocumentLink from "./documents/CoTenantDocumentLink.vue";
import CoTenantGuarantorDocumentLink from "./documents/CoTenantGuarantorDocumentLink.vue";

@Component({
  components: {
    StatusIcon,
    ColoredTag,
    DocumentLink,
    TenantDocumentLink,
    GuarantorDocumentLink,
    CoTenantDocumentLink,
    CoTenantGuarantorDocumentLink,
  },
  computed: {
    ...mapState({
      selectedGuarantor: "selectedGuarantor",
      user: "user",
    }),
  },
})
export default class LeftEditMenu extends Vue {
  @Prop({ default: 0 }) step!: number;
  selectedGuarantor!: Guarantor;
  coTenants: User[] = [];
  user!: User;

  @Watch("user")
  loadCotenants() {
    this.coTenants = this.user.apartmentSharing?.tenants?.filter((r: User) => {
      return r.id != this.user.id;
    }) as User[];
    if (!this.coTenants) {
      return [];
    }
  }

  beforeMount() {
    this.loadCotenants();
  }

  getClass(s: number) {
    if (s <= this.step) {
      return "active";
    }
    return "";
  }

  getTenantCurrentStep(substep: number): boolean {
    const s = Number(this.$route.params.substep) || 0;
    return this.step === 2 && s === substep;
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

  getGuarantorLink() {
    if (this.user.guarantors.length > 0) {
      return { name: "GuarantorList" };
    }
    return { name: "GuarantorChoice" };
  }

  getTenantGuarantorLink(tenant: User, stepNum: number) {
    return {
      name: "TenantGuarantors",
      params: { tenantId: Number(tenant.id), step: stepNum },
    };
  }

  isCouple() {
    return this.user.applicationType === "COUPLE";
  }

  getCoTenant(index: number): User {
    return this.coTenants[index];
  }

  getStepNumber(stepName: string): number {
    switch (stepName) {
      case "information":
        return 1;
      case "documents":
        return 2;
      case "guarantor":
        return 3;
      case "coTenant":
        return 4;
      case "coTenantGuarantor":
        return 5;
      case "validate":
        return this.user.applicationType == "COUPLE" ? 6 : 4;
    }

    return -1;
  }

  getName(user: User): string {
    if (user.preferredName) {
      return `${user.firstName} ${user.preferredName}`;
    }
    return `${user.firstName} ${user.lastName}`;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "df-shared/src/scss/_variables.scss";

.left-edit-menu {
  background-color: var(--background-default-grey);
  @media all and (max-width: 768px) {
    display: none;
  }
}

.inner-left-edit {
  min-height: 300px;
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

.ml-10 {
  margin-left: 0.5rem;
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
  background-image: none;
}
</style>
