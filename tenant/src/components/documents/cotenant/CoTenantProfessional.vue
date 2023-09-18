<template>
  <div>
    <DocumentDownloader
      :coTenantId="coTenantId"
      :documentsDefinitions="documentsDefinitions"
      documentCategory="PROFESSIONAL"
      dispatchMethodName="saveTenantProfessional"
      typeDocument="typeDocumentProfessional"
      listType="dropDownList"
      @on-change-document="changeDocumentType"
    >
      <template v-slot:title>
        {{ $t("cotenantprofessional.title") }}
      </template>
    </DocumentDownloader>
  </div>
</template>

<script lang="ts">
import { DocumentType } from "df-shared/src/models/Document";
import { Component, Prop, Vue } from "vue-property-decorator";
import DocumentHelp from "../../helps/DocumentHelp.vue";
import DocumentInsert from "../share/DocumentInsert.vue";
import { DocumentTypeConstants } from "../share/DocumentTypeConstants";
import DocumentDownloader from "./DocumentDownloader.vue";

@Component({
  components: {
    DocumentHelp,
    DocumentInsert,
    DocumentDownloader,
  },
})
export default class CoTenantProfessional extends Vue {
  documentsDefinitions = DocumentTypeConstants.PROFESSIONAL_DOCS;
  @Prop() coTenantId!: number;
  documentType?: DocumentType;

  changeDocumentType(docType?: DocumentType) {
    this.documentType = docType;
  }
}
</script>

<style scoped lang="scss"></style>
