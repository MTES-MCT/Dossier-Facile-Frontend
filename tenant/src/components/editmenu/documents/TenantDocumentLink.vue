<template>
  <DocumentLink
    person-type="TENANT"
    :router-params="{ substep: substep }"
    :document-type="documentType"
    :status="getStatus()"
    :active="active"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ColoredTag from "df-shared/src/components/ColoredTag.vue";
import DocumentLink from "./DocumentLink.vue";
import { DocumentService } from "@/services/DocumentService";
import { DocumentType } from "./DocumentType";

@Component({
  components: { ColoredTag, DocumentLink },
})
export default class TenantDocumentLink extends Vue {
  @Prop() documentType!: DocumentType;
  @Prop() substep!: number;
  @Prop() active!: boolean;

  private getStatus() {
    return DocumentService.tenantStatus(this.documentType);
  }
}
</script>
