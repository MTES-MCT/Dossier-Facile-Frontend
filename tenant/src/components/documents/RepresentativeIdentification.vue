<template>
  <div>
    <ValidationObserver>
      <validation-provider rules="required" v-slot="{ errors }">
        <div
          class="rf-input-group"
          :class="errors[0] ? 'rf-input-group--error' : ''"
        >
          <label class="rf-label" for="firstName"
            >{{ $t("organism-name") }} :</label
          >
          <input
            v-model="firstName"
            class="form-control rf-input validate-required"
            id="firstName"
            name="firstName"
            :placeholder="$t('organism-name-placeholder')"
            type="text"
            required
          />
          <span class="rf-error-text" v-if="errors[0]">{{ errors[0] }}</span>
        </div>
      </validation-provider>
      <div>
        <label class="rf-label" for="select">
          J’ajoute une pièce d’identité en cours de validité. Attention, veillez
          à ajouter votre pièce recto-verso !
        </label>
        <select
          v-model="identificationDocument"
          class="rf-select rf-mb-3w"
          id="select"
          name="select"
        >
          <option v-for="d in documents" :value="d" :key="d.key">
            {{ $t(d.key) }}
          </option>
        </select>
      </div>
      <div v-if="identificationDocument.key">
        <div class="rf-mb-3w">
          {{ $t("kbis-label") }}
        </div>
        <div class="rf-mb-3w">
          <FileUpload
            :current-status="fileUploadStatus"
            @add-files="addFiles"
            @reset-files="resetFiles"
          ></FileUpload>
        </div>
      </div>
      <div class="rf-col-lg-8 rf-col-md-12 rf-mb-3w" v-if="listFiles().length > 0">
        <ListItem
          v-for="(file, k) in listFiles()"
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
      <div class="rf-col-12 rf-mb-2w" v-if="identificationDocument.key">
        <button
          class="rf-btn"
          type="submit"
          @click="save"
          :disabled="files.length <= 0"
        >
          Enregistrer la pièce
        </button>
      </div>
      <div class="rf-mb-5w" v-if="identificationDocument.key">
        <DocumentInsert
          :allow-list="identificationDocument.acceptedProofs"
          :block-list="identificationDocument.refusedProofs"
        ></DocumentInsert>
      </div>
    </ValidationObserver>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapState } from "vuex";
import DocumentInsert from "@/components/documents/DocumentInsert.vue";
import FileUpload from "@/components/uploads/FileUpload.vue";
import { DocumentType } from "df-shared/src/models/Document";
import { UploadStatus } from "../uploads/UploadStatus";
import ListItem from "@/components/uploads/ListItem.vue";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { extend } from "vee-validate";
import { required } from "vee-validate/dist/rules";
import { DfDocument } from "df-shared/src/models/DfDocument";
import { DfFile } from "df-shared/src/models/DfFile";
import { RegisterService } from "../../services/RegisterService";

extend("required", {
  ...required,
  message: "Ce champ est requis"
});

@Component({
  components: {
    DocumentInsert,
    FileUpload,
    ListItem,
    ValidationProvider,
    ValidationObserver
  },
  computed: {
    ...mapState({
      user: "user"
    })
  }
})
export default class RepresentativeIdentification extends Vue {
  acceptedProofs = [
    "Extrait K bis original de la société",
    "Statuts de la personne morale",
    "Toute autre pièce justifiant de l'existance légale de la personne, prouvant qu'une déclaration a été effectuée auprès d'une administration, une juridiction ou un organisme professionnel."
  ];
  refusedProofs = [
    "Bilan comptable",
    "Attestation cotisation Urssaf",
    "Toute autre pièce"
  ];

  MAX_FILE_COUNT = 5;

  identificationDocument = new DocumentType();

  files: File[] = [];
  fileUploadStatus = UploadStatus.STATUS_INITIAL;
  uploadProgress: {
    [key: string]: { state: string; percentage: number };
  } = {};
  firstName = "";

