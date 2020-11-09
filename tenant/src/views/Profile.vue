<template>
  <div class="rf-container rf-container-full-size">
    <div class="rf-grid-row full-height">
      <LeftEditMenu class="left-menu rf-col-md-2"></LeftEditMenu>
      <div class="rf-col-md-9 rf-col-sm-12">
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

@Component({
  components: { Help, EditSummary, LeftEditMenu }
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

@media all and (max-width: 768px) {
  .left-menu {
    display: none;
  }
}
</style>
