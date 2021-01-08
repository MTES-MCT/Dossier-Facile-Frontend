<template>
  <div class="container">
    <div class="rf-grid-col main-content">
      <div class="rf-mb-3w">
        <div class="rf-grid-row">
          <input type="checkbox" v-model="show" />
          <input v-model.number="page" type="number" style="width: 5em" /> /{{
            numPages
          }}
          <button @click="decreasePage()">«</button>
          <button @click="increasePage()">»</button>
        </div>
      </div>
      <div class="pdf-content">
        <div
          v-if="loadedRatio > 0 && loadedRatio < 1"
          style="background-color: green; color: white; text-align: center"
          :style="{ width: loadedRatio * 100 + '%' }"
        >
          {{ Math.floor(loadedRatio * 100) }}%
        </div>
        <pdf
          v-if="show"
          ref="pdf"
          style="border: 1px solid red"
          :src="src"
          :page="page"
          :rotate="rotate"
          @progress="loadedRatio = $event"
          @error="error"
          @num-pages="numPages = $event"
          @link-clicked="page = $event"
        ></pdf>
      </div>
    </div>
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

  show = true;
  loadedRatio = 0;
  page = 1;
  numPages = 0;
  rotate = 0;

  decreasePage() {
      if (this.page > 1) {
        this.page--;
      }
  }

  increasePage() {
      if (this.page < this.numPages) {
        this.page++;
      }
  }

  error(err: any) {
      console.log(err);
  }
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

.main-content {
  width: 80%;
  margin: auto;
}
</style>