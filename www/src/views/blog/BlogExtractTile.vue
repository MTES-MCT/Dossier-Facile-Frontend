<template>
  <article class="fr-mb-3w">
    <div class="fr-card fr-enlarge-link fr-card--horizontal fr-card--horizontal-tier">
      <div class="fr-card__body">
        <div class="fr-card__content">
          <router-link :to="props.path" class="fr-card__title">
            {{ props.title }}
          </router-link>
          <p class="fr-card__desc">
            <slot name="extract"></slot>
          </p>
          <p class="fr-card__detail">{{ props.publicationDate }}</p>
        </div>
      </div>
      <div class="fr-card__header">
        <div class="fr-card__img">
          <img class="fr-responsive-img" :src="getImageUrl()" :alt="props.title" />
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  path: string
  image: string
  publicationDate: string
}>()

function getImageUrl() {
  return props.image
}
</script>
<style scoped lang="scss">
@import 'df-shared-next/src/scss/_variables.scss';

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
