<template>
  <div class="fr-container fr-container-full-size">
    <TopEditMenu :step="step"></TopEditMenu>
    <div class="bg-grey full-height fr-grid-row">
      <LeftEditMenu :step="step" class="fr-col-md-3 fr-col-xl-2"></LeftEditMenu>
      <div
        class="fr-col-xl-10 fr-col-md-9 fr-col-xs-12 fr-p-md-4w fr-p-2w fr-grid-row fr-grid-row--center"
      >
        <div class="fr-col-12 max-600">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import LeftEditMenu from "@/components/LeftEditMenu.vue";
import TopEditMenu from "@/components/TopEditMenu.vue";
import NameInformationForm from "@/components/NameInformationForm.vue";
import TenantInformationForm from "@/components/TenantInformationForm.vue";
import UploadDocuments from "@/components/UploadDocuments.vue";
import GuarantorDocuments from "@/components/GuarantorDocuments.vue";
import ValidateFile from "@/components/ValidateFile.vue";
import { UtilsService } from "../services/UtilsService";

@Component({
  components: {
    TenantInformationForm,
    LeftEditMenu,
    TopEditMenu,
    NameInformationForm,
    UploadDocuments,
    GuarantorDocuments,
    ValidateFile
  }
})
export default class ProfileContainer extends Vue {
  @Prop() step!: number;
  isMobile() {
    return UtilsService.isMobile();
  }
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
