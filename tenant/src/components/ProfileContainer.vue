<template>
  <div class="fr-container fr-container-full-size">
    <div class="bg-grey fr-grid-row full-height">
      <LeftEditMenu :step="step" class="fr-col-md-3 fr-col-xl-2"></LeftEditMenu>
      <div
        class="fr-col-xl-7 fr-col-md-6 fr-col-xs-12 fr-p-md-4w fr-p-2w fr-grid-row fr-grid-row--center"
      >
        <div class="fr-col-12 fr-mt-3w max-600">
          <slot></slot>
        </div>
      </div>
      <div class="fr-col-md-3 fr-col-xs-12 fr-p-2w">
        <EditSummary></EditSummary>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import LeftEditMenu from "@/components/LeftEditMenu.vue";
import EditSummary from "@/components/EditSummary.vue";
import NameInformationForm from "@/components/NameInformationForm.vue";
import TenantInformationForm from "@/components/TenantInformationForm.vue";
import UploadDocuments from "@/components/UploadDocuments.vue";
import GuarantorDocuments from "@/components/GuarantorDocuments.vue";
import ValidateFile from "@/components/ValidateFile.vue";

@Component({
  components: {
    TenantInformationForm,
    EditSummary,
    LeftEditMenu,
    NameInformationForm,
    UploadDocuments,
    GuarantorDocuments,
    ValidateFile
  }
})
export default class ProfileContainer extends Vue {
  @Prop() step!: number;
}
</script>

<style lang="scss" scoped>
@import "df-shared/src/scss/_variables.scss";

.fr-container-full-size {
  padding-left: 0;
  padding-right: 0;
  max-width: 100%;
}

.full-height {
  min-height: 100%;
}

.max-600 {
  max-width: 600px;
}

.bg-grey {
  background-color: #f2f2f9;
}
</style>
