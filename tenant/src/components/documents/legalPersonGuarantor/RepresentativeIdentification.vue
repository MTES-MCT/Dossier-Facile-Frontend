<template>
  <div>
    <ValidationObserver>
      <NakedCard class="fr-p-md-5w">
        <validation-provider rules="required" v-slot="{ errors }">
          <div
            class="fr-input-group"
            :class="errors[0] ? 'fr-input-group--error' : ''"
          >
            <label class="fr-label" for="firstName"
              >{{ $t("organism-name") }} :</label
            >
            <input
              v-model="firstName"
              class="form-control fr-input validate-required"
              id="firstName"
              name="firstName"
              :placeholder="$t('organism-name-placeholder')"
              type="text"
              required
            />
            <span class="fr-error-text" v-if="errors[0]">{{
              $t(errors[0])
            }}</span>
          </div>
        </validation-provider>
      </NakedCard>
      <NakedCard class="fr-mt-3w fr-p-md-5w">
        <div>
          <h1 class="fr-label" for="select">
            J’ajoute une pièce d’identité en cours de validité. Attention,
            veillez à ajouter votre pièce recto-verso !
          </h1>
          <select
            v-model="identificationDocument"
            class="fr-select fr-mb-3w"
            id="select"
            name="select"
          >
            <option v-for="d in documents" :value="d" :key="d.key">
              {{ $t(d.key) }}
            </option>
          </select>
        </div>
        <div v-if="identificationDocument.key">
          <v-gouv-fr-modal>
            <template v-slot:button>
              En difficulté pour répondre à la question ?
            </template>
            <template v-slot:title>
              En difficulté pour répondre à la question ?
            </template>
            <template v-slot:content>
              <p>
                <DocumentInsert
                  :allow-list="identificationDocument.acceptedProofs"
                  :block-list="identificationDocument.refusedProofs"
                ></DocumentInsert>
              </p>
            </template>
          </v-gouv-fr-modal>
          <AllDeclinedMessages
            class="fr-mb-3w"
            :documentDeniedReasons="documentDeniedReasons"
            :documentStatus="documentStatus"
          ></AllDeclinedMessages>
          <div class="fr-col-md-12 fr-mb-3w" v-if="listFiles().length > 0">
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
          <div class="fr-mb-3w">
            <FileUpload
              :current-status="fileUploadStatus"
              @add-files="addFiles"
              @reset-files="resetFiles"
            ></FileUpload>
          </div>
        </div>
      </NakedCard>
    </ValidationObserver>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapState } from "vuex";
import DocumentInsert from "../share/DocumentInsert.vue";
import FileUpload from "../../uploads/FileUpload.vue";
import { DocumentType } from "df-shared/src/models/Document";
import { UploadStatus } from "df-shared/src/models/UploadStatus";
import ListItem from "../../uploads/ListItem.vue";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { extend } from "vee-validate";
import { required } from "vee-validate/dist/rules";
import { DfDocument } from "df-shared/src/models/DfDocument";
import { DfFile } from "df-shared/src/models/DfFile";
import { RegisterService } from "../../../services/RegisterService";
import { Guarantor } from "df-shared/src/models/Guarantor";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import VGouvFrModal from "df-shared/src/GouvFr/v-gouv-fr-modal/VGouvFrModal.vue";
import AllDeclinedMessages from "../share/AllDeclinedMessages.vue";
import { DocumentDeniedReasons } from "df-shared/src/models/DocumentDeniedReasons";
import { cloneDeep } from "lodash";

extend("required", {
  ...required
});

@Component({
  components: {
    AllDeclinedMessages,
    DocumentInsert,
    FileUpload,
    ListItem,
    ValidationProvider,
    ValidationObserver,
    VGouvFrModal,
    NakedCard
  },
  computed: {
    ...mapState({
      selectedGuarantor: "selectedGuarantor"
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
  documentDeniedReasons = new DocumentDeniedReasons();

  files: File[] = [];
  fileUploadStatus = UploadStatus.STATUS_INITIAL;
  uploadProgress: {
    [key: string]: { state: string; percentage: number };
  } = {};
  firstName = "";
  selectedGuarantor!: Guarantor;

  mounted() {
    this.firstName = this.selectedGuarantor.firstName || "";
    if (this.selectedGuarantor.documents !== null) {
      const doc = this.selectedGuarantor.documents?.find((d: DfDocument) => {
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
    if (this.guarantorIdentificationDocument()?.documentDeniedReasons) {
      this.documentDeniedReasons = cloneDeep(
        this.guarantorIdentificationDocument().documentDeniedReasons
      );
    }
  }

  get documentStatus() {
    return this.guarantorIdentificationDocument()?.documentStatus;
  }

  guarantorIdentificationDocument() {
    return this.$store.getters.getGuarantorIdentificationDocument;
  }

  addFiles(fileList: File[]) {
    this.files = [...this.files, ...fileList];
    this.save();
  }

  remove(file: DfFile) {
    if (file.path && file.id) {
      RegisterService.deleteFile(file.id);
    } else {
      const firstIndex = this.files.findIndex(f => {
        return f.name === file.name && f.size === file.size;
      });
      this.files.splice(firstIndex, 1);
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
      Vue.toasted.global.max_file({
        message: this.$i18n.t("max-file", [
          this.listFiles().length,
          this.MAX_FILE_COUNT
        ])
      });
      return;
    }

    formData.append(
      "typeDocumentIdentification",
      this.identificationDocument.value
    );

    if (this.firstName) {
      formData.append("firstName", this.firstName);
    }
    if (this.$store.getters.guarantor.id) {
      formData.append("guarantorId", this.$store.getters.guarantor.id);
    }

    this.fileUploadStatus = UploadStatus.STATUS_SAVING;
    const loader = this.$loading.show();
    RegisterService.saveRepresentativeIdentification(formData)
      .then(() => {
        this.files = [];
        this.fileUploadStatus = UploadStatus.STATUS_INITIAL;
        Vue.toasted.global.save_success();
        this.$store.dispatch("loadUser");
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
    const newFiles = this.files.map(f => {
      return {
        documentSubCategory: this.identificationDocument.value,
        id: f.name,
        name: f.name,
        size: f.size
      };
    });
    const existingFiles =
      this.$store.getters.getGuarantorDocuments?.find((d: DfDocument) => {
        return d.documentCategory === "IDENTIFICATION";
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
  "identity-card": "French identity card",
  "passport": "French passeport",
  "permit": "French residence permit",
  "other": "Autre"
},
"fr": {
  "organism-name": "Nom du représentant de la personne morale",
  "organism-name-placeholder": "Nom",
  "identity-card": "Carte d’identité française",
  "passport": "Passeport français",
  "permit": "Titre de séjour français",
  "other": "Autre"
}
}
</i18n>
