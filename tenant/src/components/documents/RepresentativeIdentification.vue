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
          />
          <span class="rf-error-text" v-if="errors[0]">{{ errors[0] }}</span>
        </div>
      </validation-provider>
      <div>
        <label class="rf-label" for="select">
          J’ajoute une pièce d’identité en cours de validité. Attention, veillez à
          ajouter votre pièce recto-verso !
        </label>
        <select
          v-model="identificationDocument"
          class="rf-select rf-mb-3w"
          id="select"
          name="select"
        >
          <option v-for="d in documents" :value="d" :key="d.key">{{
            $t(d.key)
          }}</option>
        </select>
      </div>
      <div>
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
        <div class="rf-mb-3w">
          <DocumentInsert
            :allow-list="acceptedProofs"
            :block-list="refusedProofs"
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
      <div class="rf-col-12 rf-mb-5w" v-if="identificationDocument">
        <button
          class="rf-btn"
          type="submit"
          @click="save"
          :disabled="files.length <= 0"
        >
          Enregistrer la pièce
        </button>
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
import axios from "axios";
import ListItem from "@/components/uploads/ListItem.vue";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { extend } from "vee-validate";
import { required } from "vee-validate/dist/rules";

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

  save() {
    this.uploadProgress = {};
    const fieldName = "documents";
    const formData = new FormData();
    if (!this.files.length) return;
    Array.from(Array(this.files.length).keys()).map(x => {
      formData.append(`${fieldName}[${x}]`, this.files[x], this.files[x].name);
    });

    formData.append(
      "typeDocumentIdentification",
      this.identificationDocument.value
    );

    formData.append(
      "firstName",
      this.identificationDocument.value
    );

    this.fileUploadStatus = UploadStatus.STATUS_SAVING;
    const url = `//${process.env.VUE_APP_API_URL}/api/register/guarantorLegalPerson/documentRepresentanIdentification`;
    axios
      .post(url, formData)
      .then(() => {
        console.log("success");
        this.fileUploadStatus = UploadStatus.STATUS_INITIAL;
      })
      .catch(() => {
        console.log("fail");
        this.fileUploadStatus = UploadStatus.STATUS_FAILED;
      });
  }

  resetFiles() {
    this.fileUploadStatus = UploadStatus.STATUS_INITIAL;
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
