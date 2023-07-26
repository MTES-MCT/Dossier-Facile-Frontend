<template>
  <div>
    <DocumentDownloader
      :coTenantId="coTenantId"
      :documentsDefinitions="documentsDefinitions"
      documentCategory="RESIDENCY"
      listType="dropDownList"
      dispatchMethodName="saveTenantResidency"
      typeDocument="typeDocumentResidency"
    >
      <template v-slot:title>
        {{ $t("cotenantresidency.title") }}
      </template>
    </DocumentDownloader>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { DocumentTypeConstants } from "../share/DocumentTypeConstants";
import DocumentDownloader from "./DocumentDownloader.vue";

@Component({
  components: {
    DocumentDownloader
  }
})
export default class CoTenantProfessional extends Vue {
  documentsDefinitions = DocumentTypeConstants.RESIDENCY_DOCS;
  @Prop() coTenantId!: number;
}
</script>

