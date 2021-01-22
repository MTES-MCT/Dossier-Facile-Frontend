<template>
  <div>
    <div v-for="(f, k) in financialDocuments" :key="k">
      <div>Revenu {{ k + 1 }}</div>
      <div>
        <label class="rf-label" for="select">
          Attention, Veuillez renseigner uniquement vos propres revenus.
        </label>
        <select
          v-model="f.documentType"
          class="rf-select rf-mb-3w"
          id="select"
          name="select"
        >
          <option v-for="d in documents" :value="d" :key="d.key">
            {{ $t(d.key) }}
          </option>
        </select>
      </div>
      <div v-if="f.documentType && f.documentType.key">
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
                v-model="f.monthlySum"
                name="monthlySum"
                class="validate-required form-control rf-input"
              />
              <span class="rf-error-text" v-if="errors[0]">{{
                $t(errors[0])
              }}</span>
              <span class="rf-error-text" v-if="f.monthlySum > 10000">
                {{ $t("high-salary") }}
              </span>
              <span class="rf-error-text" v-if="f.monthlySum <= 0">
                {{ $t("low-salary") }}
              </span>
            </div>
          </validation-provider>
        </div>
        <div class="rf-mb-3w">
          {{ f.documentType.explanationText }}
        </div>
        <div class="rf-mb-3w">
          <FileUpload
            :current-status="f.fileUploadStatus"
            @add-files="addFiles(f, ...arguments)"
            @reset-files="resetFiles(f, ...arguments)"
          ></FileUpload>
        </div>
        <div class="rf-col-12 rf-mb-3w">
          <input
            type="checkbox"
            :id="`noDocument${k}`"
            value="false"
            v-model="f.noDocument"
          />
          <label :for="`noDocument${k}`">{{ $t("noDocument") }}</label>
        </div>
        <div class="rf-mb-5w" v-if="f.noDocument">
          <div class="rf-input-group">
            <label class="rf-label" :for="`customText${k}`">{{
              $t("customText")
            }}</label>
            <input
              v-model="f.customText"
              class="form-control rf-input validate-required"
              :id="`customText${k}`"
              name="customText"
              placeholder=""
              type="text"
            />
          </div>
        </div>
      </div>
      <div v-if="financialFiles(f).length > 0" class="rf-col-lg-8 rf-col-md-12 rf-mb-3w">
        <ListItem
          v-for="(file, k) in financialFiles(f)"
          :key="k"
          :file="file"
          @remove="remove(f, file)"
        />
      </div>
      <div class="rf-col-12 rf-mb-5w" v-if="f.documentType">
        <button
          class="rf-btn"
          type="submit"
          @click="save(f)"
          :disabled="f.files.length <= 0 && !f.noDocument"
        >
          Enregistrer la pièce
        </button>
        <button class="rf-btn" type="submit" @click="removeFinancial(k)">
          Supprimer ce revenu
        </button>
      </div>
      <div class="rf-mb-5w">
        <DocumentInsert
          :allow-list="f.documentType.acceptedProofs"
          :block-list="f.documentType.refusedProofs"
        ></DocumentInsert>
      </div>
      <hr />
    </div>
    <div class="rf-col-12 rf-mb-5w">
      <button class="rf-btn" type="submit" @click="addFinancial()">
        Ajouter un revenu
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { DocumentType } from "df-shared/src/models/Document";
import DocumentInsert from "@/components/documents/DocumentInsert.vue";
import FileUpload from "@/components/uploads/FileUpload.vue";
import { mapGetters } from "vuex";
import { UploadStatus } from "../uploads/UploadStatus";
import axios from "axios";
import ListItem from "@/components/uploads/ListItem.vue";
import { ValidationProvider } from "vee-validate";
import { User } from "df-shared/src/models/User";
import { DfFile } from "df-shared/src/models/DfFile";
import { DfDocument } from "df-shared/src/models/DfDocument";
import { Guarantor } from "df-shared/src/models/Guarantor";
import { extend } from "vee-validate";
import { regex } from "vee-validate/dist/rules";

