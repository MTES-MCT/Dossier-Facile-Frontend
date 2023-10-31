<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="fr-responsive-img fr-artwork"
    aria-hidden="true"
    width="160"
    height="200"
    viewBox="0 0 160 200"
  >
    <use class="fr-artwork-motif" :href="ovoidSprite + '#artwork-motif'"></use>
    <use
      class="fr-artwork-background"
      :href="ovoidSprite + '#artwork-background'"
    ></use>
    <g transform="translate(40, 60)">
      <use
        class="fr-artwork-decorative"
        :href="technicalErrorSprite + '#artwork-decorative'"
      ></use>
      <use
        class="fr-artwork-minor"
        :href="technicalErrorSprite + '#artwork-minor'"
      ></use>
      <use
        class="fr-artwork-major"
        :href="technicalErrorSprite + '#artwork-major'"
      ></use>
    </g>
  </svg>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Artwork extends Vue {
  @Prop({ default: "technical-error" }) public pictogram!: string;

  ovoidSprite = require("@gouvfr/dsfr/dist/artwork/background/ovoid.svg");
  technicalErrorSprite = require(`@gouvfr/dsfr/dist/artwork/pictograms/system/${this.pictogram}.svg`);
}
</script>

<style scoped lang="scss"></style>
