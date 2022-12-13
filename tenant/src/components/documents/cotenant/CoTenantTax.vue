<template>
  <div>
    <DocumentDownloader
      :coTenantId="coTenantId"
      :documentsDefinitions="documentsDefinitions"
      documentCategory="TAX"
      dispatchMethodName="saveTenantTax"
      typeDocument="typeDocumentTax"
      listType="grid"
      :showDownloader="showDownloader.value"
      :forceShowDownloader="forceShowDownloader.value"
      @on-change-document="changeDocument"
      @enrich-form-data="enrichFormData"
    >
      <template v-slot:after-select-block>
        <NakedCard
          class="fr-p-md-5w fr-mb-3w fr-mt-3w"
          v-if="documentType ? documentType.key === 'other-tax' : false"
        >
          <div class="fr-input-group">
            <label class="fr-label" for="customText">{{
              $t("custom-text")
            }}</label>
            <input
              v-model="document.customText"
              class="form-control fr-input validate-required"
              id="customText"
              name="customText"
              placeholder=""
              type="text"
              required
            />
          </div>
        </NakedCard>
      </template>
    </DocumentDownloader>
    <FooterContainer>
      <BackNext :showBack="true" @on-next="goNext" @on-back="goBack">
      </BackNext>
    </FooterContainer>
  </div>
</template>

<script lang="ts">
import { DocumentType } from "df-shared/src/models/Document";
import { Component, Prop, Vue } from "vue-property-decorator";
import { DocumentTypeConstants } from "../share/DocumentTypeConstants";
import DocumentDownloader from "./DocumentDownloader.vue";
import { extend, ValidationProvider } from "vee-validate";
import { is } from "vee-validate/dist/rules";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import { DfDocument } from "df-shared/src/models/DfDocument";
import { ref } from "@vue/reactivity";
import FooterContainer from "../../footer/FooterContainer.vue";
import BackNext from "../../footer/BackNext.vue";
import AllowCheckTax from "../share/AllowCheckTax.vue";

extend("is", {
  ...is,
  message: "field-required",
  validate: value => !!value
});

@Component({
  components: {
    ValidationProvider,
    DocumentDownloader,
    NakedCard,
    FooterContainer,
    BackNext,
    AllowCheckTax
  }
})
export default class CoTenantTax extends Vue {
  documentsDefinitions = DocumentTypeConstants.TAX_DOCS;
  @Prop() coTenantId!: number;
  documentType?: DocumentType;
  showDownloader = ref(false);
  forceShowDownloader = ref(false);
  document!: DfDocument;

  changeDocument(docType?: DocumentType, doc?: DfDocument) {
    this.documentType = docType;
    this.document = doc as DfDocument;
    this.showDownloader.value = this.documentType?.key === "my-name";
    this.forceShowDownloader.value = this.documentType?.key === "my-name";
  }

  enrichFormData(formData: FormData) {
    if (this.documentType?.key === "my-name") {
      formData.append("noDocument", "false");
    } else {
      formData.append("noDocument", "true");
    }
  }

  goBack() {
    this.$emit("on-back");
  }

  goNext() {
    const formData = new FormData();

    if (this.documentType?.key === "other-tax") {
      if (this.document.customText) {
        formData.append("customText", this.document.customText);
      } else {
        // TODO : replace by form and validation
        this.$toasted.show(this.$i18n.t("custom-text-required").toString(), {
          type: "error",
          duration: 7000
        });
        return;
      }
    }

    this.enrichFormData(formData);

    formData.append("typeDocumentTax", this.documentType?.value as string);
    if (this.document.id && this.document.id > 0) {
      formData.append("id", this.document.id.toString());
    }
    formData.append("tenantId", this.coTenantId.toString());
    const loader = this.$loading.show();

    this.$store
      .dispatch("saveTenantTax", formData)
      .then(() => {
        Vue.toasted.global.save_success();
        this.$emit("on-next");
      })
      .catch(err => {
        if (err.response.data.message.includes("NumberOfPages")) {
          Vue.toasted.global.save_failed_num_pages();
        } else {
          Vue.toasted.global.save_failed();
        }
      })
      .finally(() => {
        loader.hide();
      });
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
    "goto-documentation" : "Go to documentation",
    "custom-text-required" : "Please, fullfil the explanation field"
  },
  "fr": {
    "title": "L'avis d'imposition de mon conjoint",
    "my-name": "J’ai un avis d’imposition au nom de mon conjoint",
    "my-parents": "Mon conjoint est rattaché fiscalement à ses parents",
    "less-than-year": "Mon conjoint est en France depuis moins d'un an",
    "other-tax": "Autre",
    "accept-verification": "J'accepte que DossierFacile procède à une vérification automatisée de la fiche d'imposition de mon garant auprès des services des impôts",
    "custom-text": "Afin d'améliorer votre dossier, veuillez expliquer ci-dessous pourquoi vous ne recevez pas d'avis d'imposition. Votre explication sera ajoutée à votre dossier :", 
    "situation": "Quelle est sa situation fiscale ?",
    "warning-no-accepted-doc": "Attention, l'avis de situation déclarative n'est pas accepté.",
    "goto-documentation" : "Consulter la documentation",
    "custom-text-required" : "Veuillez remplir le champs d'explication"
  }
}
</i18n>
