<template>
  <div>
    <div v-if="guarantors.length > 0" class="main-guarantor-information">
      <div v-for="g in guarantors" v-bind:key="g.id">
        <hr />
        <div class="inline-block-flex item-action">
          <h4>
            {{ guarantorTitle(g) }}
          </h4>
          <a
            href
            :title="$t('delete-guarantor')"
            @click.prevent="openConfirmModal(g)"
            >{{ $t("delete-guarantor") }}</a
          >
        </div>
        <div v-if="g.typeGuarantor === 'NATURAL_PERSON'">
          <div class="fr-grid-row fr-grid-row--gutters">
            <InfoCard
              :title="$t('identification')"
              editable="true"
              matIcon="person"
              @click="setGuarantorSubStep(1, g)"
            >
              <ColoredTag
                :status="getGuarantorStatus(g, 'IDENTIFICATION')"
                :text="$t('s_' + getGuarantorStatus(g, 'IDENTIFICATION'))"
              ></ColoredTag>
            </InfoCard>

            <InfoCard
              :title="$t('residency')"
              editable="true"
              matIcon="home"
              @click="setGuarantorSubStep(2, g)"
            >
              <ColoredTag
                :status="getGuarantorStatus(g, 'RESIDENCY')"
                :text="$t('s_' + getGuarantorStatus(g, 'RESIDENCY'))"
              ></ColoredTag>
            </InfoCard>

            <InfoCard
              :title="$t('professional')"
              editable="true"
              matIcon="work"
              @click="setGuarantorSubStep(3, g)"
            >
              <ColoredTag
                :status="getGuarantorStatus(g, 'PROFESSIONAL')"
                :text="$t('s_' + getGuarantorStatus(g, 'PROFESSIONAL'))"
              ></ColoredTag>
            </InfoCard>

            <InfoCard
              :title="$t('financial')"
              editable="true"
              matIcon="euro"
              @click="setGuarantorSubStep(4, g)"
            >
              <ColoredTag
                :status="getGuarantorStatus(g, 'FINANCIAL')"
                :text="$t('s_' + getGuarantorStatus(g, 'FINANCIAL'))"
              ></ColoredTag>
            </InfoCard>

            <InfoCard
              :title="$t('tax')"
              editable="true"
              matIcon="content_copy"
              @click="setGuarantorSubStep(5, g)"
            >
              <ColoredTag
                :status="getGuarantorStatus(g, 'TAX')"
                :text="$t('s_' + getGuarantorStatus(g, 'TAX'))"
              ></ColoredTag>
            </InfoCard>
          </div>
        </div>
        <div v-else-if="g.typeGuarantor === 'ORGANISM'">
          <div class="fr-grid-row fr-grid-row--gutters">
            <InfoCard
              :title="$t('organism-identification')"
              editable="true"
              matIcon="person"
              @click="setGuarantorSubStep(1, g)"
            >
              <ColoredTag
                :status="getGuarantorStatus(g, 'IDENTIFICATION')"
                :text="$t('s_' + getGuarantorStatus(g, 'IDENTIFICATION'))"
              ></ColoredTag>
            </InfoCard>
          </div>
        </div>
        <div v-else-if="g.typeGuarantor === 'LEGAL_PERSON'">
          <div class="fr-grid-row fr-grid-row--gutters">
            <InfoCard
              :title="$t('identification-legal-person')"
              editable="true"
              matIcon="person"
              @click="setGuarantorSubStep(1, g)"
            >
              <ColoredTag
                :status="getGuarantorStatus(g, 'IDENTIFICATION_LEGAL_PERSON')"
                :text="
                  $t(
                    's_' + getGuarantorStatus(g, 'IDENTIFICATION_LEGAL_PERSON')
                  )
                "
              ></ColoredTag>
            </InfoCard>
          </div>
        </div>
      </div>
      <ConfirmModal
        v-if="showConfirmModal"
        @valid="removeSelectedGuarantor()"
        @cancel="closeConfirmModal()"
      >
        <div>{{ $t("confirm-delete-guarantor") }}</div>
      </ConfirmModal>
    </div>

    <div
      v-if="
        guarantors.length === 0 ||
          (guarantors.length === 1 &&
            guarantors[0].typeGuarantor === 'NATURAL_PERSON')
      "
    >
      <hr />
      <h4>{{ $t("my-guarantor") }}</h4>
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-12 fr-col-md-6 fr-col-xl-4 fr-pt-1w">
          <button
            class="bg-purple add-guarantor-btn"
            @click.prevent="setAddGuarantorStep()"
          >
            {{ $t("add-guarantor") }}
          </button>
        </div>

        <div
          v-if="guarantors.length === 0"
          class="fr-col-12 fr-col-md-6 fr-col-xl-4 fr-pt-1w"
        >
          <a
            class="cleana"
            href="https://www.visale.fr/#!/"
            rel="noreferrer"
            target="_blank"
            :title="$t('go-to-visale')"
          >
            <div class="fr-tile bg-purple">
              <div>{{ $t("visale-text") }}</div>
              <div class="inline-block-flex space-between">
                <div>
                  <div class="fr-h5">{{ $t("visale-title") }}</div>
                </div>
                <div>
                  <img
                    alt="logo visale"
                    class="logo-visale"
                    src="../../assets/visale.svg"
                  />
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Guarantor } from "df-shared/src/models/Guarantor";
import { AnalyticsService } from "@/services/AnalyticsService";
import { DfDocument } from "df-shared/src/models/DfDocument";
import InfoCard from "@/components/account/InfoCard.vue";
import ColoredTag from "df-shared/src/components/ColoredTag.vue";
import { mapGetters } from "vuex";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";
import { User } from "df-shared/src/models/User";

