<template>
  <div>
    <div class="rf-grid-col main-content">
      <div class="rf-mb-3w">
        <div class="rf-grid-row">
          <div class="rf-col-4 rf-col-md-2">
            <input v-model.number="page" type="number" style="width: 5em" /> /{{
              numPages
            }}
          </div>
          <div class="rf-col-2 rf-col-md-1">
            <button @click="decreasePage()">«</button>
          </div>
          <div class="rf-col-2 rf-col-md-1">
            <button @click="increasePage()">»</button>
          </div>
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
  components: { pdf }
})
export default class PdfViewer extends Vue {
  @Prop() private src!: string;

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
.main-content {
  width: 768px;
  @media all and (max-width: 992px) {
    width: 95%;
  }
  margin: auto;
}

.pdf-content {
  width: 100%;
}
</style>
