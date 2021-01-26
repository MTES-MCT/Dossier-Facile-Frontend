<template>
  <div>
    <div>
      <label class="rf-label" for="select">
        Votre situation d’hébergement actuelle :
      </label>
      <select
        v-model="residencyDocument"
        class="rf-select rf-mb-3w"
        id="select"
        name="select"
      >
        <option v-for="d in documents" :value="d" :key="d.key">
          {{ $t(d.key) }}
        </option>
      </select>
    </div>
    <div v-if="residencyDocument.key">
      <div class="rf-mb-3w">
        {{ residencyDocument.explanationText }}
      </div>
      <div class="rf-mb-3w">
        <FileUpload
          :current-status="fileUploadStatus"
          @add-files="addFiles"
          @reset-files="resetFiles"
        ></FileUpload>
      </div>
    </div>
    <div v-if="residencyFiles()" class="rf-col-lg-8 rf-col-md-12 rf-mb-3w">
      <ListItem
        v-for="(file, k) in residencyFiles()"
        :key="k"
        :file="file"
        @remove="remove(file)"
        :uploadState="
          uploadProgress[file.id] ? uploadProgress[file.id].state : 'idle'
        "
        :percentage="
          uploadProgress[file.id] ? uploadProgress[file.id].percentage : 0
        "
      />
    </div>
    <div class="rf-col-12 rf-mb-2w" v-if="residencyDocument">
      <button
        class="rf-btn"
        type="submit"
        @click="save"
        :disabled="files.length <= 0"
      >
        Enregistrer la pièce
      </button>
    </div>
    <div class="rf-mb-5w">
      <DocumentInsert
        :allow-list="residencyDocument.acceptedProofs"
        :block-list="residencyDocument.refusedProofs"
      ></DocumentInsert>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";
import DocumentInsert from "@/components/documents/DocumentInsert.vue";
import FileUpload from "@/components/uploads/FileUpload.vue";
import { DocumentType } from "df-shared/src/models/Document";
import { UploadStatus } from "../uploads/UploadStatus";
import ListItem from "@/components/uploads/ListItem.vue";
import { User } from "df-shared/src/models/User";
import { DfFile } from "df-shared/src/models/DfFile";
import { DfDocument } from "df-shared/src/models/DfDocument";
import { RegisterService } from "../../services/RegisterService";

@Component({
  components: { DocumentInsert, FileUpload, ListItem },
  computed: {
    ...mapGetters({
      user: "userToEdit",
    }),
  },
})
export default class Residency extends Vue {
  user!: User;
  fileUploadStatus = UploadStatus.STATUS_INITIAL;
  files: DfFile[] = [];
  uploadProgress: {
    [key: string]: { state: string; percentage: number };
  } = {};
  residencyDocument = new DocumentType();

  mounted() {
    if (this.user.documents !== null) {
      const doc = this.user.documents?.find((d: DfDocument) => {
        return d.documentCategory === "RESIDENCY";
      });
      if (doc !== undefined) {
        const localDoc = this.documents.find((d: DocumentType) => {
          return d.value === doc.documentSubCategory;
        });
        if (localDoc !== undefined) {
          this.residencyDocument = localDoc;
        }
      }
    }
  }

  addFiles(fileList: File[]) {
    const nf = Array.from(fileList).map((f) => {
      return { name: f.name, file: f, size: f.size };
    });
    this.files = [...this.files, ...nf];
  }
  resetFiles() {
    this.fileUploadStatus = UploadStatus.STATUS_INITIAL;
  }
  save() {
    this.uploadProgress = {};
    const fieldName = "documents";
    const formData = new FormData();
    const newFiles = this.files.filter((f) => {
      return !f.id;
    });
    if (!newFiles.length) return;
    Array.from(Array(newFiles.length).keys()).map((x) => {
      const f: File = newFiles[x].file || new File([], "");
      formData.append(`${fieldName}[${x}]`, f, newFiles[x].name);
    });

    formData.append("typeDocumentResidency", this.residencyDocument.value);

    this.fileUploadStatus = UploadStatus.STATUS_SAVING;
    if (this.$store.getters.isGuarantor) {
      formData.append("guarantorId", this.$store.getters.guarantor.id);
    }
    const loader = this.$loading.show();
    RegisterService.saveResidency(formData)
      .then(() => {
        console.log("success");
        this.files = [];
        this.fileUploadStatus = UploadStatus.STATUS_INITIAL;
      })
      .catch(() => {
        console.log("fail");
        this.fileUploadStatus = UploadStatus.STATUS_FAILED;
      })
      .finally(() => {
        this.$store.dispatch("loadUser");
        loader.hide();
      });
  }

