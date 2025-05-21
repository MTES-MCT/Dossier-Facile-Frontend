<template>
  <section class="fr-mb-12w">
    <div class="fr-container">
      <div class="fr-grid-row justify-content-center">
        <div class="fr-col-md-10 fr-col-lg-8">
          <article>
            <div class="text-center fr-mt-3w fr-mb-3w">
              <h1 class="fr-h1">
                {{ props.title }}
              </h1>
              <p>{{ props.date }} dans <a href="#">DossierFacile</a></p>
            </div>
            <div>
              <slot></slot>
            </div>
          </article>
        </div>
        <ShareArticle
          class="fr-col-md-10 fr-col-lg-8"
          :title="props.title"
          :hashtags="props.hashtags"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import ShareArticle from './ShareArticle.vue'

const props = withDefaults(
  defineProps<{
    title: string
    date: string
    hashtags?: string
  }>(),
  {
    hashtags: ''
  }
)
</script>
<style scoped lang="scss">
@use 'df-shared-next/src/scss/_variables.scss';

a {
  color: var(--light-blue);
}
</style>
