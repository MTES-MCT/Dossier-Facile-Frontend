<template>
  <DocumentLink
    person-type="GUARANTOR"
    :router-params="{ substep: substep, guarantorId: guarantor.id }"
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

@Component({
  components: { ColoredTag, DocumentLink },
})
export default class GuarantorDocumentLink extends Vue {
  @Prop() guarantor!: Guarantor;
  @Prop() documentType!: DocumentType;
  @Prop() substep!: number;
  @Prop() active!: boolean;

  private getStatus() {
    return DocumentService.guarantorStatus(
      this.documentType.toString(),
      this.guarantor
    );
  }
}
</script>
