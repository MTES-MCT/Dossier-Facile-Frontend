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

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { CONTENT, FOOTER, SkipLink } from "../models/SkipLink";

@Component
export default class SkipLinks extends Vue {
  @Prop({ default: () => [CONTENT, FOOTER] }) links!: SkipLink[];
}
</script>

<style scoped lang="scss"></style>
