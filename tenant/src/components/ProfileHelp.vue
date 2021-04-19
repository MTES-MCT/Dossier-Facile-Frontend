<template>
  <div>
    <NameInformationHelp v-if="tenantStep === 0"></NameInformationHelp>
    <TaxHelp v-if="tenantStep === 2 && tenantSubStep === 5"></TaxHelp>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import NameInformationHelp from "./helps/NameInformationHelp.vue";
import GuarantorChoiceHelp from "./helps/GuarantorChoiceHelp.vue";
import TaxHelp from "./helps/TaxHelp.vue";
import { mapState } from "vuex";

@Component({
  components: {
    NameInformationHelp,
    TaxHelp,
    GuarantorChoiceHelp
  },
  computed: {
    ...mapState({
      tenantStep: "tenantStep",
      tenantSubStep: "tenantSubStep",
      guarantorStep: "guarantorStep"
    })
  }
})
export default class ProfileHelp extends Vue {
  public tenantStep!: number;
}
</script>
