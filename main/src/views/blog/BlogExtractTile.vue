<template>
  <article class="fr-mb-12w">
    <div class="text-center">
      <router-link class="fr-tile__link" :to="path">
        <h2 class="fr-h2">
          {{ title }}
        </h2>
      </router-link>
      <span>{{ publicationDate }} dans </span>
      <span>
        <a href="#">DossierFacile</a>
      </span>
    </div>
    <!--end article title-->
    <div class="article__body">
      <router-link class="fr-tile__link" :to="path">
        <img class="img-center" :alt="title" :src="image" />
      </router-link>
      <slot name="extract"></slot>
      <router-link :to="path" :title="title">
        Continuer la lecture »
      </router-link>
    </div>
    <!--end article title-->
  </article>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Component
export default class BlogExtractTile extends Vue {
  @Prop() title!: string;
  @Prop() path!: string;
  @Prop() image!: string;
  @Prop() publicationDate!: string;
}
</script>
<style scoped lang="scss">
@import "df-shared/src/scss/_variables.scss";

a {
  color: $light-blue;
}

.fr-h2 {
  width: 100%;
}
.article__body {
  margin-top: 1rem;
}
</style>
