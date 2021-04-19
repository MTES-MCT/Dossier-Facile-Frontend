<template>
  <section class="fr-accordion">
    <h3 class="accordion__title fr-m-0">
      <button
        class="fr-accordion__btn fr-accordion__btn--icon-right"
        aria-expanded="false"
        :aria-controls="id"
      >
        <slot name="header"> </slot>
      </button>
    </h3>
    <div class="fr-collapse" :id="id">
      <div class="fr-accordion__inner">
        <p>
          <slot name="body"> </slot>
        </p>
      </div>
    </div>
    <div class="accordion__content"></div>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class AccordionElement extends Vue {
  @Prop() id!: string;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
