<template>
  <DocumentLink
    person-type="COTENANT_GUARANTOR"
    :router-params="{
      step: 5,
      substep: substep,
      tenantId: coTenant.id,
      guarantorId: guarantor.id,
    }"
    :document-type="documentType"
    :status="getStatus()"
    :active="active"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ColoredTag from "df-shared/src/components/ColoredTag.vue";
import DocumentLink from "./DocumentLink.vue";
import { Guarantor } from "df-shared/src/models/Guarantor";
import { DocumentService } from "@/services/DocumentService";
import { DocumentType } from "./DocumentType";
import { User } from "df-shared/src/models/User";

@Component({
  components: { ColoredTag, DocumentLink },
})
export default class CoTenantGuarantorDocumentLink extends Vue {
  @Prop() guarantor!: Guarantor;
  @Prop() coTenant!: User;
  @Prop() documentType!: DocumentType;
  @Prop() substep!: number;
  @Prop() active!: boolean;

  private getStatus() {
    return DocumentService.guarantorStatus(this.documentType, this.guarantor);
  }
}
</script>
