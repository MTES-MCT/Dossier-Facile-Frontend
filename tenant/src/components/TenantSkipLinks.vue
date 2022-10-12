<template>
  <SkipLinks :links="skipLinks"></SkipLinks>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import SkipLinks from "df-shared/src/components/SkipLinks.vue";
import { mapState } from "vuex";
import { SkipLink } from "df-shared/src/models/SkipLink";

@Component({
  components: {
    SkipLinks
  },
  computed: {
    ...mapState({
      skipLinks: "skipLinks"
    })
  }
})
export default class TenantSkipLinks extends Vue {}

export const FOOTER_NAVIGATION = {
  anchor: "#footer-navigation",
  name: "Navigation"
};

export const FUNNEL_SKIP_LINKS: SkipLink[] = [
  {
    anchor: "#funnel-menu",
    name: "Menu d'ajout des documents"
  },
  {
    anchor: "#step-content",
    name: "Contenu de l'étape"
  },
  FOOTER_NAVIGATION
];
</script>

<style scoped lang="scss"></style>
