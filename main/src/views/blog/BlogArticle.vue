<template>
  <section class="fr-mb-12w">
    <div class="fr-container">
      <div class="fr-grid-row justify-content-center">
        <div class="fr-col-md-10 fr-col-lg-8">
          <article>
            <div class="text-center fr-mt-3w fr-mb-3w">
              <h1 class="fr-h1">
                {{ title }}
              </h1>
              <p>{{ date }} dans <a href="#">DossierFacile</a></p>
            </div>
            <div>
              <slot></slot>
            </div>
          </article>
        </div>
        <ShareArticle
          class="fr-col-md-10 fr-col-lg-8"
          :title="title"
          :hashtags="hashtags"
        />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@import "df-shared/src/scss/_variables.scss";

a {
  color: $light-blue;
}
</style>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ShareArticle from "./ShareArticle.vue";

@Component({
  components: { ShareArticle },
})
export default class BlogArticle extends Vue {
  @Prop() title!: string;
  @Prop() date!: string;
  @Prop({ default: "" }) hashtags!: string;
}
</script>