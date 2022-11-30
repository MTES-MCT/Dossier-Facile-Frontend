<template>
  <div class="fr-mb-15w">
    <div>
      <div v-if="selectedGuarantor.typeGuarantor === 'NATURAL_PERSON'">
        <div v-if="substep === 0">
          <TenantGuarantorName
            :tenantId="tenantId"
            :guarantor="selectedGuarantor"
            @on-back="goBack"
            @on-next="goNext"
          ></TenantGuarantorName>
        </div>
        <div v-if="substep === 1">
          <GuarantorIdentification
            :isCotenant="true"
            :tenantId="tenantId"
          ></GuarantorIdentification>
          <GuarantorFooter
            @on-back="goBack"
            @on-next="goNext"
          ></GuarantorFooter>
        </div>
        <div v-if="substep === 2">
          <GuarantorResidency :tenantId="tenantId"></GuarantorResidency>
          <GuarantorFooter
            @on-back="goBack"
            @on-next="goNext"
          ></GuarantorFooter>
        </div>
        <div v-if="substep === 3">
          <GuarantorProfessional
            :tenantId="tenantId"
            :isCotenant="true"
          ></GuarantorProfessional>
          <GuarantorFooter
            @on-back="goBack"
            @on-next="goNext"
          ></GuarantorFooter>
        </div>
        <div v-if="substep === 4">
          <GuarantorFinancial
            :tenantId="tenantId"
            @on-back="goBack"
            @on-next="goNext"
          ></GuarantorFinancial>
        </div>
        <div v-if="substep === 5">
          <GuarantorTax
            :tenantId="tenantId"
            :isCotenant="true"
            @on-back="goBack"
            @on-next="nextStep"
          ></GuarantorTax>
        </div>
      </div>
      <div v-if="selectedGuarantor.typeGuarantor === 'ORGANISM'">
        <OrganismCert
          :is-cotenant="true"
          :guarantor="selectedGuarantor"
        ></OrganismCert>
        <GuarantorFooter
          @on-back="goBack"
          @on-next="nextStep"
        ></GuarantorFooter>
      </div>
      <div v-if="selectedGuarantor.typeGuarantor === 'LEGAL_PERSON'">
        <div v-if="substep === 0">
          <CorporationIdentification
            :tenantId="tenantId"
            :guarantor="selectedGuarantor"
          ></CorporationIdentification>
          <GuarantorFooter
            @on-back="goBack"
            @on-next="goNext"
          ></GuarantorFooter>
        </div>
        <div v-if="substep === 1">
          <RepresentativeIdentification
            :tenantId="tenantId"
            :guarantor="selectedGuarantor"
          ></RepresentativeIdentification>
          <GuarantorFooter
            @on-back="goBack"
            @on-next="nextStep"
          ></GuarantorFooter>
        </div>
      </div>
    </div>
    <ConfirmModal
      v-if="changeGuarantorVisible"
      @valid="validSelect()"
      @cancel="undoSelect()"
    >
      <span>{{ $t("will-delete-guarantor") }}</span>
    </ConfirmModal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import TenantGuarantorName from "./documents/naturalGuarantor/TenantGuarantorName.vue";
import RepresentativeIdentification from "./documents/legalPersonGuarantor/RepresentativeIdentification.vue";
import CorporationIdentification from "./documents/legalPersonGuarantor/CorporationIdentification.vue";
import OrganismCert from "./documents/organismGuarantor/OrganismCert.vue";
import GuarantorIdentification from "./documents/naturalGuarantor/GuarantorIdentification.vue";
import GuarantorResidency from "./documents/naturalGuarantor/GuarantorResidency.vue";
import GuarantorProfessional from "./documents/naturalGuarantor/GuarantorProfessional.vue";
import GuarantorFinancial from "./documents/naturalGuarantor/GuarantorFinancial.vue";
import GuarantorTax from "./documents/naturalGuarantor/GuarantorTax.vue";
import { mapState } from "vuex";
import { Guarantor } from "df-shared/src/models/Guarantor";
import { User } from "df-shared/src/models/User";
import DfButton from "df-shared/src/Button/Button.vue";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";
import VGouvFrButton from "df-shared/src/Button/v-gouv-fr-button/VGouvFrButton.vue";
import GuarantorFooter from "./footer/GuarantorFooter.vue";
import GuarantorChoiceHelp from "./helps/GuarantorChoiceHelp.vue";
import BigRadio from "df-shared/src/Button/BigRadio.vue";
import VGouvFrModal from "df-shared/src/GouvFr/v-gouv-fr-modal/VGouvFrModal.vue";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import ProfileContainer from "./ProfileContainer.vue";

@Component({
  components: {
    DfButton,
    TenantGuarantorName,
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
    BigRadio,
    VGouvFrModal,
    NakedCard,
    ProfileContainer
  },
  computed: {
    ...mapState({
      coTenants: "coTenants",
      selectedGuarantor: "selectedGuarantor"
    })
  }
})
export default class TenantGuarantorDocuments extends Vue {
  @Prop({ default: 0 }) substep!: number;
  @Prop() guarantorId!: number;
  @Prop() tenantId!: number;

  user!: User;
  coTenants!: User[];
  selectedGuarantor!: Guarantor;
  tmpGuarantorType = "";
  changeGuarantorVisible = false;

  validSelect() {
    this.$store.dispatch("deleteAllGuarantors").then(
      () => {
        this.changeGuarantorVisible = false;
        if (!this.user.guarantors?.length || 0 >= 1) {
          this.$router.push({ name: "GuarantorChoice" });
        }
      },
      () => {
        Vue.toasted.global.error();
      }
    );
  }

  undoSelect() {
    this.tmpGuarantorType = this.selectedGuarantor.typeGuarantor || "";
    this.changeGuarantorVisible = false;
  }

  goBack() {
    if (this.substep > 0) {
      this.$router.push({
        name: "TenantGuarantorDocuments",
        params: {
          step: this.$route.params.step,
          substep: (this.substep - 1).toString(),
          tenantId: this.$route.params.tenantId,
          guarantorId: this.$route.params.guarantorId
        }
      });
    } else {
      this.$emit("on-next");
    }
  }

  goNext() {
    this.$router.push({
      name: "TenantGuarantorDocuments",
      params: {
        step: this.$route.params.step,
        substep: (this.substep + 1).toString(),
        tenantId: this.$route.params.tenantId,
        guarantorId: this.$route.params.guarantorId
      }
    });
  }

  nextStep() {
    this.$emit("on-next");
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
  border-radius: 0.25rem;
}

.card-container {
  @media all and (min-width: 992px) {
    width: fit-content;
  }
}

.small-font {
  font-size: 14px;
}
</style>

<i18n>
{
"en": {
"identification": "Pièce d’identité",
"residency": "Justificatif de domicile",
"professional": "Justificatif de situation professionnelle",
"financial": "Justificatif de ressources",
"tax": "Avis d’imposition",
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
"remark-text": "Adding a guarantor is by no means mandatory. If you do not wish to add a surety, you can select “I don't have a guarantor”. Your file will then be registered for investigation."
},
"fr": {
"identification": "Pièce d’identité",
"residency": "Justificatif de domicile",
"professional": "Justificatif de situation professionnelle",
"financial": "Justificatif de ressources",
"tax": "Avis d’imposition",
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
"remark-text": "Ajouter un garant n’est en aucun cas obligatoire. Si vous ne souhaitez pas ajouter de garant, vous pouvez sélectionner « Je n'ai pas de garant ». Votre dossier sera alors enregistré pour être instruit."
}
}
</i18n>
