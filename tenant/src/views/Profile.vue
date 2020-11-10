<template>
  <div class="rf-container rf-container-full-size">
    <div class="rf-grid-row full-height">
      <LeftEditMenu class="rf-col-md-3 rf-col-lg-2"></LeftEditMenu>
      <div class="rf-col-md-6 rf-col-sm-12">
        <NameInformationForm></NameInformationForm>
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

@Component({
  components: { Help, EditSummary, LeftEditMenu, NameInformationForm }
})
export default class Home extends Vue {}
</script>

<style lang="scss">
.rf-container-full-size {
  padding-left: 0;
  padding-right: 0;
  max-width: 100%;
}

.full-height {
  min-height: 100%;
}
</style>
