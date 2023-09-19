<template>
  <DocumentLink
    person-type="COTENANT"
    :router-params="{ substep: substep, guarantorId: coTenant.id }"
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
import { User } from "df-shared/src/models/User";

@Component({
  components: { ColoredTag, DocumentLink },
})
export default class CoTenantDocumentLink extends Vue {
  @Prop() coTenant!: User;
  @Prop() documentType!: DocumentType;
  @Prop() substep!: number;
  @Prop() active!: boolean;

  private getStatus() {
    return DocumentService.tenantStatus(
      this.documentType.toString(),
      this.coTenant
    );
  }
}
</script>
