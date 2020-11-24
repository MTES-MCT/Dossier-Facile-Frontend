<template>
  <div>
    <div>
      <label class="rf-label" for="select">
        Votre situation d'hébergement actuelle :
      </label>
      <select
        v-model="financialDocument"
        class="rf-select"
        id="select"
        name="select"
      >
        <option value="" selected disabled hidden>- Select -</option>
        <option v-for="d in documents" :value="d" :key="d.key">{{
          $t(d.key)
        }}</option>
      </select>
    </div>
    <div v-if="financialDocument.key">
      <div class="rf-margin-bottom-3N">
        {{ financialDocument.explanationText }}
      </div>
      <div class="rf-margin-bottom-3N">
        <FileUpload></FileUpload>
      </div>
      <div class="rf-margin-bottom-3N">
        <DocumentInsert
          :allow-list="financialDocument.acceptedProofs"
          :block-list="financialDocument.refusedProofs"
        ></DocumentInsert>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { DocumentType } from "df-shared/src/models/Document";
import DocumentInsert from "@/components/DocumentInsert.vue";
import FileUpload from "@/components/uploads/FileUpload.vue";
import { mapState } from "vuex";

@Component({
  components: { DocumentInsert, FileUpload },
  computed: {
    ...mapState({
      user: "user",
      currentStep: "currentStep"
    })
  }
})
export default class Financial extends Vue {
  financialDocument = new DocumentType();
  documents: DocumentType[] = [
    {
      key: "salary",
      value: "SALARY",
      explanationText:
        "J’ajoute mes trois derniers bulletins de salaire, ou un justificatif de mes indemnités de stage, ou mes deux derniers bilans comptables (non-salariés).",
      acceptedProofs: [
        "3 derniers bulletins de salaire",
        "Justificatif de versement des indemnités de stage",
        "2 derniers bilans comptables ou, si nécessaire, attestation des ressources pour l'exercice en cours délivrés par un comptable (non-salariés)"
      ],
      refusedProofs: [
        "Pièces trop anciennes",
        "Attestation de l’employeur",
        "Relevés de comptes bancaires",
        "RIB",
        "Avis d’imposition"
      ]
    },
    {
      key: "social-service",
      value: "SOCIAL_SERVICE",
      explanationText:
        "J’ajoute mes trois derniers justificatifs de versement de prestations sociales (ARE, CAF, Crous…), un justificatif d’ouverture des droits, ou une attestation de simulation pour les aides au logement.",
      acceptedProofs: [
        "3 derniers justificatifs de versement des prestations sociales et familiales et allocations (ARE, CAF, Crous, etc.)",
        "Justificatif de l'ouverture des droits établis par l'organisme payeur",
        "Attestation de simulation pour les aides au logement établie par la CAF ou par la MSA pour le locataire"
      ],
      refusedProofs: [
        "Pièces trop anciennes",
        "Relevés de comptes bancaires",
        "RIB",
        "Avis d’imposition"
      ]
    },
    {
      key: "rent",
      value: "RENT",
      explanationText:
        "J’ajoute un justificatif de paiement de rente, ou un avis d’imposition avec noms et revenus de la rente visibles.",
      acceptedProofs: [
        "Justification de revenus fonciers, de rentes viagères ou de revenus de valeurs et capitaux mobiliers",
        "Titre de propriété d'un bien immobilier ou dernier avis de taxe foncière",
        "Dernier ou avant-dernier avis d’imposition avec nom et revenus de la rente visibles"
      ],
      refusedProofs: ["Relevés de comptes bancaires", "RIB"]
    },
    {
      key: "pension",
      value: "PENSION",
      explanationText:
        "J’ajoute un bulletin de pension, une attestation de pension, ou un avis d’imposition avec noms et revenus de la pension visibles.",
      acceptedProofs: [
        "Justificatif de versement des indemnités, retraites, pensions perçues lors des 3 derniers mois ou justificatif de l'ouverture des droits établis par l'organisme payeur",
        "Dernier ou avant-dernier avis d’imposition avec nom et revenus de la pension visibles"
      ],
      refusedProofs: [
        "Pièces trop anciennes",
        "Relevés de comptes bancaires",
        "RIB"
      ]
    },
    {
      key: "trading",
      value: "TRADING",
      explanationText: "J’ajoute un avis d'attribution de bourse.",
      acceptedProofs: ["Avis d'attribution de bourse pour l’année en cours"],
      refusedProofs: [
        "Pièces trop anciennes",
        "Relevés de comptes bancaires",
        "RIB"
      ]
    }
  ];
}
</script>

<style scoped lang="scss"></style>

<i18n>
{
"en": {
},
"fr": {
}
}
</i18n>