  residencyFiles() {
    const newFiles = this.files.map((f) => {
      return {
        documentSubCategory: this.residencyDocument.value,
        id: f.name,
        name: f.name,
        size: f.size
      };
    });
    const existingFiles =
      this.$store.getters.getDocuments?.find((d: DfDocument) => {
        return d.documentCategory === "RESIDENCY";
      })?.files || [];
    return [...newFiles, ...existingFiles];
  }

  remove(file: DfFile) {
    if (file.path && file.id) {
      RegisterService.deleteFile(file.id);
    } else {
      this.files = this.files.filter((f: DfFile) => {
        return f.name !== file.name;
      });
    }
  }

  documents: DocumentType[] = [
    {
      key: "tenant",
      value: "TENANT",
      explanationText:
        "J’ajoute mes quittances de loyer pour les trois derniers mois.",
      acceptedProofs: [
        "Quittances de loyer des trois derniers mois",
        "Attestation du propriétaire (ou de son mandataire) indiquant que le locataire est à jour de ses loyers et charges",
      ],
      refusedProofs: [
        "Factures",
        "Avis de taxe d’habitation",
        "Relevés de compte bancaire",
      ],
    },
    {
      key: "owner",
      value: "OWNER",
      explanationText: "J’ajoute un avis de taxe foncière de moins d’un an.",
      acceptedProofs: [
        "Dernier avis de taxe foncière",
        "Titre de propriété de la résidence principale",
      ],
      refusedProofs: [
        "Appel de fonds pour charges de copropriété",
        "Factures",
        "Avis de taxe d’habitation",
        "Relevés de compte bancaire",
      ],
    },
    {
      key: "guest",
      value: "GUEST",
      explanationText:
        "J’ajoute une attestation sur l’honneur d’hébergement à titre gratuit, " +
        "une copie de la pièce d’identité et un justificatif de domicile de mon " +
        "hébergeant (une facture suffit). Vous pouvez utiliser un modèle en ligne " +
        "sur le site service-public.fr",
      acceptedProofs: [
        "Attestation sur l’honneur du parent datée et signée indiquant que le candidat à la location réside à son domicile, accompagnée d’une pièce d’identité et d’un justificatif de domicile du parent (une simple facture suffit)",
      ],
      refusedProofs: ["Tout autre document"],
    },
    {
      key: "guest-parents",
      value: "GUEST_PARENTS",
      explanationText:
        "J’ajoute une attestation sur l’honneur d’hébergement à titre gratuit, " +
        "une copie de la pièce d’identité et un justificatif de domicile du " +
        "parent (une facture suffit). Vous pouvez utiliser un modèle en ligne sur " +
        "le site service-public.fr",
      acceptedProofs: [
        "Attestation sur l’honneur de l’hébergeant datée de moins de trois mois et signée indiquant que le candidat à la location réside à son domicile, accompagnée d’une pièce d’identité et d’un justificatif de domicile de l’hébergeant (une simple facture suffit)",
        "Attestation d’élection de domicile datée de moins de trois mois et signée de l’organisme d’hébergement (hébergement d’urgence, placement…) indiquant l’adresse de l’hébergement (téléchargeable sur le site https://www.service-public.fr/simulateur/calcul/16030 ) ",
      ],
      refusedProofs: ["Tout autre document"],
    },
  ];
}
</script>

<style scoped lang="scss"></style>

<i18n>
{
"en": {
"tenant": "Vous êtes locataire",
"owner": "Vous êtes propriétaire",
"guest": "Vous êtes hébergé gratuitement",
"guest-parents": "Vous habitez chez vos parents",
"files": "Documents"
},
"fr": {
"tenant": "Vous êtes locataire",
"owner": "Vous êtes propriétaire",
"guest": "Vous êtes hébergé gratuitement",
"guest-parents": "Vous habitez chez vos parents",
"files": "Documents"
}
}
</i18n>
