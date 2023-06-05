<template>
  <div>
    <div class="fr-grid-col main-content">
      <div class="fr-mb-3w">
        <div class="fr-grid-row">
          <div class="fr-mr-1v">
            <button @click="decreasePage()">«</button>
          </div>
          <div>
            <input
              v-model.number="page"
              type="number"
              style="width: 2.5rem"
              min="1"
              :max="numPages"
            />
            / {{ numPages }}
          </div>
          <div class="fr-ml-1v">
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
  components: { pdf },
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
    if (this.page >= this.numPages) {
      this.page = this.numPages - 1;
    }
  }

  increasePage() {
    if (this.page < this.numPages) {
      this.page++;
    }
    if (this.page < 1) {
      this.page = 1;
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
