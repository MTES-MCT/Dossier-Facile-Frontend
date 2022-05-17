<template>
  <div
    class="fr-col-lg-3 fr-col-md-4 fr-col-sm-6 fr-col-12 text-center fr-p-2w logo-container"
  >
    <a
      :href="href"
      :title="getTitle()"
      class="logo-link"
      rel="noreferrer"
      target="_blank"
    >
      <img
        :alt="name"
        :height="height"
        :src="getImage()"
        :width="width"
        class="partner-logo"
      />
    </a>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class LogoPartnerComponent extends Vue {
  @Prop() public name!: string;
  @Prop() public image: unknown;
  @Prop() public href!: string;
  @Prop({ default: "60px" }) public width!: string;
  @Prop({ default: "60px" }) public height!: string;

  getTitle() {
    return "aller sur le site « " + this.name + " » (nouvelle fenêtre)";
  }

  getImage() {
    if (this.image) return this.image;
    // fallback - Try to find logo in default logo assets
    return require("../assets/logos/" + this.name + ".webp");
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
a[target="_blank"].logo-link::after {
  content: none;
}

.logo-link {
  box-shadow: none;
  background-image: none;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  @media (min-width: 768px) {
    min-height: 100px;
  }
}
</style>