extend("regex", {
  ...regex,
  message: "number-not-valid",
});

class F {
  id?: number;
  documentType = new DocumentType();
  noDocument = false;
  files: DfFile[] = [];
  fileUploadStatus = UploadStatus.STATUS_INITIAL;
  customText = "";
  monthlySum?: number;
}

@Component({
  components: { ValidationProvider, DocumentInsert, FileUpload, ListItem },
  computed: {
    ...mapGetters({
      user: "userToEdit",
    }),
  },
})
export default class Financial extends Vue {
  user!: User | Guarantor;
  financialDocuments: F[] = [];

  mounted() {
    if (this.user.documents !== null) {
      const docs = this.user.documents?.filter((d: DfDocument) => {
        return d.documentCategory === "FINANCIAL";
      });
      if (docs !== undefined && docs.length > 0) {
        docs.forEach((d: DfDocument) => {
          const f = new F();
          f.noDocument = d.noDocument || false;
          f.customText = d.customText || "";
          f.monthlySum = d.monthlySum || 0;
          f.id = d.id;

          const localDoc = this.documents.find((d2: DocumentType) => {
            return d2.value === d.documentSubCategory;
          });
          if (localDoc !== undefined) {
            f.documentType = localDoc;
          }
          this.financialDocuments.push(f);
        });
      }
    } else {
      this.financialDocuments.push(new F());
    }
  }

  addFiles(f: F, fileList: File[]) {
    const nf = Array.from(fileList).map((f) => {
      return { name: f.name, file: f, size: f.size };
    });
    f.files = [...f.files, ...nf];
  }
  resetFiles(f: F) {
    f.fileUploadStatus = UploadStatus.STATUS_INITIAL;
  }
  save(f: F) {
    const fieldName = "documents";
    const formData = new FormData();
    if (!f.noDocument) {
      const newFiles = f.files.filter((f) => {
        return !f.id;
      });
      if (!newFiles.length) return;
      Array.from(Array(newFiles.length).keys()).map((x) => {
        const f: File = newFiles[x].file || new File([], "");
        formData.append(`${fieldName}[${x}]`, f, newFiles[x].name);
      });
    }

    const typeDocumentFinancial = f.documentType?.value || "";
    formData.append("typeDocumentFinancial", typeDocumentFinancial);
    formData.append("noDocument", f.noDocument ? "true" : "false");
    if (f.monthlySum) {
      formData.append("monthlySum", f.monthlySum.toString());
    }
    if (f.id) {
      formData.append("id", f.id.toString());
    }
    formData.append("customText", f.customText);

    f.fileUploadStatus = UploadStatus.STATUS_SAVING;
    let url: string;
    if (this.$store.getters.isGuarantor) {
      url = `//${process.env.VUE_APP_API_URL}/api/register/guarantorNaturalPerson/documentFinancial`;
      formData.append("guarantorId", this.$store.getters.guarantor.id);
    } else {
      url = `//${process.env.VUE_APP_API_URL}/api/register/documentFinancial`;
    }
    const loader = this.$loading.show();
    axios
      .post(url, formData)
      .then(() => {
        console.log("success");
        f.files = [];
        f.fileUploadStatus = UploadStatus.STATUS_INITIAL;
      })
      .catch(() => {
        console.log("fail");
        f.fileUploadStatus = UploadStatus.STATUS_FAILED;
      })
      .finally(() => {
        this.$store.dispatch("loadUser");
        loader.hide();
      });
  }

  financialFiles(f: F) {
    const newFiles = f.files.map((file: DfFile) => {
      return {
        documentSubCategory: f.documentType?.value,
        id: file.name,
        name: file.name,
      };
    });
    const existingFiles =
      this.$store.getters.getDocuments?.find((d: DfDocument) => {
        return d.id === f.id;
      })?.files || [];
    return [...newFiles, ...existingFiles];
  }

  remove(f: F, file: DfFile) {
    if (file.path) {
      const loader = this.$loading.show();
      const url = `//${process.env.VUE_APP_API_URL}/api/file/${file.id}`;
      axios.delete(url).finally(() => {
        this.$store.dispatch("loadUser");
        loader.hide();
      });
    } else {
      f.files = f.files.filter((f: DfFile) => {
        return f.name !== file.name;
      });
    }
  }

