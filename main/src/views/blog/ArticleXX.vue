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
              <p>14 Avril 2021 dans <a href="#">DossierFacile</a></p>
            </div>
            <div></div>
          </article>
        </div>
        <ShareArticle
          class="fr-col-md-10 fr-col-lg-8"
          :title="title"
          hashtags="Tag1,Tag2"
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
import { Component, Vue } from "vue-property-decorator";
import ShareArticle from "@/views/blog/ShareArticle.vue";

@Component({
  components: { ShareArticle },
})
export default class ArticleXX extends Vue {
  title = "";
}
</script>