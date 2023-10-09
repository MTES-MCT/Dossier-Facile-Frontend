<template>
  <div>
    <DocumentDownloader
      :coTenantId="coTenantId"
      :documentsDefinitions="documentsDefinitions"
      documentCategory="TAX"
      dispatchMethodName="saveTenantTax"
      typeDocument="typeDocumentTax"
      translationKeyPrefix="cotenanttax."
      listType="grid"
      :showDownloader="showDownloader"
      :forceShowDownloader="forceShowDownloader"
      :testAvisSituation="true"
      @on-change-document="changeDocument"
      @enrich-form-data="enrichFormData"
    >
      <template v-slot:title>
        {{ $t("cotenanttax.title") }}
      </template>
      <template v-slot:after-select-block>
        <NakedCard
          class="fr-p-md-5w fr-mb-3w fr-mt-3w"
          v-if="documentType ? documentType.key === 'other-tax' : false"
        >
          <div class="fr-input-group">
            <label class="fr-label" for="customText">{{
              $t("cotenanttax.custom-text")
            }}</label>
            <textarea
              v-model="document.customText"
              class="form-control fr-input validate-required"
              id="customText"
              name="customText"
              placeholder=""
              type="text"
              required
              maxlength="2000"
              rows="4"
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
import FooterContainer from "../../footer/FooterContainer.vue";
import BackNext from "../../footer/BackNext.vue";
import { UtilsService } from "@/services/UtilsService";

extend("is", {
  ...is,
  message: "field-required",
  validate: (value) => !!value,
});

@Component({
  components: {
    ValidationProvider,
    DocumentDownloader,
    NakedCard,
    FooterContainer,
    BackNext,
  },
})
export default class CoTenantTax extends Vue {
  documentsDefinitions = DocumentTypeConstants.TAX_DOCS;
  @Prop() coTenantId!: number;
  documentType?: DocumentType;
  showDownloader = false;
  forceShowDownloader = false;
  document!: DfDocument;

  changeDocument(docType?: DocumentType, doc?: DfDocument) {
    this.documentType = docType;
    this.document = doc as DfDocument;
    this.showDownloader = this.documentType?.key === "my-name";
    this.forceShowDownloader = this.documentType?.key === "my-name";
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

  getRegisteredDoc() {
    const coTenant = UtilsService.getTenant(Number(this.coTenantId));
    if (coTenant.documents !== null) {
      const doc = coTenant.documents?.find((d: DfDocument) => {
        return d.documentCategory === "TAX";
      });
      return doc;
    }
    return undefined;
  }

  goNext() {
    const formData = new FormData();

    if (this.documentType?.key === "other-tax") {
      if (this.document.customText) {
        formData.append("customText", this.document.customText);
      } else {
        // TODO : replace by form and validation
        Vue.toasted.global.error_toast({
          message: "cotenanttax.custom-text-required",
        });
        return;
      }
    }

    this.enrichFormData(formData);

    const d = this.getRegisteredDoc();
    if (
      this.documentType?.value === d?.subCategory &&
      this.document.customText === d?.customText
    ) {
      this.$emit("on-next");
      return true;
    }

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
      .catch((err) => {
        UtilsService.handleCommonSaveError(err);
      })
      .finally(() => {
        loader.hide();
      });
  }
}
</script>
