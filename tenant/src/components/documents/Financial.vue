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
        <option v-for="d in documents" :value="d" :key="d.key">
          {{ $t(d.key) }}
        </option>
      </select>
    </div>
    <div v-if="financialDocument.key">
      <div>
        <validation-provider
          :rules="{ regex: /^[0-9., ]+$/ }"
          v-slot="{ errors }"
        >
          <div
            class="rf-input-group"
            :class="errors[0] ? 'rf-input-group--error' : ''"
          >
            <label for="monthlySum" class="rf-label"
              >{{ $t("monthlySum-label") }} :</label
            >
            <input
              id="monthlySum"
              :placeholder="$t('monthlySum')"
              type="text"
              v-model="monthlySum"
              name="monthlySum"
              class="validate-required form-control rf-input"
            />
            <span class="rf-error-text" v-if="errors[0]">{{
              $t(errors[0])
            }}</span>
          </div>
        </validation-provider>
      </div>
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
      <div class="rf-col-12 rf-mb-3w">
        <input
          type="checkbox"
          id="noDocument"
          value="false"
          v-model="noDocument"
        />
        <label for="noDocument">{{ $t("noDocument") }}</label>
      </div>
      <div class="rf-mb-5w" v-if="noDocument">
        <div class="rf-input-group">
          <label class="rf-label" for="customText">{{
            $t("customText")
          }}</label>
          <input
            v-model="customText"
            class="form-control rf-input validate-required"
            id="customText"
            name="customText"
            placeholder=""
            type="text"
          />
        </div>
      </div>
      <div class="rf-mb-3w">
        <DocumentInsert
          :allow-list="financialDocument.acceptedProofs"
          :block-list="financialDocument.refusedProofs"
        ></DocumentInsert>
      </div>
    </div>
    <div v-if="financialFiles().length > 0">
      <h5>{{ $t("files") }}</h5>
      <ListItem
        v-for="file in financialFiles()"
        :key="file.id"
        :file="file"
        @remove="remove(file.id)"
      />
    </div>
    <div class="rf-col-12 rf-mb-5w" v-if="financialDocument">
      <button
        class="rf-btn"
        type="submit"
        @click="save"
        :disabled="files.length <= 0 && !noDocument"
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
import { ValidationProvider } from "vee-validate";
import { User } from "df-shared/src/models/User";
import { DfFile } from "df-shared/src/models/DfFile";
import { DfDocument } from "df-shared/src/models/DfDocument";

@Component({
  components: { ValidationProvider, DocumentInsert, FileUpload, ListItem },
  computed: {
    ...mapState({
      user: "user"
    })
  },
})
export default class Financial extends Vue {
  user!: User;
  noDocument = false;
  customText = "";
  monthlySum?: number = 0;
  files: DfFile[] = [];
  fileUploadStatus = UploadStatus.STATUS_INITIAL;
  uploadProgress: {
    [key: string]: { state: string; percentage: number };
  } = {};
  financialDocument = new DocumentType();

  mounted() {
    if (this.user.documents !== null ) {
      const doc = this.user.documents?.find((d: DfDocument) => { return d.documentCategory === 'FINANCIAL'});
      if (doc !== undefined) {
        const localDoc = this.documents.find((d: DocumentType) => { return d.value === doc.documentSubCategory});
        if (localDoc !== undefined) {
          this.financialDocument = localDoc
        }
      }
    }
  }

  addFiles(fileList: File[]) {
    const nf = Array.from(fileList).map(f => { return { name: f.name, file: f} });
    this.files = [...this.files, ...nf];
  }
  resetFiles() {
    this.fileUploadStatus = UploadStatus.STATUS_INITIAL;
  }
  save() {
    this.uploadProgress = {};
    const fieldName = "documents";
    const formData = new FormData();
    if (!this.noDocument) {
      const newFiles = this.files.filter((f) => {return !f.id});
      if (!newFiles.length) return;
      Array.from(Array(newFiles.length).keys()).map(x => {
        const f:File = newFiles[x].file || new File([], "");
        formData.append(`${fieldName}[${x}]`, f, newFiles[x].name);
      });
    }

    formData.append("typeDocumentFinancial", this.financialDocument.value);
    formData.append("noDocument", this.noDocument ? "true" : "false");
    if (this.monthlySum) {
      formData.append("monthlySum", this.monthlySum.toString());
    }
    formData.append("customText", this.customText);

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

  financialFiles() {
    const newFiles = this.files.map(f => {
      return {
        documentSubCategory: this.financialDocument.value,
        id: f.name
      };
    });
    const existingFiles =
      this.user?.documents?.find(d => {
        return d.documentCategory === "FINANCIAL";
      })?.files || [];
    return [...newFiles, ...existingFiles];
  }

  remove(id: number) {
    const url = `//${process.env.VUE_APP_API_URL}/api/file/${id}`;
    // TODO remove locally or update user
    axios.delete(url);
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
"trading": "Bourses",
"monthlySum": "Salaire",
"monthlySum-label": "Montant du revenu (après impôts)",
"noDocument": "Je ne peux pas fournir mes trois derniers bulletins de salaire",
"customText": "Afin d'améliorer mon dossier, j'explique pourquoi je ne peux pas fournir mes trois derniers bulletins de salaire :"
},
"fr": {
"salary": "Salaire",
"social-service": "Versement de prestations sociales",
"rent": "Rentes",
"pension": "Pensions",
"trading": "Bourses",
"monthlySum": "Salaire",
"monthlySum-label": "Montant du revenu (après impôts)",
"noDocument": "Je ne peux pas fournir mes trois derniers bulletins de salaire",
"customText": "Afin d'améliorer mon dossier, j'explique pourquoi je ne peux pas fournir mes trois derniers bulletins de salaire :"
}
}
</i18n>
