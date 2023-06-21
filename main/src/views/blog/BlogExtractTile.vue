<template>
  <article class="fr-mb-3w">
    <div
      class="fr-card fr-enlarge-link fr-card--horizontal fr-card--horizontal-tier"
    >
      <div class="fr-card__body">
        <div class="fr-card__content">
          <router-link :to="path" class="fr-card__title">
            {{ title }}
          </router-link>
          <p class="fr-card__desc">
            <slot name="extract"></slot>
          </p>
          <p class="fr-card__detail">{{ publicationDate }}</p>
        </div>
      </div>
      <div class="fr-card__header">
        <div class="fr-card__img">
          <img class="fr-responsive-img" :src="image" :alt="title" />
        </div>
      </div>
    </div>
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
