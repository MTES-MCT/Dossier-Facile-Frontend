<template>
  <div>
    <div>
      <div v-if="isMobile()" class="remark fr-mt-3w fr-mb-3w">
        <div class="fr-h5">{{ $t("remark-title") }}</div>
        <div v-html="$t('remark-text')"></div>
      </div>

      <div ref="guarantor-body-content">
        <NakedCard class="fr-p-md-5w">
          <div v-if="!isMobile()">
            <div class="text-bold fr-mb-1w">
              <h1 class="fr-h5" v-if="isCotenant">
                {{ $t("cotenant-guarantor") }}
              </h1>
              <h1 class="fr-h5" v-else>
                {{ $t("my-guarantor") }}
              </h1>
            </div>
            <v-gouv-fr-modal>
              <template v-slot:button>
                <span class="small-font">{{ $t("more-information") }}</span>
              </template>
              <template v-slot:title>
                {{ $t("more-information") }}
              </template>
              <template v-slot:content>
                <p>
                  <GuarantorChoiceHelp></GuarantorChoiceHelp>
                </p>
              </template>
            </v-gouv-fr-modal>
            <div class="remark fr-mt-3w">
              <div class="fr-h6">{{ $t("remark-title") }}</div>
              <div class="small-font" v-html="$t('remark-text')"></div>
            </div>
          </div>
          <div class="fr-mt-3w fr-mb-2w">
            {{ $t("ask-guarantor") }}
          </div>
          <v-gouv-fr-modal v-if="isMobile()">
            <template v-slot:button>
              <span class="small-font">{{ $t("more-information") }}</span>
            </template>
            <template v-slot:title>
              {{ $t("more-information") }}
            </template>
            <template v-slot:content>
              <p>
                <GuarantorChoiceHelp></GuarantorChoiceHelp>
              </p>
            </template>
          </v-gouv-fr-modal>

          <div class="fr-grid-col">
            <div class="width--fit-content">
              <BigRadio
                val="NATURAL_PERSON"
                :value="tmpGuarantorType"
                @input="onSelectChange"
              >
                <div class="fr-grid-col spa">
                  <span>{{ $t("natural-person") }}</span>
                </div>
              </BigRadio>
            </div>
            <div class="width--fit-content">
              <BigRadio
                val="ORGANISM"
                :value="tmpGuarantorType"
                @input="onSelectChange"
              >
                <div class="fr-grid-col spa">
                  <span>{{ $t("organism") }}</span>
                </div>
              </BigRadio>
            </div>
            <div class="width--fit-content">
              <BigRadio
                val="LEGAL_PERSON"
                :value="tmpGuarantorType"
                @input="onSelectChange"
              >
                <div class="fr-grid-col spa">
                  <span>{{ $t("legal-person") }}</span>
                </div>
              </BigRadio>
            </div>
            <div class="width--fit-content">
              <BigRadio
                class="fr-mt-md-3w"
                val="NO_GUARANTOR"
                :value="tmpGuarantorType"
                @input="onSelectChange"
              >
                <div class="fr-grid-col spa">
                  <span>{{ $t("no-guarantor") }}</span>
                </div>
              </BigRadio>
            </div>
          </div>
        </NakedCard>
        <div
          v-if="tmpGuarantorType === 'NO_GUARANTOR'"
          class="bg-purple fr-mt-3w fr-p-5w"
        >
          <div class="fr-grid-row space-between">
            <div class="fr-h5">{{ $t("visale-title") }}</div>
            <img
              alt="logo visale"
              class="logo-visale"
              src="../assets/visale.svg"
            />
          </div>
          <p>{{ $t("visale-text") }}</p>
          <div style="text-align: right">
            <DfButton primary="true" @on-click="gotoVisale()">
              {{ $t("visale-btn") }}
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
import BigRadio from "df-shared/src/Button/BigRadio.vue";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import { UtilsService } from "../services/UtilsService";
import { AnalyticsService } from "../services/AnalyticsService";
import GuarantorFooter from "./footer/GuarantorFooter.vue";
import GuarantorChoiceHelp from "./helps/GuarantorChoiceHelp.vue";

@Component({
  components: {
    VGouvFrModal,
    DfButton,
    BigRadio,
    NakedCard,
    GuarantorFooter,
    GuarantorChoiceHelp
  }
})
export default class TenantGuarantorChoice extends Vue {
  @Prop() tenantId!: number;
  @Prop({ default: false }) isCotenant!: boolean;
  tmpGuarantorType = "";

