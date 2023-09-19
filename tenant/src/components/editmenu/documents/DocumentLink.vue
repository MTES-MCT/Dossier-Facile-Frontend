<template>
  <div>
    <router-link
      :to="{
        name: getTargetComponent(personType),
        params: routerParams,
      }"
    >
      <ColoredTag
        :text="getText()"
        :status="status"
        :active="active"
      ></ColoredTag>
    </router-link>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ColoredTag from "df-shared/src/components/ColoredTag.vue";
import { DocumentType, DocumentTypeTranslations } from "./DocumentType";

@Component({
  components: { ColoredTag },
})
export default class DocumentLink extends Vue {
  @Prop() personType!: PersonType;
  @Prop() routerParams?: any;
  @Prop() documentType!: DocumentType;
  @Prop() status!: string;
  @Prop() active!: boolean;

  private componentsPerType: { [type in PersonType]: string } = {
    TENANT: "TenantDocuments",
    GUARANTOR: "GuarantorDocuments",
    COTENANT: "CoTenantDocuments",
    COTENANT_GUARANTOR: "TenantGuarantorDocuments",
  };

  private getText(): string {
    const translationKey = DocumentTypeTranslations[this.documentType];
    return this.$i18n.t(translationKey).toString();
  }

  private getTargetComponent() {
    return this.componentsPerType[this.personType];
  }
}

export enum PersonType {
  TENANT = "TENANT",
  GUARANTOR = "GUARANTOR",
  COTENANT = "COTENANT",
  COTENANT_GUARANTOR = "COTENANT_GUARANTOR",
}
</script>

<style scoped lang="css">
[href] {
  box-shadow: none;
  background-image: none;
}
</style>
