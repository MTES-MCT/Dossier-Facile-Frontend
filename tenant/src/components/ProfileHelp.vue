<template>
  <div>
    <NameInformationHelp v-if="tenantStep === 0"></NameInformationHelp>
    <DocumentHelp v-if="tenantStep === 2 && tenantSubStep !== 5"></DocumentHelp>
    <TaxHelp v-if="tenantStep === 2 && tenantSubStep === 5"></TaxHelp>
    <GuarantorChoiceHelp v-if="tenantStep === 3"></GuarantorChoiceHelp>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import NameInformationHelp from "./helps/NameInformationHelp.vue";
import GuarantorChoiceHelp from "./helps/GuarantorChoiceHelp.vue";
import DocumentHelp from "./helps/DocumentHelp.vue";
import TaxHelp from "./helps/TaxHelp.vue";
import { mapState } from "vuex";

@Component({
  components: { NameInformationHelp, DocumentHelp, TaxHelp, GuarantorChoiceHelp },
  computed: {
    ...mapState({
      tenantStep: "tenantStep",
      tenantSubStep: "tenantSubStep"
    })
  }
})
export default class ProfileHelp extends Vue {
  public tenantStep!: number;
}
</script>