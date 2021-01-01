<template>
  <div>
    <div>
      <label class="rf-label" for="select">
        Votre situation professionnelle actuelle :
      </label>
      <select
        v-model="professionalDocument"
        class="rf-select rf-mb-3w"
        id="select"
        name="select"
      >
        <option v-for="d in documents" :value="d" :key="d.key">{{
          $t(d.key)
        }}</option>
      </select>
    </div>
    <div v-if="professionalDocument.key">
      <div class="rf-mb-3w">
        {{ professionalDocument.explanationText }}
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
          :allow-list="professionalDocument.acceptedProofs"
          :block-list="professionalDocument.refusedProofs"
        ></DocumentInsert>
      </div>
    </div>
    <div v-if="professionalFiles().length > 0">
      <h5>{{ $t("files") }}</h5>
      <ListItem
        v-for="file in professionalFiles()"
        :key="file.id"
        :file="file"
        @remove="remove(file.id)"
      />
    </div>
    <div class="rf-col-12 rf-mb-5w" v-if="professionalDocument">
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
import DocumentInsert from "@/components/documents/DocumentInsert.vue";
import FileUpload from "@/components/uploads/FileUpload.vue";
import { mapState } from "vuex";
import { DocumentType } from "df-shared/src/models/Document";
import { UploadStatus } from "../uploads/UploadStatus";
import axios from "axios";
import ListItem from "@/components/uploads/ListItem.vue";
import { User } from "df-shared/src/models/User";
import { DfFile } from "df-shared/src/models/DfFile";
import { DfDocument } from "df-shared/src/models/DfDocument";

@Component({
  components: { DocumentInsert, FileUpload, ListItem },
  computed: {
    ...mapState({
      user: "user"
    })
  }
})
export default class Professional extends Vue {
  user!: User;
  fileUploadStatus = UploadStatus.STATUS_INITIAL;
  files: DfFile[] = [];
  uploadProgress: {
    [key: string]: { state: string; percentage: number };
  } = {};
  professionalDocument = new DocumentType();

