<template>
  <div>
    <NakedCard class="fr-p-5w">
      <h6 class="color--red">{{ $t("error-title") }}</h6>
      <p>
        {{ $t("file-not-valid") }}
      </p>
      <div>
        {{ $t("my-missing-documents") }}
      </div>
      <div v-if="!hasDoc('IDENTIFICATION')">
        <div class="fr-grid-row file-item">
          <span>{{ $t("identification") }}</span
          ><DfButton @on-click="openTenant(1)">{{ $t("update") }}</DfButton>
        </div>
      </div>
      <div v-if="!hasDoc('RESIDENCY')">
        <div class="fr-grid-row file-item">
          <span>{{ $t("residency") }}</span
          ><DfButton @on-click="openTenant(2)">{{ $t("update") }}</DfButton>
        </div>
      </div>
      <div v-if="!hasDoc('PROFESSIONAL')">
        <div class="fr-grid-row file-item">
          <span>{{ $t("professional") }}</span
          ><DfButton @on-click="openTenant(3)">{{ $t("update") }}</DfButton>
        </div>
      </div>
      <div v-if="!isFinancialValid()">
        <div class="fr-grid-row file-item">
          <span>{{ $t("financial") }}</span
          ><DfButton @on-click="openTenant(4)">{{ $t("update") }}</DfButton>
        </div>
      </div>
      <div v-if="!isTaxValid()">
        <div class="fr-grid-row file-item">
          <span>{{ $t("tax") }}</span
          ><DfButton @on-click="openTenant(5)">{{ $t("update") }}</DfButton>
        </div>
      </div>
    </NakedCard>

    <div class="fr-mt-3w" v-for="g in user.guarantors" v-bind:key="g.id">
      <div v-if="g.typeGuarantor === 'NATURAL_PERSON'">
        <NakedCard v-if="!documentsGuarantorFilled(g)" class="fr-p-5w">
          <h6 class="color--red">{{ $t("error-title-guarantor") }}</h6>
          <div>
            {{ $t("his-missing-documents") }}
          </div>
          <div v-if="!guarantorHasDoc(g, 'IDENTIFICATION')">
            <div class="fr-grid-row file-item">
              <span>{{ $t("identification") }}</span
              ><DfButton @on-click="openGuarantor(g, 1)">{{
                $t("update")
              }}</DfButton>
            </div>
          </div>
          <div v-if="!guarantorHasDoc(g, 'RESIDENCY')">
            <div class="fr-grid-row file-item">
              <span>{{ $t("residency") }}</span
              ><DfButton @on-click="openGuarantor(g, 2)">{{
                $t("update")
              }}</DfButton>
            </div>
          </div>
          <div v-if="!guarantorHasDoc(g, 'PROFESSIONAL')">
            <div class="fr-grid-row file-item">
              <span>{{ $t("professional") }}</span
              ><DfButton @on-click="openGuarantor(g, 3)">{{
                $t("update")
              }}</DfButton>
            </div>
          </div>
          <div v-if="!isGuarantorFinancialValid(g)">
            <div class="fr-grid-row file-item">
              <span>{{ $t("financial") }}</span
              ><DfButton @on-click="openGuarantor(g, 4)">{{
                $t("update")
              }}</DfButton>
            </div>
          </div>
          <div v-if="!isGuarantorTaxValid(g)">
            <div class="fr-grid-row file-item">
              <span>{{ $t("tax") }}</span
              ><DfButton @on-click="openGuarantor(g, 5)">{{
                $t("update")
              }}</DfButton>
            </div>
          </div>
        </NakedCard>
      </div>
      <div v-if="g.typeGuarantor === 'LEGAL_PERSON'">
        <div v-if="!guarantorHasDoc(g, 'IDENTIFICATION')">
          <div class="fr-grid-row file-item">
            <span>{{ $t("identification") }}</span
            ><DfButton @on-click="openGuarantor(g, 1)">{{
              $t("update")
            }}</DfButton>
          </div>
        </div>
        <div v-if="!guarantorHasDoc(g, 'IDENTIFICATION_LEGAL_PERSON')">
          <div class="fr-grid-row file-item">
            <span>{{ $t("identification-legal-person") }}</span
            ><DfButton @on-click="openGuarantor(g, 1)">{{
              $t("update")
            }}</DfButton>
          </div>
        </div>
      </div>
      <div v-if="g.typeGuarantor === 'ORGANISM'">
        <div v-if="!guarantorHasDoc(g, 'IDENTIFICATION')">
          <div class="fr-grid-row file-item">
            <span>{{ $t("identification") }}</span
            ><DfButton @on-click="openGuarantor(g, 1)">{{
              $t("update")
            }}</DfButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Guarantor } from "df-shared/src/models/Guarantor";
import { User } from "df-shared/src/models/User";
import { Component, Vue } from "vue-property-decorator";
import { mapState } from "vuex";
import { UtilsService } from "../services/UtilsService";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import DfButton from "df-shared/src/Button/Button.vue";
@Component({
  components: { NakedCard, DfButton },
  computed: {
    ...mapState({
      user: "user"
    })
  }
})
export default class FileErrors extends Vue {
  user!: User;

  hasDoc(docType: string) {
    return UtilsService.hasDoc(docType);
  }

  isFinancialValid() {
    return UtilsService.isFinancialValid();
  }

  isTaxValid() {
    return UtilsService.isTaxValid();
  }

  guarantorHasDoc(g: Guarantor, docType: string) {
    return UtilsService.guarantorHasDoc(docType, g);
  }

  isGuarantorFinancialValid(g: Guarantor) {
    return UtilsService.isGuarantorFinancialValid(g);
  }

  isGuarantorTaxValid(g: Guarantor) {
    return UtilsService.isGuarantorTaxValid(g);
  }

  documentsGuarantorFilled(g: Guarantor) {
    return UtilsService.guarantorDocumentsFilled(g);
  }

  getGuarantorName(g: Guarantor) {
    if (g.lastName || g.firstName) {
      return g.lastName + " " + g.firstName;
    }
    return "";
  }

  openTenant(substep: string) {
    this.$router.push({
      name: "TenantDocuments",
      params: { substep: substep }
    });
  }

  openGuarantor(g: Guarantor, substep: string) {
    this.$store.dispatch("setGuarantorPage", {
      guarantor: g,
      substep: substep
    });
  }
}
</script>

<style scoped lang="scss">
.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--g200);
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 1rem;
}
</style>

<i18n>
{
	"en": {
		"identification": "Identification",
		"professional": "Professional",
		"residency": "Residency",
		"financial": "Financial",
		"tax": "Tax",
    "file-not-valid": "Your file is not valid, please complete the missing documents to submit your file",
    "error-title": "File not complete",
    "error-title-guarantor": "Guarantor file not complete",
    "my-missing-documents": "My missing documents:",
    "his-missing-documents": "Guarantor missing documents:",
    "update": "Update",
    "identification-legal-person": "Legal person identification"
	},
	"fr": {
		"identification": "Pièce d'identité",
		"residency": "Justificatif de domicile",
		"professional": "Justificatif de situation professionnelle",
		"financial": "Justificatif de ressources",
		"tax": "Avis d'imposition",
    "file-not-valid": "Votre dossier n'est pas valide, veuillez compléter les documents manquants pour soumettre votre dossier",
    "error-title": "Dossier incomplet",
    "error-title-guarantor": "Dossier garant incomplet",
    "my-missing-documents": "Vos documents manquants :",
    "his-missing-documents": "Ses documents manquants :",
    "update": "Mettre à jour",
    "identification-legal-person": "Identification de la personne morale"
	}
}
</i18n>