  beforeMount() {
    this.tmpGuarantorType;
  }
  updated() {
    // each dom update involved a scrollToEnd
    this.$nextTick(() => this.scrollToEnd());
  }
  scrollToEnd() {
    const element: any = this.$refs["guarantor-body-content"];
    window.scrollTo(0, element.lastElementChild.offsetTop);
  }

  onSelectChange(value: string) {
    this.tmpGuarantorType = value;
  }

  setGuarantorType() {
    if (!this.tmpGuarantorType) {
      this.$toasted.show(this.$i18n.t("type-required").toString(), {
        type: "error",
        duration: 7000
      });
      return;
    }
    AnalyticsService.addGuarantor(this.tmpGuarantorType);
    // const tenant = UtilsService.getTenant(this.tenantId).guarantor;
    if (this.tmpGuarantorType == "NO_GUARANTOR") {
      this.$emit("on-select", this.tmpGuarantorType);
    } else {
      this.$store
        .dispatch("setGuarantorType", {
          tenantId: this.tenantId.toString(),
          typeGuarantor: this.tmpGuarantorType
        })
        .then(
          () => {
            this.$emit("on-select", this.tmpGuarantorType);
          },
          () => {
            this.$toasted.show(this.$i18n.t("try-again").toString(), {
              type: "error",
              duration: 7000
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

  isMobile() {
    return UtilsService.isMobile();
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

<i18n>
{
"en": {
  "my-guarantor": "My guarantor",
  "cotenant-guarantor": "His/her guarantor",
  "identification": "Pièce d’identité",
  "residency": "Justificatif de domicile",
  "professional": "Justificatif de situation professionnelle",
  "financial": "Justificatif de ressources",
  "tax": "Avis d’imposition",
  "representative-identification": "Identité de la personne morale",
  "corporation-identification": "Identité du représentant de la personne morale",
  "guarantor": "Guarantor",
  "validate": "Validate",
  "will-delete-guarantor": "Are you sure you want to change the type of guarantor?",
  "validate-file": "Next step - Validate file",
  "natural-person": "A classic physical guarantor",
  "organism": "An organization",
  "legal-person": "A corporation guarantor",
  "no-guarantor": "I don't have a guarantor",
  "more-information": "More information",
  "ask-guarantor": "Do you want to add :",
  "remark-title": "Remark",
  "remark-text": "Adding a guarantor is by no means mandatory. If you do not wish to add a surety, you can select “I don't have a guarantor”.<br> Your file will then be registered for investigation.",
  "type-required": "Please select a choice",
  "visale-title": "Do you know Visale ?",
  "visale-text": "Visale is the guarantor of your future accommodation if you are between 18 and 30 years old OR if you are employees over 30 years old (subject to conditions).",
  "visale-btn": "Discover Visale"
},
"fr": {
  "my-guarantor": "Mon garant",
  "cotenant-guarantor": "Son garant",
  "identification": "Pièce d’identité",
  "residency": "Justificatif de domicile",
  "professional": "Justificatif de situation professionnelle",
  "financial": "Justificatif de ressources",
  "tax": "Avis d’imposition",
  "representative-identification": "Identité de la personne morale",
  "corporation-identification": "Identité du représentant de la personne morale",
  "guarantor": "Garant",
  "validate": "Valider",
  "will-delete-guarantor": "Êtes-vous sûr de vouloir changer le type de garant ?",
  "validate-file": "Étape suivante - Valider le dossier",
  "natural-person": "Un garant physique classique",
  "organism": "Un organisme garant",
  "legal-person": "Un garant moral",
  "no-guarantor": "Je n'ai pas de garant",
  "more-information": "En difficulté pour répondre à la question ?",
  "ask-guarantor": "Souhaitez-vous ajouter :",
  "remark-title": "Remarque",
  "remark-text": "Ajouter un garant n’est en aucun cas obligatoire. Si vous ne souhaitez pas ajouter de garant, vous pouvez sélectionner « Je n'ai pas de garant ».<br> Votre dossier sera alors enregistré pour être instruit.",
  "type-required": "Veuillez sélectionner un choix",
  "visale-title": "Connaissez-vous Visale ?",
  "visale-text": "Visale est le garant de votre futur logement si vous avez entre 18 et 30 ans OU si vous êtes salariés de + de 30 ans (soumis à conditions).",
  "visale-btn": "Découvrir Visale"
}
}
</i18n>
