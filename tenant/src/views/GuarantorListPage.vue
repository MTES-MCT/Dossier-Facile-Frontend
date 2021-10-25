<template>
  <ProfileContainer :step="3">
    <NakedCard class="fr-p-md-5w">
      <h5>
        {{ $t("my-guarantor") }}
      </h5>
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
      <div class="remark fr-mt-3w fr-mb-3w">
        <h5>{{ $t("remark-title") }}</h5>
        {{ $t("remark-text") }}<br />
        {{ $t("remark-text-2") }}
      </div>
      <div v-for="g in user.guarantors" :key="g.id">
        <NakedCard class="fr-mb-3w fr-p-3w">
          <div class="fr-grid-row space-between">
            <div class="v-center">
              <div>{{ getGuarantorName(g) }}</div>
            </div>
            <div class="fr-grid-row">
              <div class="fr-p-0 fr-mr-3w">
                <div class="fr-tag">{{ $t(getStatus(g)) }}</div>
              </div>
              <button
                @click="editGuarantor(g)"
                class="fr-p-0 fr-mr-3w icon-btn"
              >
                <div class="color--primary material-icons md-24 fr-m-1w">
                  edit
                </div>
              </button>
              <button
                @click="removeGuarantor(g)"
                class="fr-p-0 fr-mr-3w icon-btn"
              >
                <div class="color--primary material-icons md-24 fr-m-1w">
                  delete
                </div>
              </button>
            </div>
          </div>
        </NakedCard>
      </div>
      <div v-if="hasOneNaturalGuarantor()">
        <button @click="addNaturalGuarantor()" class="add-guarantor-btn">
          {{ $t("add-new-guarantor") }}
        </button>
      </div>
    </NakedCard>

    <GuarantorFooter @on-back="goBack" @on-next="goNext"></GuarantorFooter>
  </ProfileContainer>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters, mapState } from "vuex";
import { User } from "df-shared/src/models/User";
import GuarantorFooter from "@/components/footer/GuarantorFooter.vue";
import GuarantorChoiceHelp from "../components/helps/GuarantorChoiceHelp.vue";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import ProfileContainer from "@/components/ProfileContainer.vue";
import VGouvFrModal from "df-shared/src/GouvFr/v-gouv-fr-modal/VGouvFrModal.vue";
import { Guarantor } from "df-shared/src/models/Guarantor";
import { DfDocument } from "df-shared/src/models/DfDocument";

@Component({
  components: {
    GuarantorFooter,
    GuarantorChoiceHelp,
    NakedCard,
    ProfileContainer,
    VGouvFrModal
  },
  computed: {
    ...mapState({
      user: "user"
    }),
    ...mapGetters({
      guarantors: "guarantors"
    })
  }
})
export default class GuarantorListPage extends Vue {
  user!: User;
  guarantors!: Guarantor[];

  beforeMount() {
    this.$store.commit("expandGuarantorMenu", false);
    if (
      !this.user.guarantors ||
      this.user.guarantors.length === 0 ||
      (this.user.guarantors.length === 1 &&
        this.user.guarantors[0].typeGuarantor === "NATURAL_GUARANTOR" &&
        !this.user.guarantors[0].lastName) ||
      (this.user.guarantors[0].typeGuarantor === "ORGANISM" &&
        (this.user.guarantors[0].documents?.length || 0) <= 0)
    ) {
      this.$router.push({
        name: "GuarantorDocuments",
        params: { substep: "0" }
      });
      return;
    }
  }

  getGuarantorName(g: Guarantor) {
    if (g.firstName || g.lastName) {
      return `${g.firstName || ""} ${g.lastName || ""}`;
    }
    return this.$i18n.t("guarantor");
  }

  goBack() {
    this.$router.push({
      name: "GuarantorChoice"
    });
  }

  goNext() {
    this.$router.push({
      name: "ValidateFile"
    });
  }

  getStatus(g: Guarantor) {
    if (!g.documents) {
      return;
    }
    if (
      (g.typeGuarantor === "NATURAL_PERSON" && g.documents.length < 5) ||
      (g.typeGuarantor === "LEGAL_PERSON" && g.documents.length < 2) ||
      (g.typeGuarantor === "ORGANISM" && g.documents.length < 1)
    ) {
      return "INCOMPLETE";
    }

    const hasDeclined =
      g.documents?.find((d: DfDocument) => {
        return d.documentStatus === "DECLINED";
      }) !== undefined;
    if (hasDeclined) {
      return "DECLINED";
    }

    const hasToProcess =
      g.documents?.find((d: DfDocument) => {
        return d.documentStatus === "TO_PROCESS";
      }) !== undefined;
    if (hasToProcess) {
      return "TO_PROCESS";
    }

    return "VALIDATED";
  }

  editGuarantor(g: Guarantor) {
    this.$store.commit("setSelectedGuarantor", g);
    this.$router.push({ name: "GuarantorDocuments", params: { substep: "0" } });
  }

  removeGuarantor(g: Guarantor) {
    this.$store.dispatch("deleteGuarantor", g).then(
      () => {
        if (!this.user.guarantors?.length || 0 >= 1) {
          this.$router.push({ name: "GuarantorChoice" });
        }
      },
      () => {
        Vue.toasted.global.error();
      }
    );
  }

  hasOneNaturalGuarantor() {
    return (
      this.guarantors.length === 1 &&
      this.guarantors[0].typeGuarantor === "NATURAL_PERSON"
    );
  }

  addNaturalGuarantor() {
    this.$store.dispatch("addNaturalGuarantor");
  }
}
</script>

<style scoped lang="scss">
@import "df-shared/src/scss/_variables.scss";

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

.remark {
  background-color: #e5e5f4;
  padding: 1rem;
  border-radius: 0.25rem;
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

.logo-visale {
  width: 134px;
  height: 44px;
  margin-bottom: 1rem;
}

.add-guarantor-btn {
  border-radius: 0.5rem;
  background: var(--blue-france-200);
  padding: 1.75rem;
  color: var(--primary);
  border: 1px solid var(--primary);
  width: 100%;
  font-size: 16px;
}
</style>

<i18n>
{
"en": {
  "more-information": "More information",
  "my-guarantor": "My guarantor",
  "remark-title": "Remark",
  "remark-text": "Adding a guarantor is by no means mandatory. If you do not wish to add a surety, you can select “I don't have a guarantor”.",
  "remark-text-2": "Your file will then be registered for investigation.",
  "add-new-guarantor": "Add a new guarantor ?",
  "guarantor": "My guarantor",
  "EMPTY": "Empty",
  "TO_PROCESS":"To process",
  "VALIDATED":"Validated",
  "DECLINED":"Declined",
  "INCOMPLETE":"Incomplete"
},
"fr": {
  "more-information": "En difficulté pour répondre à la question ?",
  "my-guarantor": "Mon garant",
  "remark-title": "Remarque",
  "remark-text": "Ajouter un garant n’est en aucun cas obligatoire. Si vous ne souhaitez pas ajouter de garant, nous pouvez cliquer directement sur le bouton ci-dessous, « Je n'ai pas de garant ».",
  "remark-text-2":"Votre dossier sera alors enregistré pour être instruit.",
  "add-new-guarantor": "Ajouter un nouveau garant ?",
  "guarantor": "Mon garant",
  "EMPTY": "Absent",
  "TO_PROCESS":"En cours de traitement",
  "VALIDATED":"Vérifié",
  "DECLINED":"Modification demandée",
  "INCOMPLETE":"Non terminé"
  }
}
</i18n>