  addFinancial() {
    this.financialDocuments.push(new F());
  }

  removeFinancial(k: number) {
    this.financialDocuments.splice(k, 1);
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
        "2 derniers bilans comptables ou, si nécessaire, attestation des ressources pour l’exercice en cours délivrés par un comptable (non-salariés)",
      ],
      refusedProofs: [
        "Pièces trop anciennes",
        "Attestation de l’employeur",
        "Relevés de comptes bancaires",
        "RIB",
        "Avis d’imposition",
      ],
    },
    {
      key: "social-service",
      value: "SOCIAL_SERVICE",
      explanationText:
        "J’ajoute mes trois derniers justificatifs de versement de prestations sociales (ARE, CAF, Crous…), un justificatif d’ouverture des droits, ou une attestation de simulation pour les aides au logement.",
      acceptedProofs: [
        "3 derniers justificatifs de versement des prestations sociales et familiales et allocations (ARE, CAF, Crous, etc.)",
        "Justificatif de l’ouverture des droits établis par l’organisme payeur",
        "Attestation de simulation pour les aides au logement établie par la CAF ou par la MSA pour le locataire",
      ],
      refusedProofs: [
        "Pièces trop anciennes",
        "Relevés de comptes bancaires",
        "RIB",
        "Avis d’imposition",
      ],
    },
    {
      key: "rent",
      value: "RENT",
      explanationText:
        "J’ajoute un justificatif de paiement de rente, ou un avis d’imposition avec noms et revenus de la rente visibles.",
      acceptedProofs: [
        "Justification de revenus fonciers, de rentes viagères ou de revenus de valeurs et capitaux mobiliers",
        "Titre de propriété d’un bien immobilier ou dernier avis de taxe foncière",
        "Dernier ou avant-dernier avis d’imposition avec nom et revenus de la rente visibles",
      ],
      refusedProofs: ["Relevés de comptes bancaires", "RIB"],
    },
    {
      key: "pension",
      value: "PENSION",
      explanationText:
        "J’ajoute un bulletin de pension, une attestation de pension, ou un avis d’imposition avec noms et revenus de la pension visibles.",
      acceptedProofs: [
        "Justificatif de versement des indemnités, retraites, pensions perçues lors des 3 derniers mois ou justificatif de l’ouverture des droits établis par l’organisme payeur",
        "Dernier ou avant-dernier avis d’imposition avec nom et revenus de la pension visibles",
      ],
      refusedProofs: [
        "Pièces trop anciennes",
        "Relevés de comptes bancaires",
        "RIB",
      ],
    },
    {
      key: "trading",
      value: "TRADING",
      explanationText: "J’ajoute un avis d’attribution de bourse.",
      acceptedProofs: ["Avis d’attribution de bourse pour l’année en cours"],
      refusedProofs: [
        "Pièces trop anciennes",
        "Relevés de comptes bancaires",
        "RIB",
      ],
    },
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
"customText": "Afin d'améliorer mon dossier, j'explique pourquoi je ne peux pas fournir mes trois derniers bulletins de salaire :",
"high-salary": "Vous avez saisi un salaire supérieur à 10 000€ êtes-vous sûr d'avoir saisi votre salaire mensuel ?",
"low-salary": "Vous avez saisi un salaire égal à 0€ êtes-vous sûr d'avoir saisi votre salaire mensuel ?",
"number-not-valid": "Number not valid"
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
"customText": "Afin d'améliorer mon dossier, j'explique pourquoi je ne peux pas fournir mes trois derniers bulletins de salaire :",
"high-salary": "Vous avez saisi un salaire supérieur à 10 000€ êtes-vous sûr d'avoir saisi votre salaire mensuel ?",
"low-salary": "Vous avez saisi un salaire égal à 0€ êtes-vous sûr d'avoir saisi votre salaire mensuel ?",
"number-not-valid": "Nombre incorrect"
}
}
</i18n>
