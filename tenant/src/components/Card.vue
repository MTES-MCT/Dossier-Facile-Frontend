<template>
  <div>
    <div class="rf-card rf-card--no-arrow">
      <div class="rf-card__body">
        <button
          href="#"
          class="rf-btn rf-card__link"
          :aria-expanded="expanded"
          aria-controls="card-content"
          @click="expanded = !expanded"
        >
          <slot name="header"></slot>
        </button>
        <div
          id="card-content"
          :class="{ hidden: !expanded }"
          class="rf-card__desc"
        >
          <slot name="body"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Help extends Vue {
  expanded = false;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.hidden {
  display: none;
}
</style>
