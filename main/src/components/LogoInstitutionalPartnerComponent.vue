<template>
  <div class="fr-col-md-3 fr-col-6">
    <div class="logo-container">
      <a
        :href="href"
        :title="getTitle()"
        class="logo-link"
        rel="nofollow"
        :target="href === '#' ? '' : '_blank'"
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
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class LogoInstitutionalPartnerComponent extends Vue {
  @Prop() public name!: string;
  @Prop() public image: unknown;
  @Prop() public href!: string;
  @Prop({ default: "60px" }) public width!: string;
  @Prop({ default: "60px" }) public height!: string;
  @Prop({ default: "" }) public title?: boolean;

  getTitle() {
    if (this.title) {
      return this.title;
    }
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
  height: 180px;
  background-color: white;
}
</style>
