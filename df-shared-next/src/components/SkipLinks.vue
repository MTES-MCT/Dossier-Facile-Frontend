<template>
  <div class="fr-skiplinks">
    <nav class="fr-container" role="navigation" aria-label="Accès rapide">
      <ul class="fr-skiplinks__list">
        <li v-for="link in links" v-bind:key="link.anchor">
          <a class="fr-link" :href="link.anchor">{{ link.name }}</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { CONTENT, FOOTER, SkipLink } from "../models/SkipLink";
import { PropType } from "vue";

defineProps({
  links: {
    type: Array as PropType<SkipLink[]>,
    required: false,
    default: () => [CONTENT, FOOTER]
  }
});
</script>

<style scoped lang="scss"></style>
