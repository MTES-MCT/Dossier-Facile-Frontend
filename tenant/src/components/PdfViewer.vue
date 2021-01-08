<template>
  <div class="container">
    <pdf :src="src" style="display: inline-block; width: 100%"></pdf>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import pdf from "vue-pdf";

@Component({
  components: { pdf },
})
export default class PdfViewer extends Vue {
  @Prop() private src!: string;
}
</script>

<style scoped lang="scss">
@media (min-width: 576px) {
  .container {
    min-width: 540px;
  }
}
@media (min-width: 768px) {
  .container {
    min-width: 720px;
  }
}
@media (min-width: 992px) {
  .container {
    min-width: 960px;
  }
}
@media (min-width: 1200px) {
  .container {
    min-width: 1140px;
  }
}
</style>