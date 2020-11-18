<template>
  <div class="rf-container rf-container-full-size">
    <div class="rf-grid-row full-height">
      <LeftEditMenu
        :step="getMenuStep()"
        class="rf-col-md-3 rf-col-lg-2"
      ></LeftEditMenu>
      <div class="rf-col-md-6 rf-col-sm-12">
        <div class="content">
          <NameInformationForm
            :title="$t('title-step1')"
            :user="user"
            v-if="currentStep === 0"
          ></NameInformationForm>
          <TenantInformationForm
            :title="$t('title-step1')"
            :user="user"
            v-if="currentStep === 1"
          ></TenantInformationForm>
          <UploadDocuments
            :title="$t('title-step2')"
            :user="user"
            v-if="currentStep === 2"
          ></UploadDocuments>
        </div>
      </div>
      <div class="rf-col-md-3 rf-col-sm-12">
        <EditSummary></EditSummary>
        <Help></Help>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import LeftEditMenu from "@/components/LeftEditMenu.vue";
import EditSummary from "@/components/EditSummary.vue";
import Help from "@/components/Help.vue";
import NameInformationForm from "@/components/NameInformationForm.vue";
import { mapState } from "vuex";
import TenantInformationForm from "@/components/TenantInformationForm.vue";
import UploadDocuments from "@/components/UploadDocuments.vue";

@Component({
  components: {
    TenantInformationForm,
    Help,
    EditSummary,
    LeftEditMenu,
    NameInformationForm,
    UploadDocuments
  },
  computed: {
    ...mapState({
      user: "user",
      currentStep: "currentStep"
    })
  }
})
export default class Profile extends Vue {
  getMenuStep() {
    switch (this.currentStep) {
      case 2:
        return 1;
      case 3:
        return 3;
      default:
        return 0;
    }
  }
}
</script>

<style lang="scss" scoped>
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
</style>

<i18n>
{
"en": {
"title-step1": "Je renseigne mes informations",
"title-step2": "Je joins mes documents"
},
"fr": {
"title-step1": "Je renseigne mes informations",
"title-step2": "Je joins mes documents"
}
}
</i18n>
