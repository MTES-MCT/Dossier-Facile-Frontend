<template>
  <div>
    <DocumentDownloader
      :coTenantId="coTenantId"
      :documentsDefinitions="documentsDefinitions"
      documentCategory="TAX"
      dispacthMethodName="saveTenantTax"
      typeDocument="typeDocumentTax"
      listType="grid"
      :showDownloader="showDownloader"
      @on-change-document="changeDocumentType"
      @enrich-form-data="enrichFormData"
    >
      <template v-slot:after-select-block>
        <div
          class="fr-mb-3w"
          v-if="documentType ? documentType.key === 'other-tax' : false"
        >
          <div class="fr-input-group">
            <label class="fr-label" for="customText">{{
              $t("custom-text")
            }}</label>
            <input
              v-model="customText"
              class="form-control fr-input validate-required"
              id="customText"
              name="customText"
              placeholder=""
              type="text"
              required
            />
          </div>
        </div>
        <div
          class="fr-col-12 fr-mt-3w"
          v-if="documentType ? documentType.key === 'my-name' : false"
        >
          <validation-provider rules="is" v-slot="{ errors }" class="fr-col-10">
            <div
              class="fr-checkbox-group bg-purple"
              :class="errors[0] ? 'fr-input-group--error' : ''"
            >
              <input
                type="checkbox"
                id="acceptVerification"
                :value="acceptVerification"
                @change="changeAcceptVerification"
              />
              <label for="acceptVerification">{{
                $t("accept-verification")
              }}</label>
              <span class="fr-error-text" v-if="errors[0]">{{
                $t(errors[0])
              }}</span>
            </div>
          </validation-provider>
        </div>
      </template>
    </DocumentDownloader>
  </div>
</template>

<script lang="ts">
import { DocumentType } from "df-shared/src/models/Document";
import { Component, Prop, Vue } from "vue-property-decorator";
import { DocumentTypeConstants } from "../share/DocumentTypeConstants";
import DocumentDownloader from "./DocumentDownloader.vue";
import { extend, ValidationObserver, ValidationProvider } from "vee-validate";
import { is } from "vee-validate/dist/rules";

extend("is", {
  ...is,
  message: "field-required",
  validate: value => !!value
});

@Component({
  components: {
    ValidationProvider,
    DocumentDownloader
  }
})
export default class CoTenantTax extends Vue {
  documentsDefinitions = DocumentTypeConstants.TAX_DOCS;
  @Prop() coTenantId!: number;
  documentType?: DocumentType;
  customText?: string;
  acceptVerification = false;
  showDownloader = false;

  changeAcceptVerification(event: any) {
    this.acceptVerification = !this.acceptVerification;
    this.showDownloader =
      this.acceptVerification == true && this.documentType?.key === "my-name";
  }
  changeDocumentType(docType?: DocumentType) {
    this.showDownloader =
      this.acceptVerification == true && this.documentType?.key === "my-name";
    this.documentType = docType;
  }

  enrichFormData(formData: FormData) {
    if (this.documentType?.key === "my-name") {
      formData.append(
        "acceptVerification",
        this.acceptVerification ? "true" : "false"
      );
      formData.append("noDocument", "false");
    } else {
      formData.append("noDocument", "true");
    }
  }
}
</script>

<i18n>
  {
  "en": {
    "title": "My spouse tax file",
    "my-name": "I have the Tax icome - avis d’imposition - of my spouse",
    "my-parents": "Vous êtes rattaché fiscalement à vos parents",
    "less-than-year": "You're in France lessthan 1 year",
    "other-tax": "Other tax's document",
    "accept-verification": "J'accepte que DossierFacile procède à une vérification automatisée de la fiche d'imposition de mon garant auprès des services des impôts",
    "custom-text": "Afin d'améliorer votre dossier, veuillez expliquer ci-dessous pourquoi vous ne recevez pas d'avis d'imposition. Votre explication sera ajoutée à votre dossier :",
    "situation": "What is her/his tax situation?",
    "warning-no-accepted-doc": "Warning, the declarative situation document is not accepted.",
    "goto-documentation" : "Go to documentation"
  },
  "fr": {
    "title": "L'avis d'imposition de mon conjoint",
    "my-name": "J’ai un avis d’imposition au nom de mon conjoint",
    "my-parents": "Mon conjoint êtes rattaché fiscalement à ses parents",
    "less-than-year": "Mon conjoint est en France depuis moins d'un an",
    "other-tax": "Autre",
    "accept-verification": "J'accepte que DossierFacile procède à une vérification automatisée de la fiche d'imposition de mon garant auprès des services des impôts",
    "custom-text": "Afin d'améliorer votre dossier, veuillez expliquer ci-dessous pourquoi vous ne recevez pas d'avis d'imposition. Votre explication sera ajoutée à votre dossier :", 
    "situation": "Quelle est sa situation fiscale ?",
    "warning-no-accepted-doc": "Attention, l'avis de situation déclarative n'est pas accepté.",
    "goto-documentation" : "Consulter la documentation"
  }
}
</i18n>
