<template>
  <section class="rf-accordion">
    <h3 class="accordion__title rf-m-0">
      <button
        class="rf-accordion__btn rf-accordion__btn--icon-right"
        aria-expanded="false"
        :aria-controls="id"
      >
        <slot name="header"> </slot>
      </button>
    </h3>
    <div class="rf-accordion__body" :id="id">
      <div class="rf-accordion__inner">
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
