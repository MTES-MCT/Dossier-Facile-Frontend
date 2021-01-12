<template>
  <div class="rf-container rf-container-full-size">
    <div class="rf-grid-row full-height">
      <LeftEditMenu
        :step="getMenuStep()"
        class="rf-col-md-3 rf-col-lg-2"
      ></LeftEditMenu>
      <div class="rf-col-md-6 rf-col-sm-12">
        <div class="content">
          <div class="step rf-mb-5w" v-if="tenantStep <= 1">
            <div class="step-number">1</div>
            <div class="step-title">{{ $t("title-step1") }}</div>
          </div>
          <div class="step rf-mb-5w" v-if="tenantStep === 2">
            <div class="step-number">2</div>
            <div class="step-title">{{ $t("title-step2") }}</div>
          </div>
          <div class="step rf-mb-5w" v-if="tenantStep === 3">
            <div class="step-number">3</div>
            <div class="step-title">{{ $t("title-step3") }}</div>
          </div>
          <NameInformationForm
            :user="user"
            v-if="tenantStep === 0"
          ></NameInformationForm>
          <TenantInformationForm
            v-if="tenantStep === 1"
          ></TenantInformationForm>
          <UploadDocuments v-if="tenantStep === 2"></UploadDocuments>
          <GuarantorDocuments v-if="tenantStep === 3"></GuarantorDocuments>
          <ValidateFile v-if="tenantStep >= 4"></ValidateFile>
        </div>
      </div>
      <div class="rf-col-md-3 rf-col-sm-12">
        <EditSummary></EditSummary>
        <ProfileHelp></ProfileHelp>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import LeftEditMenu from "@/components/LeftEditMenu.vue";
import EditSummary from "@/components/EditSummary.vue";
import ProfileHelp from "@/components/ProfileHelp.vue";
import NameInformationForm from "@/components/NameInformationForm.vue";
import { mapState } from "vuex";
import TenantInformationForm from "@/components/TenantInformationForm.vue";
import UploadDocuments from "@/components/UploadDocuments.vue";
import GuarantorDocuments from "@/components/GuarantorDocuments.vue";
import ValidateFile from "@/components/ValidateFile.vue";

@Component({
  components: {
    TenantInformationForm,
    ProfileHelp,
    EditSummary,
    LeftEditMenu,
    NameInformationForm,
    UploadDocuments,
    GuarantorDocuments,
    ValidateFile
  },
  computed: {
    ...mapState({
      user: "user",
      tenantStep: "tenantStep"
    })
  }
})
export default class Profile extends Vue {
  public tenantStep!: number;

  getMenuStep() {
    switch (this.tenantStep) {
      case 2:
        return 1;
      case 3:
      case 4:
        return 3;
      default:
        return 0;
    }
  }
}
</script>

<style lang="scss" scoped>
@import "df-shared/src/scss/_variables.scss";

.rf-container-full-size {
  padding-left: 0;
  padding-right: 0;
  max-width: 100%;
}

.full-height {
  min-height: 100%;
}

.content {
  padding: 2rem;
}

.step-number {
  padding: 1px;
  background-color: $primary;
  color: white;
  margin: 0 5px;
  border-radius: 50%;
  display: inline-block;
  height: 25px;
  width: 25px;
  min-width: 25px;
  text-align: center;
  z-index: 1;
}
.step {
  display: flex;
  align-items: center;
}
.step-title {
  font-size: 1.5rem;
}
</style>

<i18n>
{
"en": {
"title-step1": "Je renseigne mes informations",
"title-step2": "Je joins mes documents",
"title-step3": "Je renseigne mon garant"
},
"fr": {
"title-step1": "Je renseigne mes informations",
"title-step2": "Je joins mes documents",
"title-step3": "Je renseigne mon garant"
}
}
</i18n>
