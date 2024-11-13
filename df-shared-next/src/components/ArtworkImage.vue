<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="fr-responsive-img fr-artwork"
    aria-hidden="true"
    width="160"
    height="200"
    viewBox="0 0 160 200"
  >
    <use
      class="fr-artwork-motif"
      href="@gouvfr/dsfr/dist/artwork/background/ovoid.svg#artwork-motif"
    ></use>
    <use
      class="fr-artwork-background"
      href="@gouvfr/dsfr/dist/artwork/background/ovoid.svg#artwork-background"
    ></use>
    <g transform="translate(40, 60)">
      <use
        class="fr-artwork-decorative"
        :href="`@gouvfr/dsfr/dist/artwork/pictograms/system/${pictogram}.svg#artwork-decorative`"
      ></use>
      <use
        class="fr-artwork-minor"
        :href="`@gouvfr/dsfr/dist/artwork/pictograms/system/${pictogram}.svg#artwork-minor`"
      ></use>
      <use
        class="fr-artwork-major"
        :href="`@gouvfr/dsfr/dist/artwork/pictograms/system/${pictogram}.svg#artwork-major`"
      ></use>
    </g>
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ pictogram?: string }>(), {
  pictogram: 'technical-error'
})
</script>
