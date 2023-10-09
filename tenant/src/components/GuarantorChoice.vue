<template>
  <div>
    <div>
      <div ref="guarantor-body-content">
        <NakedCard class="fr-p-md-5w">
          <div class="text-bold fr-mb-1w">
            <h1 class="fr-h5">
              {{ $t("guarantorchoice.add-guarantor") }}
            </h1>
          </div>
          <TroubleshootingModal>
            <GuarantorChoiceHelp></GuarantorChoiceHelp>
          </TroubleshootingModal>
          <div class="fr-mt-3w">
            <p v-html="$t('guarantorchoice.optional-guarantor')"></p>
            <div class="fr-alert fr-alert--info">
              <p v-html="$t('guarantorchoice.two-guarantors-warning')"></p>
            </div>
          </div>
        </NakedCard>
        <NakedCard class="fr-p-md-5w fr-mt-3w">
          <div class="fr-mb-2w">
            {{ $t("guarantorchoice.ask-guarantor") }}
          </div>

          <GuarantorTypeSelector
            :localStorageKey="`guarantorType_${this.user.email}`"
            @selected="tmpGuarantorType = $event"
          >
          </GuarantorTypeSelector>
        </NakedCard>
        <div
          v-if="tmpGuarantorType === 'NO_GUARANTOR'"
          class="bg-purple fr-mt-3w fr-p-5w"
        >
          <div class="fr-grid-row space-between">
            <div class="fr-h5">{{ $t("guarantorchoice.visale-title") }}</div>
            <img
              alt="logo visale"
              class="logo-visale"
              src="../assets/visale.svg"
            />
          </div>
          <p>{{ $t("guarantorchoice.visale-text") }}</p>
          <div style="text-align: right">
            <DfButton primary="true" @on-click="gotoVisale()">
              {{ $t("guarantorchoice.visale-btn") }}
            </DfButton>
          </div>
        </div>
      </div>

      <GuarantorFooter
        @on-back="goBack"
        @on-next="setGuarantorType"
      ></GuarantorFooter>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import GuarantorIdentification from "./documents/naturalGuarantor/GuarantorIdentification.vue";
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
import { AnalyticsService } from "../services/AnalyticsService";
import GuarantorFooter from "./footer/GuarantorFooter.vue";
import GuarantorChoiceHelp from "./helps/GuarantorChoiceHelp.vue";
import VGouvFrModal from "df-shared/src/GouvFr/v-gouv-fr-modal/VGouvFrModal.vue";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import ProfileContainer from "./ProfileContainer.vue";
import TroubleshootingModal from "@/components/helps/TroubleshootingModal.vue";
import GuarantorTypeSelector from "@/components/GuarantorTypeSelector.vue";

@Component({
  components: {
    TroubleshootingModal,
    DfButton,
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
    GuarantorTypeSelector,
  },
  computed: {
    ...mapState({
      user: "user",
    }),
    ...mapGetters({
      guarantor: "guarantor",
      coTenants: "coTenants",
    }),
  },
})
export default class GuarantorDocuments extends Vue {
  user!: User;
  coTenants!: User[];
  guarantor!: Guarantor;
  tmpGuarantorType = "";
  changeGuarantorVisible = false;

  updated() {
    // each dom update involved a scrollToEnd
    this.$nextTick(() => this.scrollToEnd());
  }
  scrollToEnd() {
    const element: any = this.$refs["guarantor-body-content"];
    window.scrollTo(0, element.lastElementChild.offsetTop);
  }

  beforeMount() {
    this.$store.dispatch("updateSelectedGuarantor", this.user.id);
  }

  goBack() {
    this.$router.push({
      name: "TenantDocuments",
      params: { substep: "5" },
    });
  }

  setGuarantorType() {
    if (!this.tmpGuarantorType) {
      Vue.toasted.global.error_toast({
        message: "guarantorchoice.type-required",
      });
      return;
    }
    AnalyticsService.addGuarantor(this.tmpGuarantorType || "");
    if (this.tmpGuarantorType === "NO_GUARANTOR") {
      if (this.user.applicationType === "COUPLE") {
        this.$router.push({
          name: "CoTenantDocuments",
          params: {
            step: "4",
            substep: "0",
            tenantId: this.coTenants[0].id.toString(),
          },
        });
      } else {
        this.$router.push({
          name: "ValidateFile",
        });
      }
    } else if (
      this.tmpGuarantorType != this.guarantor.typeGuarantor ||
      (this.user.guarantors.length || 0) <= 0
    ) {
      this.$store
        .dispatch("setGuarantorType", { typeGuarantor: this.tmpGuarantorType })
        .then(() => {
          this.$router.push({
            name: "GuarantorDocuments",
            params: { substep: "0" },
          });
        });
    } else {
      this.$router.push({
        name: "GuarantorList",
      });
    }
  }

  gotoVisale() {
    window.open("https://www.visale.fr", "_blank");
  }
}
</script>

<style scoped lang="scss">
@import "df-shared/src/scss/_variables.scss";

.remark {
  background-color: #e5e5f4;
  padding: 1rem;
  border-radius: 0.25rem;
}

.logo-visale {
  width: 138px;
  height: 45px;
  margin-bottom: 1rem;
}

.width--fit-content {
  @media all and (min-width: 768px) {
    width: fit-content;
  }
}
</style>
