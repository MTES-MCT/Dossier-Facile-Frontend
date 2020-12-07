<template>
  <div>
    <div>
      <label class="rf-label" for="select">
        Attention, Veuillez renseigner uniquement vos propres revenus.
      </label>
      <select
        v-model="financialDocument"
        class="rf-select rf-mb-3w"
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
      <div class="rf-mb-3w">
        {{ financialDocument.explanationText }}
      </div>
      <div class="rf-mb-3w">
        <FileUpload
          :current-status="fileUploadStatus"
          @add-files="addFiles"
          @reset-files="resetFiles"
        ></FileUpload>
      </div>
      <div class="rf-mb-3w">
        <DocumentInsert
          :allow-list="financialDocument.acceptedProofs"
          :block-list="financialDocument.refusedProofs"
        ></DocumentInsert>
      </div>
    </div>
    <div>
      <ListItem
        v-for="file in files"
        :key="file.name"
        :filename="file.name"
        :uploadState="
          uploadProgress[file.name] ? uploadProgress[file.name].state : 'idle'
        "
        :percentage="
          uploadProgress[file.name] ? uploadProgress[file.name].percentage : 0
        "
      />
    </div>
    <div class="rf-col-12 rf-mb-5w" v-if="financialDocument">
      <button
        class="rf-btn"
        type="submit"
        @click="save"
        :disabled="files.length <= 0"
      >
        Enregistrer la pièce
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { DocumentType } from "df-shared/src/models/Document";
import DocumentInsert from "@/components/documents/DocumentInsert.vue";
import FileUpload from "@/components/uploads/FileUpload.vue";
import { mapState } from "vuex";
import { UploadStatus } from "@/components/uploads/UploadStatus";
import axios from "axios";
import ListItem from "@/components/uploads/ListItem.vue";

@Component({
  components: { DocumentInsert, FileUpload, ListItem },
  computed: {
    ...mapState({
      user: "user",
      currentStep: "currentStep"
    })
  }
})
export default class Financial extends Vue {
  private fileUploadStatus = UploadStatus.STATUS_INITIAL;
  private files: File[] = [];
  private uploadProgress: {
    [key: string]: { state: string; percentage: number };
  } = {};
  financialDocument = new DocumentType();
  addFiles(fileList: File[]) {
    this.files = [...this.files, ...fileList];
  }
  resetFiles() {
    this.fileUploadStatus = UploadStatus.STATUS_INITIAL;
  }
  save() {
    this.uploadProgress = {};
    const fieldName = "documents";
    const formData = new FormData();
    if (!this.files.length) return;
    Array.from(Array(this.files.length).keys()).map(x => {
      formData.append(`${fieldName}[${x}]`, this.files[x], this.files[x].name);
    });

    formData.append("typeDocumentFinancial", this.financialDocument.value);

    this.fileUploadStatus = UploadStatus.STATUS_SAVING;
    const url = `//${process.env.VUE_APP_API_URL}/api/register/documentFinancial`;
    axios
      .post(url, formData)
      .then(() => {
        console.log("success");
        this.fileUploadStatus = UploadStatus.STATUS_SUCCESS;
      })
      .catch(() => {
        console.log("fail");
        this.fileUploadStatus = UploadStatus.STATUS_FAILED;
      });
  }
  documents: DocumentType[] = [
    {
      key: "salary",
      value: "SALARY",
      explanationText:
        "J’ajoute mes trois derniers bulletins de salaire, ou un justificatif de mes indemnités de stage, ou mes deux derniers bilans comptables (non-salariés).",
      acceptedProofs: [
        "3 derniers bulletins de salaire",
        "Justificatif de versement des indemnités de stage",
        "2 derniers bilans comptables ou, si nécessaire, attestation des ressources pour l’exercice en cours délivrés par un comptable (non-salariés)"
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
        "Justificatif de l’ouverture des droits établis par l’organisme payeur",
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
        "Titre de propriété d’un bien immobilier ou dernier avis de taxe foncière",
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
        "Justificatif de versement des indemnités, retraites, pensions perçues lors des 3 derniers mois ou justificatif de l’ouverture des droits établis par l’organisme payeur",
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
      explanationText: "J’ajoute un avis d’attribution de bourse.",
      acceptedProofs: ["Avis d’attribution de bourse pour l’année en cours"],
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
"salary": "Salaire",
"social-service": "Versement de prestations sociales",
"rent": "Rentes",
"pension": "Pensions",
"trading": "Bourses"
},
"fr": {
"salary": "Salaire",
"social-service": "Versement de prestations sociales",
"rent": "Rentes",
"pension": "Pensions",
"trading": "Bourses"
}
}
</i18n>
