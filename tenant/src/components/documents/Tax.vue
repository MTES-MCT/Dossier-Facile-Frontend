<template>
  <div>
    <div>
      <select
        v-model="taxDocument"
        class="rf-select rf-mb-3w"
        id="select"
        name="select"
      >
        <option value="" selected disabled hidden>- Select -</option>
        <option v-for="d in documents" :value="d" :key="d.key">
          {{ $t(d.key) }}
        </option>
      </select>
    </div>
    <div v-if="taxDocument.key && taxDocument.key === 'other-tax'">
      <div class="rf-input-group">
        <label class="rf-label" for="customText">{{ $t("custom-text") }}</label>
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
    <div v-if="taxDocument.key && taxDocument.key === 'my-name'">
      <div class="rf-mb-3w">
        {{ taxDocument.explanationText }}
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
          id="acceptVerification"
          value="false"
          v-model="acceptVerification"
        />
        <label for="acceptVerification">{{ $t("accept-verification") }}</label>
      </div>
      <div class="rf-mb-3w" v-if="taxDocument.key === 'my-name'">
        <DocumentInsert
          :allow-list="taxDocument.acceptedProofs"
          :block-list="taxDocument.refusedProofs"
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
    <div class="rf-col-12 rf-mb-5w" v-if="taxDocument.key">
      <button
        class="rf-btn"
        type="submit"
        @click="save"
        :disabled="
          !taxDocument.key ||
            (taxDocument.key === 'my-name' &&
              (files.length <= 0 || !acceptVerification))
        "
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
export default class Tax extends Vue {
  acceptVerification = false;
  customText = "";
  private fileUploadStatus = UploadStatus.STATUS_INITIAL;
  private files: File[] = [];
  private uploadProgress: {
    [key: string]: { state: string; percentage: number };
  } = {};
  taxDocument = new DocumentType();
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

    formData.append("typeDocumentTax", this.taxDocument.value);
    formData.append(
      "acceptVerification",
      this.acceptVerification ? "true" : "false"
    );

    this.fileUploadStatus = UploadStatus.STATUS_SAVING;
    const url = `//${process.env.VUE_APP_API_URL}/api/register/documentTax`;
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
      key: "my-name",
      value: "MY_NAME",
      explanationText:
        "En joignant mon avis d’imposition, j’accepte que DossierFacile procède à une vérification automatisée de ma fiche d’imposition auprès des services des impôts.\n" +
        "J’ajoute un avis d’imposition à mon nom.",
      acceptedProofs: ["Avis d’imposition de moins de 2 ans"],
      refusedProofs: [
        "Avis d’imposition incomplet (sans la première page)",
        "Tout avis d’imposition plus ancien",
        "Tout autre document justificatif"
      ]
    },
    {
      key: "my-parents",
      value: "MY_PARENTS",
      explanationText:
        "J’ai déclaré être rattaché·e au domicile fiscal de mes parents.",
      acceptedProofs: [],
      refusedProofs: []
    },
    {
      key: "less-than-year",
      value: "LESS_THAN_YEAR",
      explanationText: "J’ai déclaré être en France depuis moins d’un an.",
      acceptedProofs: [],
      refusedProofs: []
    },
    {
      key: "other-tax",
      value: "OTHER_TAX",
      explanationText:
        "Afin d’améliorer mon dossier, j’explique ci-dessous pourquoi je ne reçois pas d’avis d’imposition. Mon explication sera ajoutée à mon dossier :",
      acceptedProofs: [],
      refusedProofs: []
    }
  ];
}
</script>

<style scoped lang="scss"></style>

<i18n>
{
"en": {
"my-name": "Vous avez un avis d’imposition à votre nom",
"my-parents": "Vous êtes rattaché fiscalement à vos parents",
"less-than-year": "Vous êtes en France depuis moins d’un an",
"other-tax": "Autre",
"accept-verification": "J'accepte que DossierFacile procède à une vérification automatisée de ma fiche d'imposition auprès des services des impôts",
"custom-text": "Afin d'améliorer votre dossier, veuillez expliquer ci-dessous pourquoi vous ne recevez pas d'avis d'impositon. Votre explication sera ajoutée à votre dossier :"
},
"fr": {
"my-name": "Vous avez un avis d’imposition à votre nom",
"my-parents": "Vous êtes rattaché fiscalement à vos parents",
"less-than-year": "Vous êtes en France depuis moins d’un an",
"other-tax": "Autre",
"accept-verification": "J'accepte que DossierFacile procède à une vérification automatisée de ma fiche d'imposition auprès des services des impôts",
"custom-text": "Afin d'améliorer votre dossier, veuillez expliquer ci-dessous pourquoi vous ne recevez pas d'avis d'impositon. Votre explication sera ajoutée à votre dossier :"
}
}
</i18n>