@Component({
  components: { InfoCard, ColoredTag, ConfirmModal },
  computed: {}
})
export default class GuarantorsSection extends Vue {
  @Prop() tenant!: User;
  guarantors!: Guarantor[];
  showConfirmModal = false;
  selectedGuarantor: Guarantor | undefined;

  beforeMount() {
    this.guarantors = this.tenant.guarantors as Guarantor[];
  }

  guarantorTitle(g: Guarantor) {
    if (g.typeGuarantor === "NATURAL_PERSON")
      return (
        this.$t("my-guarantor") +
        (g.firstName || g.lastName ? ", " + g.firstName + " " + g.lastName : "")
      );
    else if (g.typeGuarantor === "LEGAL_PERSON" && g.legalPersonName) {
      return this.$t("my-guarantor") + ", " + g.legalPersonName;
    }
    return this.$t("guarantors-information");
  }

  isFinancialValid(docs: DfDocument[]) {
    if (!docs || docs.length === 0) {
      return "INCOMPLETE";
    }

    for (const doc of docs) {
      if (!doc.noDocument && (doc.files?.length || 0) <= 0) {
        return "INCOMPLETE";
      }
    }

    for (const doc of docs) {
      if (doc.documentStatus === "DECLINED") {
        return "DECLINED";
      }
    }

    for (const doc of docs) {
      if (doc.documentStatus === "TO_PROCESS") {
        return "TO_PROCESS";
      }
    }

    return "VALIDATED";
  }

  getGuarantorStatus(g: Guarantor, docType: string) {
    if (docType === "FINANCIAL") {
      const docs = g.documents?.filter(d => {
        return d.documentCategory === "FINANCIAL";
      });
      return this.isFinancialValid(docs || []);
    }
    const doc = g.documents?.find((d: DfDocument) => {
      return d.documentCategory === docType;
    });
    return doc?.documentStatus || "EMPTY";
  }

  setGuarantorSubStep(n: number, g: Guarantor) {
    AnalyticsService.editFromAccount(n);
    this.$store.dispatch("setGuarantorPage", { guarantor: g, substep: n });
  }

  setAddGuarantorStep() {
    AnalyticsService.editAccount("guarantor");
    if (this.guarantors.length > 0) {
      this.$store.dispatch("addNaturalGuarantor");
    } else {
      this.$router.push({ name: "GuarantorChoice" });
    }
  }

  openConfirmModal(g: Guarantor) {
    this.showConfirmModal = true;
    this.selectedGuarantor = g;
  }
  closeConfirmModal() {
    this.showConfirmModal = false;
    this.selectedGuarantor = undefined;
  }

