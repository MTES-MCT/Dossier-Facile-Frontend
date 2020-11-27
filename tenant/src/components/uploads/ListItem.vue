<template>
  <div class="rf-grid-row">
    <div class="text">
      {{ filename }}
    </div>
    <div class="progress">
      <Progress :percentage="percentage" :state="uploadState" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Progress from "./Progress.vue";
@Component({
  components: {
    Progress
  }
})
export default class ListItem extends Vue {
  @Prop({ default: "" })
  private filename!: string;
  @Prop({ default: "idle" })
  private uploadState!: string;
  @Prop({ default: 0 })
  private percentage!: number;
}
</script>

<style scoped lang="scss">
.progress {
  float: left;
}
.text {
  float: right;
  flex: 1;
}
.row {
  height: 42px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
