<template>
  <div>
    <ValidationObserver v-slot="{ validate }">
      <DocumentDownloader
        :coTenantId="coTenantId"
        :documentsDefinitions="documentsDefinitions"
        documentCategory="RESIDENCY"
        listType="dropDownList"
        dispatchMethodName="saveTenantResidency"
        typeDocument="typeDocumentResidency"
        :showDownloader="showDownloader"
        @on-change-document="changeDocument"
      >
        <template v-slot:title>
          {{ $t("cotenantresidency.title") }}
        </template>
        <template v-slot:after-select-block>
          <NakedCard
            class="fr-p-md-5w fr-mb-3w fr-mt-3w"
            v-if="documentType ? documentType.key === 'other-residency' : false"
          >
            <validation-provider rules="required" v-slot="{ errors }">
              <div
                class="fr-input-group"
                :class="errors[0] ? 'fr-input-group--error' : ''"
              >
                <label class="fr-label" for="customText">{{
                  $t("residency-page.custom-text")
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
              <span class="fr-error-text" v-if="errors[0]">
                {{ $t(errors[0]) }}
              </span>
            </validation-provider>
          </NakedCard>
        </template>
      </DocumentDownloader>
      <FooterContainer>
        <BackNext
          :showBack="true"
          @on-next="validate().then(goNext)"
          @on-back="goBack()"
        >
        </BackNext>
      </FooterContainer>
    </ValidationObserver>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { DocumentTypeConstants } from "../share/DocumentTypeConstants";
import DocumentDownloader from "./DocumentDownloader.vue";
import { UtilsService } from "@/services/UtilsService";
import { DocumentType } from "df-shared/src/models/Document";
import { DfDocument } from "df-shared/src/models/DfDocument";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import TextField from "df-shared/src/components/form/TextField.vue";
import FooterContainer from "@/components/footer/FooterContainer.vue";
import BackNext from "@/components/footer/BackNext.vue";
import { DocumentService } from "@/services/DocumentService";
import { ValidationObserver, ValidationProvider } from "vee-validate";

@Component({
  components: {
    ValidationProvider,
    ValidationObserver,
    BackNext,
    FooterContainer,
    TextField,
    NakedCard,
    DocumentDownloader,
  },
})
export default class CoTenantResidency extends Vue {
  documentsDefinitions: any[] = [];
  @Prop() coTenantId!: number;

  documentType?: DocumentType;
  document!: DfDocument;
  showDownloader = false;
  forceShowDownloader = false;

  beforeMount() {
    this.documentsDefinitions = DocumentTypeConstants.RESIDENCY_DOCS.filter(
      (type: any) =>
        type.key !== "other-residency" ||
        UtilsService.useNewOtherResidencyCategory()
    );
  }

  changeDocument(docType: DocumentType, doc: DfDocument) {
    this.documentType = docType;
    this.document = doc as DfDocument;
    this.document.noDocument = docType?.key === "other-residency";
    this.showDownloader = docType?.key !== "other-residency";
  }

  goBack() {
    this.$emit("on-back");
  }

  goNext() {
    if (
      this.documentType?.key !== "other-residency" ||
      this.documentHasNotChanged()
    ) {
      this.$emit("on-next");
      return true;
    }

    if (!this.document.customText) {
      return;
    }

    const formData = new FormData();
    formData.append("noDocument", "true");
    formData.append("customText", this.document.customText);
    formData.append("typeDocumentResidency", this.documentType?.value);

    if (this.document.id && this.document.id > 0) {
      formData.append("id", this.document.id.toString());
    }
    formData.append("tenantId", this.coTenantId.toString());
    const loader = this.$loading.show();

    this.$store
      .dispatch("saveTenantResidency", formData)
      .then(() => {
        Vue.toasted.global.save_success();
        this.$emit("on-next");
      })
      .catch((err) => {
        Vue.toasted.global.save_failed();
      })
      .finally(() => {
        loader.hide();
      });
  }

  documentHasNotChanged() {
    const document = DocumentService.getCoTenantDocument(
      this.coTenantId,
      "RESIDENCY"
    );
    return (
      this.documentType?.value === document?.subCategory &&
      this.document.customText === document?.customText
    );
  }
}
</script>