  addFiles(fileList: File[]) {
    this.files = [...this.files, ...fileList];
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

  save() {
    this.uploadProgress = {};
    const fieldName = "documents";
    const formData = new FormData();
    if (!this.files.length) return;
    Array.from(Array(this.files.length).keys()).map(x => {
      formData.append(`${fieldName}[${x}]`, this.files[x], this.files[x].name);
    });

    if (this.listFiles().length > this.MAX_FILE_COUNT) {
        Vue.toasted.global.max_file();
        return;
    }


    formData.append(
      "typeDocumentIdentification",
      this.identificationDocument.value
    );

    formData.append("firstName", this.identificationDocument.value);

    this.fileUploadStatus = UploadStatus.STATUS_SAVING;
    const loader = this.$loading.show();
    RegisterService.saveRepresentativeIdentification(formData)
      .then(() => {
        this.fileUploadStatus = UploadStatus.STATUS_INITIAL;
        Vue.toasted.global.save_success();
      })
      .catch(() => {
        this.fileUploadStatus = UploadStatus.STATUS_FAILED;
        Vue.toasted.global.save_failed();
      })
      .finally(() => {
        loader.hide();
      });
  }

  resetFiles() {
    this.fileUploadStatus = UploadStatus.STATUS_INITIAL;
  }

  listFiles() {
    console.log("bauie");
    const newFiles = this.files.map(f => {
      return {
        documentSubCategory: this.identificationDocument.value,
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

  // TODO : extract duplicate code
  documents: DocumentType[] = [
    {
      key: "identity-card",
      value: "FRENCH_IDENTITY_CARD",
      explanationText: "Attention veillez à ajouter votre pièce recto-verso !",
      acceptedProofs: ["Carte d’identité française recto-verso"],
      refusedProofs: [
        "Carte d’identité sans le verso ou périmée",
        "Tout autre document"
      ]
    },
    {
      key: "passport",
      value: "FRENCH_PASSPORT",
      acceptedProofs: ["Passport français (pages 2 et 3)"],
      refusedProofs: ["Tout autre document"]
    },
    {
      key: "permit",
      value: "FRENCH_RESIDENCE_PERMIT",
      acceptedProofs: [
        "Carte de séjour en France temporaire recto-verso en cours de validité, ou périmée si elle est accompagnée du récépissé de la demande de renouvellement de carte de séjour",
        "Visa de travail ou d’études temporaire en France"
      ],
      refusedProofs: ["Tout autre document"]
    },
    {
      key: "other",
      value: "OTHER_IDENTIFICATION",
      acceptedProofs: [
        "Carte d’identité étrangère recto-verso",
        "Passeport étranger (pages 2 et 3)",
        "Permis de conduire français ou étranger recto-verso",
        "Carte de résident",
        "Carte de ressortissant d’un État membre de l’UE ou de l’EEE"
      ],
      refusedProofs: ["Tout autre document"]
    }
  ];
}
</script>

<style scoped lang="scss">
table {
  border-collapse: collapse;
}

table,
th,
td {
  border: 1px solid #ececec;
}
</style>

<i18n>
{
"en": {
  "organism-name": "Nom du représentant de la personne morale",
  "organism-name-placeholder": "Nom",
  "kbis-label": "J’ajoute un extrait K bis de la société, ou toute autre pièce justifiant de l'existence légale de la personne.",
  "identity-card": "Carte nationale d’identité",
  "passport": "Passeport",
  "permit": "Permis de conduire",
  "other": "Autre"
},
"fr": {
  "organism-name": "Nom du représentant de la personne morale",
  "organism-name-placeholder": "Nom",
  "kbis-label": "J’ajoute un extrait K bis de la société, ou toute autre pièce justifiant de l'existence légale de la personne.",
  "identity-card": "Carte nationale d’identité",
  "passport": "Passeport",
  "permit": "Permis de conduire",
  "other": "Autre"
}
}
</i18n>