  mounted() {
    if (this.user.documents !== null ) {
      const doc = this.user.documents?.find((d: DfDocument) => { return d.documentCategory === 'PROFESSIONAL'});
      if (doc !== undefined) {
        const localDoc = this.documents.find((d: DocumentType) => { return d.value === doc.documentSubCategory});
        if (localDoc !== undefined) {
          this.professionalDocument = localDoc
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
    const newFiles = this.files.filter((f) => {return !f.id});
    if (!newFiles.length) return;
    Array.from(Array(newFiles.length).keys()).map(x => {
      const f:File = newFiles[x].file || new File([], "");
      formData.append(`${fieldName}[${x}]`, f, newFiles[x].name);
    });

    formData.append(
      "typeDocumentProfessional",
      this.professionalDocument.value
    );

    this.fileUploadStatus = UploadStatus.STATUS_SAVING;
    const url = `//${process.env.VUE_APP_API_URL}/api/register/documentProfessional`;
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

  professionalFiles() {
      const newFiles = this.files.map(f => {
        return {
          documentSubCategory: this.professionalDocument.value,
          id: f.name
        };
      });
    const d = this.user?.documents?.find(d => {
          return d.documentCategory === "PROFESSIONAL";
      });
    const existingFiles = d?.files?.map((file: DfFile) => { return {id: file.id, path: file.path, documentSubCategory: d.documentSubCategory}}) || []
      return [...newFiles, ...existingFiles];
  }

  remove(id: number) {
    const url = `//${process.env.VUE_APP_API_URL}/api/file/${id}`;
    // TODO remove locally or update user
    axios.delete(url);
  }

  documents: DocumentType[] = [
    {
      key: "cdi",
      value: "CDI",
      explanationText:
        "J’ajoute mon contrat de travail en cours, complet et signé.\n" +
        "Et si vous n’avez pas de contrat de travail ? Vous pouvez joindre une attestation de votre employeur signée et datée de moins de 3 mois.",
      acceptedProofs: [
        "Contrat de travail en cours, complet, daté et signé",
        "Attestation de votre employeur de moins de 3 mois précisant l’emploi et la rémunération proposée et la date d’entrée en fonctions"
      ],
      refusedProofs: [
        "Courrier/mail de confirmation d’embauche",
        "Bulletins de salaire",
        "Relevés de comptes bancaires"
      ]
    },
    {
      key: "cdi-trial",
      value: "CDI_TRIAL",
      explanationText:
        "J’ajoute mon contrat de travail en cours, complet et signé.\n" +
        "Et si vous n’avez pas de contrat de travail ? Vous pouvez joindre une attestation de votre employeur signée et datée de moins de 3 mois.",
      acceptedProofs: [
        "Contrat de travail en cours, complet, daté et signé",
        "Attestation de votre employeur de moins de 3 mois précisant l’emploi et la rémunération proposée, la date d’entrée en fonctions envisagée et la durée de la période d’essai."
      ],
      refusedProofs: [
        "Courrier/mail de confirmation d’embauche",
        "Bulletins de salaire",
        "Relevés de comptes bancaires"
      ]
    },
    {
      key: "cdd",
      value: "CDD",
      explanationText:
        "J’ajoute mon contrat de travail en cours, complet et signé.\n" +
        "Et si vous n’avez pas de contrat de travail ? Vous pouvez joindre une attestation de votre employeur signée et datée de moins de 3 mois.",
      acceptedProofs: [
        "Contrat de travail en cours, complet, daté et signé",
        "Attestation de votre employeur de moins de 3 mois précisant l’emploi et la rémunération proposée, la date d’entrée en fonctions et la durée du contrat"
      ],
      refusedProofs: [
        "Courrier/mail de confirmation d’embauche",
        "Bulletins de salaire",
        "Relevés de comptes bancaires"
      ]
    },
    {
      key: "alternation",
      value: "ALTERNATION",
      explanationText:
        "J’ajoute mon contrat d’alternance en cours, complet et signé.",
      acceptedProofs: [
        "Contrat d’alternance",
        "Contrat de professionnalisation"
      ],
      refusedProofs: ["Certificat de scolarité"]
    },
    {
      key: "internship",
      value: "INTERNSHIP",
      explanationText:
        "J’ajoute ma convention de stage en cours, complète et signée.",
      acceptedProofs: ["Convention de stage"],
      refusedProofs: ["Certificat de scolarité"]
    },
    {
      key: "student",
      value: "STUDENT",
      explanationText:
        "J’ajoute une copie de ma carte d’étudiant ou un certificat de scolarité pour l’année en cours.",
      acceptedProofs: [
        "Carte d’étudiant ou certificat de scolarité pour l’année en cours"
      ],
      refusedProofs: [
        "Courrier/mail de confirmation d’inscription",
        "Attestation de paiement CVEC",
        "Bulletin scolaire"
      ]
    },
    {
      key: "public",
      value: "PUBLIC",
      explanationText: "J’ajoute un arrêté de nomination.",
      acceptedProofs: [
        "Arrêté de nomination",
        "Attestation de votre employeur"
      ],
      refusedProofs: ["Bulletins de salaire", "Relevés de comptes bancaires"]
    },
    {
      key: "ctt",
      value: "CTT",
      explanationText:
        "J’ajoute mon contrat de travail en cours, complet et signé.\n" +
        "Et si vous n’avez pas de contrat de travail ? Vous pouvez joindre une attestation de votre employeur signée et datée de moins de 3 mois.",
      acceptedProofs: [
        "Contrat de travail complet daté et signé",
        "Attestation de votre employeur précisant l’emploi et la rémunération proposée, la date d’entrée en fonctions envisagée et la durée du contrat"
      ],
      refusedProofs: ["Bulletins de salaire", "Relevés de comptes bancaires"]
    },
    {
      key: "retired",
      value: "RETIRED",
      explanationText:
        "J’ajoute un bulletin de pension retraite. Et si vous n’en avez pas? Vous pouvez joindre votre dernier avis d’imposition complet de moins de 2 ans.",
      acceptedProofs: [
        "Bulletin de pension retraite",
        "Attestation de droit à une pension",
        "Titre de pension de retraite",
        "Avis d’imposition complet de moins de 2 ans"
      ],
      refusedProofs: ["Relevés de comptes bancaires"]
    },
    {
      key: "unemployed",
      value: "UNEMPLOYED",
      explanationText:
        "J’ajoute une attestation d’ouverture de droits à l’ARE ou un avis de situation Pôle Emploi de moins de 3 mois.",
      acceptedProofs: [
        "Attestation d’ouverture de droits à l’ARE",
        "Avis de situation Pôle Emploi de moins de 3 mois"
      ],
      refusedProofs: [
        "Attestation de versement de paiement de cotisations sociales"
      ]
    },
    {
      key: "independent",
      value: "INDEPENDENT",
      explanationText:
        "J’ajoute mon justificatif d’activité professionnelle indépendante en fonction de mon type d’activité.",
      acceptedProofs: [
        "Certificat d’identification de l’Insee comportant les numéros d’identification",
        "Attestation d’inscription au statut d’auto-entrepreneur",
        "Carte professionnelle (profession libérale)",
        "Extrait D1 original du registre des métiers de moins de 3 mois (artisan)",
        "Extrait K ou K bis du registre du commerce et des sociétés de moins de 3 mois (commerçant)"
      ],
      refusedProofs: ["Relevés de comptes bancaires"]
    },
    {
      key: "other",
      value: "OTHER",
      explanationText:
        "J’ajoute un document de moins de 3 mois justifiant de mon activité professionnelle.",
      acceptedProofs: [
        "Attestation d’ouverture de droit AAH (adulte en situation de handicap)",
        "Attestation d’ouverture des droits au RSA (mère/père au foyer)",
        "Toute pièce de moins de 3 mois attestant de l’activité professionnelle (autres cas d’activité)",
        "Déclaration de non-activité si vous êtes sans activité"
      ],
      refusedProofs: ["Relevés de comptes bancaires"]
    }
  ];
}
</script>

<style scoped lang="scss"></style>

<i18n>
{
"en": {
"cdi": "CDI",
"cdi-trial": "CDI (période d’essai)",
"cdd": "CDD",
"alternation": "Alternance",
"internship": "Stage",
"student": "Études",
"public": "Fonction publique",
"ctt": "CTT (intérimaire)",
"retired": "Retraité",
"unemployed": "Chômage",
"independent": "Indépendant",
"other": "Autre"
},
"fr": {
"cdi": "CDI",
"cdi-trial": "CDI (période d’essai)",
"cdd": "CDD",
"alternation": "Alternance",
"internship": "Stage",
"student": "Études",
"public": "Fonction publique",
"ctt": "CTT (intérimaire)",
"retired": "Retraité",
"unemployed": "Chômage",
"independent": "Indépendant",
"other": "Autre"
}
}
</i18n>