  removeSelectedGuarantor() {
    this.$store.dispatch("deleteGuarantor", this.selectedGuarantor).then(
      () => {
        Vue.toasted.global.delete_success();
        this.guarantors = this.guarantors.filter(
          g => g.id != this.selectedGuarantor?.id
        );
        this.closeConfirmModal();
      },
      () => {
        Vue.toasted.global.delete_failed();
        this.closeConfirmModal();
      }
    );
  }
}
</script>

<style lang="scss" scoped>
hr {
  border: 0;
  margin-top: 2rem;
  margin-left: 20%;
  margin-right: 20%;
  border-top: 1px solid var(--g400);
}

.inline-block-flex {
  display: flex;
  flex-direction: row;

  .fr-h5 {
    font-size: 1rem;
  }
}
.item-action {
  gap: 2em;
  align-items: baseline;
  a {
    font-size: 1rem;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: #000091;
    text-decoration: none;
  }

  a[href] {
    text-decoration: none;
    box-shadow: none;
  }
}

.add-guarantor-btn {
  border-radius: 0.5rem;
  border: 1px solid var(--primary);
  min-height: 7.5rem;
  padding: 1.75rem;
  color: var(--primary);
  width: 100%;
  height: 100%;
  font-size: 1rem;
  background: var(--blue-france-925);
  &:hover {
    background: var(--blue-france-hover);
  }
  &:active {
    background: var(--blue-france-active);
  }
}

.bg-purple {
  margin: 0px;
  background-color: var(--blue-france-925);
}

.logo-visale {
  width: 138px;
  height: 45px;
  margin-bottom: 1rem;
}

.cleana {
  &:after {
    content: none;
  }
}
a.cleana:focus {
  outline-style: auto;
}
</style>

<i18n>

{
  "en": {
    "my-guarantor": "My guarantor",
    "guarantors-information": "My guarantors information",
    "identification-legal-person": "Legal person identification",
    "organism-identification": "Organism",
    "delete-guarantor": "Delete guarantor",
    "confirm-delete-guarantor" : "Are you sure to delete this guarantor ?",
    "add-guarantor": "Add a guarantor ?",
    "visale-title": "Do you know Visale ?",
    "visale-text": "Visale is the guarantor of your future accommodation if you are between 18 and 30 years old OR if you are employees over 30 years old (subject to conditions).",
    "go-to-visale": "Go to « visale »'s website (new window)",
    "identification": "Identification",
    "residency": "Residency",
    "professional": "Professional",
    "financial": "Financial",
    "tax": "Tax",
    "s_TO_PROCESS": "To process",
    "s_VALIDATED": "Validated",
    "s_DECLINED": "Declined",
    "s_INCOMPLETE": "Incomplete",
    "s_EMPTY": "Empty",
    "TO_PROCESS": "to process",
    "VALIDATED": "is validated",
    "DECLINED": "is declined",
    "INCOMPLETE": "is incomplete"
  },
  "fr": {
    "guarantors-information": "Les informations de mes garants",
    "my-guarantor": "Mon garant",
    "identification-legal-person": "Identification de la personne morale",
    "organism-identification": "Certificat de l'organisme",
    "delete-guarantor": "Supprimer ce garant",
    "confirm-delete-guarantor" : "Êtes-vous sur de vouloir supprimer ce garant ?",
    "add-guarantor": "Ajouter un garant ?",
    "visale-title": "Connaissez-vous Visale ?",
    "visale-text": "Visale est le garant de votre futur logement si vous avez entre 18 et 30 ans OU si vous êtes salariés de + de 30 ans (soumis à conditions).",
    "go-to-visale": "Aller sur le site de « visale » (nouvelle fenêtre)",
    "identification": "Pièce d'identité",
    "residency": "Justificatif de domicile",
    "professional": "Justificatif de situation professionnelle",
    "financial": "Justificatif de ressources",
    "tax": "Avis d’imposition",
    "s_TO_PROCESS": "En cours de traitement",
    "s_VALIDATED": "Vérifié",
    "s_DECLINED": "Modification demandée",
    "s_INCOMPLETE": "Non terminé",
    "s_EMPTY": "Document manquant",
    "TO_PROCESS": "est en cours de traitement",
    "VALIDATED": "est vérifié",
    "DECLINED": "nécessite une modification",
    "INCOMPLETE": "est non terminé"
  }
}
</i18n>
