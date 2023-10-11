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
            <p v-html="$t('tenantguarantorchoice.optional-guarantor')"></p>
            <div class="fr-alert fr-alert--info">
              <p
                v-html="$t('tenantguarantorchoice.two-guarantors-warning')"
              ></p>
            </div>
          </div>
        </NakedCard>
        <NakedCard class="fr-p-md-5w fr-mt-3w">
          <div class="fr-mb-2w">
            {{ $t("tenantguarantorchoice.ask-guarantor") }}
          </div>

          <GuarantorTypeSelector
            :localStorageKey="`cotenantGuarantorType_${tenantId}`"
            :isCotenant="isCotenant"
            @selected="tmpGuarantorType = $event"
          >
          </GuarantorTypeSelector>
        </NakedCard>
        <div
          v-if="tmpGuarantorType === 'NO_GUARANTOR'"
          class="bg-purple fr-mt-3w fr-p-5w"
        >
          <div class="fr-grid-row space-between">
            <div class="fr-h5">
              {{ $t("tenantguarantorchoice.visale-title") }}
            </div>
            <img
              alt="logo visale"
              class="logo-visale"
              src="../assets/visale.svg"
            />
          </div>
          <p>{{ $t("tenantguarantorchoice.visale-text") }}</p>
          <div style="text-align: right">
            <DfButton primary="true" @on-click="gotoVisale()">
              {{ $t("tenantguarantorchoice.visale-btn") }}
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
import { Component, Vue, Prop } from "vue-property-decorator";
import VGouvFrModal from "df-shared/src/GouvFr/v-gouv-fr-modal/VGouvFrModal.vue";
import DfButton from "df-shared/src/Button/Button.vue";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import { AnalyticsService } from "../services/AnalyticsService";
import GuarantorFooter from "./footer/GuarantorFooter.vue";
import GuarantorChoiceHelp from "./helps/GuarantorChoiceHelp.vue";
import TroubleshootingModal from "@/components/helps/TroubleshootingModal.vue";
import GuarantorTypeSelector from "@/components/GuarantorTypeSelector.vue";

@Component({
  components: {
    GuarantorTypeSelector,
    TroubleshootingModal,
    VGouvFrModal,
    DfButton,
    NakedCard,
    GuarantorFooter,
    GuarantorChoiceHelp,
  },
})
export default class TenantGuarantorChoice extends Vue {
  @Prop() tenantId!: number;
  @Prop({ default: false }) isCotenant!: boolean;
  tmpGuarantorType = "";

  getLocalStorageKey() {
    return "cotenantGuarantorType_" + this.tenantId;
  }

  beforeMount() {
    this.$store.dispatch("updateSelectedGuarantor", this.tenantId);
  }

  updated() {
    // each dom update involved a scrollToEnd
    this.$nextTick(() => this.scrollToEnd());
  }

  scrollToEnd() {
    const element: any = this.$refs["guarantor-body-content"];
    window.scrollTo(0, element.lastElementChild.offsetTop);
  }

  setGuarantorType() {
    if (!this.tmpGuarantorType) {
      Vue.toasted.global.error_toast({
        message: "tenantguarantorchoice.type-required",
      });
      return;
    }
    AnalyticsService.addGuarantor(this.tmpGuarantorType);
    if (this.tmpGuarantorType === "NO_GUARANTOR") {
      this.$emit("on-select", this.tmpGuarantorType);
    } else {
      this.$store
        .dispatch("setGuarantorType", {
          tenantId: this.tenantId.toString(),
          typeGuarantor: this.tmpGuarantorType,
        })
        .then(
          () => {
            this.$emit("on-select", this.tmpGuarantorType);
          },
          () => {
            Vue.toasted.global.error_toast({
              message: "try-again",
            });
          }
        );
    }
  }

  goBack() {
    this.$emit("on-back");
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

.card {
  padding: 1rem;
}

.card-container {
  @media all and (min-width: 992px) {
    width: 100%;
  }
}

.small-font {
  font-size: 14px;
}

.add-guarantor-btn {
  border-radius: 0.5rem;
  padding: 1.75rem;
  color: var(--primary);
  border: 1px solid var(--primary);
  width: 100%;
  font-size: 16px;
  background: var(--blue-france-925);
  &:hover {
    background: var(--blue-france-hover);
  }
  &:active {
    background: var(--blue-france-active);
  }
}
</style>
