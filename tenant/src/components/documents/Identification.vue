<template>
  <div>
    <div v-if="isGuarantor()" class="rf-grid-row rf-grid-row--center">
      <div class="rf-col-12 rf-mb-3w">
        <validation-provider rules="required" v-slot="{ errors }">
          <div
            class="rf-input-group"
            :class="errors[0] ? 'rf-input-group--error' : ''"
          >
            <label class="rf-label" for="lastname"
              >{{ $t("lastname") }} :</label
            >
            <input
              v-model="lastName"
              class="form-control rf-input validate-required"
              id="lastname"
              name="lastname"
              :placeholder="$t('lastname')"
              type="text"
            />
            <span class="rf-error-text" v-if="errors[0]">{{ errors[0] }}</span>
          </div>
        </validation-provider>
      </div>
      <div class="rf-col-12 rf-mb-3w">
        <validation-provider rules="required" v-slot="{ errors }">
          <div
            class="rf-input-group"
            :class="errors[0] ? 'rf-input-group--error' : ''"
          >
            <label for="firstname" class="rf-label"
              >{{ $t("firstname") }} :</label
            >
            <input
              id="firstname"
              :placeholder="$t('firstname')"
              type="text"
              v-model="firstName"
              name="firstname"
              class="validate-required form-control rf-input"
            />
            <span class="rf-error-text" v-if="errors[0]">{{
              $t(errors[0])
            }}</span>
          </div>
        </validation-provider>
      </div>
    </div>
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
    <div v-if="identificationDocument.key">
      <div v-if="identificationDocument.explanationText" class="rf-mb-3w">
        {{ identificationDocument.explanationText }}
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
          :allow-list="identificationDocument.acceptedProofs"
          :block-list="identificationDocument.refusedProofs"
        ></DocumentInsert>
      </div>
    </div>
    <div v-if="identificationFiles().length > 0">
      <h5>{{ $t("files") }}</h5>
      <ListItem
        v-for="file in identificationFiles()"
        :key="file.id"
        :file="file"
        @remove="remove(file.id)"
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
import { User } from "df-shared/src/models/User";
import { DfFile } from "df-shared/src/models/DfFile";
import { DfDocument } from "df-shared/src/models/DfDocument";
import { ValidationProvider } from "vee-validate";
import { Guarantor } from "df-shared/src/models/Guarantor";

@Component({
  components: { DocumentInsert, FileUpload, ListItem, ValidationProvider },
  computed: {
    ...mapState({
      user: "user",
      selectedGuarantor: "selectedGuarantor"
    })
  }
})
export default class Identification extends Vue {
  user!: User;
  selectedGuarantor!: Guarantor;
  fileUploadStatus = UploadStatus.STATUS_INITIAL;
  files: DfFile[] = [];
  uploadProgress: {
    [key: string]: { state: string; percentage: number };
  } = {};
  identificationDocument = new DocumentType();
  firstName = "";
  lastName = "";

  mounted() {
    if (this.user.documents !== null) {
      const doc = this.user.documents?.find((d: DfDocument) => {
        return d.documentCategory === "IDENTIFICATION";
      });
      if (doc !== undefined) {
        const localDoc = this.documents.find((d: DocumentType) => {
          return d.value === doc.documentSubCategory;
        });
        if (localDoc !== undefined) {
          this.identificationDocument = localDoc;
        }
      }
    }

    if (this.selectedGuarantor.firstName) {
      this.firstName = this.selectedGuarantor.firstName;
    }
    if (this.selectedGuarantor.lastName) {
      this.lastName = this.selectedGuarantor.lastName;
    }
  }

  addFiles(fileList: File[]) {
    const nf = Array.from(fileList).map(f => {
      return { name: f.name, file: f };
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
    const newFiles = this.files.filter(f => {
      return !f.id;
    });
    if (!newFiles.length) return;
    Array.from(Array(newFiles.length).keys()).map(x => {
      const f: File = newFiles[x].file || new File([], "");
      formData.append(`${fieldName}[${x}]`, f, newFiles[x].name);
    });

    formData.append(
      "typeDocumentIdentification",
      this.identificationDocument.value
    );

    this.fileUploadStatus = UploadStatus.STATUS_SAVING;
    let url: string;
    if (this.$store.getters.isGuarantor) {
      url = `//${process.env.VUE_APP_API_URL}/api/register/guarantorNaturalPerson/documentIdentification`;
      formData.append("firstName", this.firstName);
      formData.append("lastName", this.lastName);
      if (this.$store.getters.guarantor.id) {
        formData.append("guarantorId", this.$store.getters.guarantor.id);
      }
    } else {
      url = `//${process.env.VUE_APP_API_URL}/api/register/documentIdentification`;
    }
    axios
      .post(url, formData)
      .then(() => {
        console.log("success");
        this.fileUploadStatus = UploadStatus.STATUS_INITIAL;
        this.files = [];
      })
      .catch(() => {
        console.log("fail");
        this.fileUploadStatus = UploadStatus.STATUS_FAILED;
      })
      .finally(() => {
        this.$store.dispatch("loadUser");
      });
  }

  identificationFiles() {
    const newFiles = this.files.map(f => {
      return {
        documentSubCategory: this.identificationDocument.value,
        id: f.name
      };
    });
    const existingFiles =
      this.$store.getters.getDocuments?.find((d: DfDocument) => {
        return d.documentCategory === "IDENTIFICATION";
      })?.files || [];
    return [...newFiles, ...existingFiles];
  }

  remove(id: number) {
    const url = `//${process.env.VUE_APP_API_URL}/api/file/${id}`;
    axios.delete(url).finally(() => {
      this.$store.dispatch("loadUser");
    });
  }

  isGuarantor() {
    return this.$store.getters.isGuarantor;
  }

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
"identity-card": "Carte nationale d’identité",
"passport": "Passeport",
"permit": "Permis de conduire",
"other": "Autre",
"files": "Documents"
},
"fr": {
"identity-card": "Carte nationale d’identité",
"passport": "Passeport",
"permit": "Permis de conduire",
"other": "Autre",
"files": "Documents"
}
}
</i18n>
