<template>
  <div>
    <ValidationObserver>
      <validation-provider rules="required" v-slot="{ errors }">
        <div
          class="rf-input-group"
          :class="errors[0] ? 'rf-input-group--error' : ''"
        >
          <label class="rf-label" for="organismName"
            >{{ $t("organism-name") }} :</label
          >
          <input
            v-model="organismName"
            class="form-control rf-input validate-required"
            id="organismName"
            name="organismName"
            :placeholder="$t('organism-name-placeholder')"
            type="text"
            required
          />
          <span class="rf-error-text" v-if="errors[0]">{{ errors[0] }}</span>
        </div>
      </validation-provider>
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
      </div>
      <div>
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
      <div class="rf-col-12 rf-mb-2w">
        <button
          class="rf-btn"
          type="submit"
          @click="save"
          :disabled="!organismName || files.length <= 0"
        >
          {{ $t("register") }}
        </button>
      </div>
      <div class="rf-mb-5w">
        <DocumentInsert
          :allow-list="acceptedProofs"
          :block-list="refusedProofs"
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
import { UploadStatus } from "../uploads/UploadStatus";
import axios from "axios";
import ListItem from "@/components/uploads/ListItem.vue";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { extend } from "vee-validate";
import { required } from "vee-validate/dist/rules";
import { DfDocument } from "df-shared/src/models/DfDocument";
import { DfFile } from "df-shared/src/models/DfFile";

extend("required", {
  ...required,
  message: "Ce champ est requis",
});

@Component({
  components: {
    DocumentInsert,
    FileUpload,
    ListItem,
    ValidationProvider,
    ValidationObserver,
  },
  computed: {
    ...mapState({
      user: "user",
      tenantStep: "tenantStep",
    }),
  },
})
export default class CorporationIdentification extends Vue {
  organismName = "";
  acceptedProofs = [
    this.$i18n.t("kbis"),
    this.$i18n.t("status"),
    this.$i18n.t("all-accepted"),
  ];
  refusedProofs = [
    this.$i18n.t("balance-sheet"),
    this.$i18n.t("urssaf"),
    this.$i18n.t("all-other"),
  ];

  files: File[] = [];
  fileUploadStatus = UploadStatus.STATUS_INITIAL;
  uploadProgress: {
    [key: string]: { state: string; percentage: number };
  } = {};

  addFiles(fileList: File[]) {
    this.files = [...this.files, ...fileList];
  }

  save() {
    this.uploadProgress = {};
    const fieldName = "documents";
    const formData = new FormData();
    if (!this.files.length) return;
    Array.from(Array(this.files.length).keys()).map((x) => {
      formData.append(`${fieldName}[${x}]`, this.files[x], this.files[x].name);
    });

    formData.append("legalPersonName", this.organismName);

    this.fileUploadStatus = UploadStatus.STATUS_SAVING;
    // TODO use service with right url
    const url = `//${process.env.VUE_APP_API_URL}/api/register/guarantorLegalPerson/documentIdentification`;
    const loader = this.$loading.show();
    axios
      .post(url, formData)
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

  resetFiles() {
    this.fileUploadStatus = UploadStatus.STATUS_INITIAL;
  }

  remove(file: DfFile) {
    const loader = this.$loading.show();
    const url = `//${process.env.VUE_APP_API_URL}/api/file/${file.id}`;
    axios.delete(url).finally(() => {
      this.$store.dispatch("loadUser");
      loader.hide();
    });
  }

  listFiles() {
    const newFiles = this.files.map((f) => {
      return {
        id: f.name,
        name: f.name,
      };
    });
    const existingFiles =
      this.$store.getters.getDocuments?.find((d: DfDocument) => {
        return d.documentCategory === "IDENTIFICATION";
      })?.files || [];
    console.dir(this.$store.getters.getDocuments);
    console.dir(existingFiles);
    return [...newFiles, ...existingFiles];
  }
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
  "organism-name": "Company name",
  "organism-name-placeholder": "Company name",
  "kbis-label": "I add a K bis of the company, or any other document justifying the legal existence of the company.",
  "kbis": "Original Kbis of the company",
  "status": "Company statuses",
  "all-accepted": "Any other document justifying the legal existence of the company.",
  "balance-sheet": "Balance sheet",
  "urssaf": "Urssaf certificate",
  "all-other": "Any other document",
  "register": "Register documents"
},
"fr": {
  "organism-name": "Nom de la personne morale",
  "organism-name-placeholder": "Nom de la personne morale",
  "kbis-label": "J’ajoute un extrait K bis de la société, ou toute autre pièce justifiant de l'existence légale de la personne.",
  "kbis": "Extrait K bis original de la société",
  "status": "Statuts de la personne morale",
  "all-accepted": "Toute autre pièce justifiant de l'existance légale de la personne, prouvant qu'une déclaration a été effectuée auprès d'une administration, une juridiction ou un organisme professionnel.",
  "balance-sheet": "Bilan comptable",
  "urssaf": "Attestation cotisation Urssaf",
  "all-other": "Toute autre pièce",
  "register": "Enregistrer la pièce"
}
}
</i18n>
