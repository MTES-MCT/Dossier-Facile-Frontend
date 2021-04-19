<template>
  <div class="card">
    <slot name="content"></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class NakedCard extends Vue {}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.hidden {
  display: none;
}
.card {
  padding: 10px;
  margin-top: 30px;
  margin-bottom: 20px;
  max-width: 500px;

  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);

  border-radius: 10px;

  background: var(--w);

  a {
    &:before {
      content: none;
    }
  }
}

.fr-link {
  flex-direction: row;
}

hr {
  color: gray;
  border-style: inset;
  border-width: 1px;
  margin: 0.5em auto;
}
</style>
