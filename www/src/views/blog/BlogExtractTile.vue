<template>
  <article class="fr-mb-3w">
    <div class="fr-card fr-enlarge-link fr-card--horizontal fr-card--horizontal-tier">
      <div class="fr-card__body">
        <div class="fr-card__content">
          <router-link :to="path" class="fr-card__title color--secondary">
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
          <img class="fr-responsive-img" :src="image" alt="" />
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  path: string
  image: string
  publicationDate: string
}>()
</script>
