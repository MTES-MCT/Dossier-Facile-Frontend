<template>
  <div class="fr-container fr-container-full-size">
    <div class="bg-grey fr-grid-row full-height">
      <LeftEditMenu class="fr-col-md-3 fr-col-xl-2"></LeftEditMenu>
      <div
        class="fr-col-xl-7 fr-col-md-6 fr-col-xs-12 fr-p-md-4w fr-p-2w fr-grid-row fr-grid-row--center"
      >
        <div class="fr-col-12 fr-mt-3w max-600">
          <div class="step fr-mb-3w" v-if="tenantStep <= 1">
            <div class="step-number">1</div>
            <div>
              <h4>{{ $t("title-step1") }}</h4>
            </div>
          </div>
          <div class="step fr-mb-3w" v-if="tenantStep === 2">
            <div class="step-number">2</div>
            <div>
              <h4>{{ $t("title-step2") }}</h4>
            </div>
          </div>
          <div class="step fr-mb-3w" v-if="tenantStep === 3">
            <div class="step-number">3</div>
            <div>
              <h4>{{ $t("title-step3") }}</h4>
            </div>
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
      <div class="fr-col-md-3 fr-col-xs-12 fr-p-2w">
        <EditSummary></EditSummary>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import LeftEditMenu from "@/components/LeftEditMenu.vue";
import EditSummary from "@/components/EditSummary.vue";
import NameInformationForm from "@/components/NameInformationForm.vue";
import { mapState } from "vuex";
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

  mounted() {
    window.Beacon('init', 'e9f4da7d-11be-4b40-9514-ac7ce3e68f67');
  }

  beforeDestroy() {
    window.Beacon('destroy');
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

.step-number {
  background-color: var(--primary);
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
.bg-grey {
  background-color: #f2f2f9;
}
</style>

<i18n>
{
"en": {
"title-step1": "I fulfill my information",
"title-step2": "I join my documents",
"title-step3": "I fulfill my guarantor"
},
"fr": {
"title-step1": "Je renseigne mes informations",
"title-step2": "Je joins mes documents",
"title-step3": "Je renseigne mon garant"
}
}
</i18n>
