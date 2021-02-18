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

  -webkit-box-shadow: 0 7px 15px 0 rgba(0, 0, 0, 0.5);
  -moz-box-shadow: 0 7px 15px 0 rgba(0, 0, 0, 0.5);
  box-shadow: 0 7px 15px 0 rgba(0, 0, 0, 0.5);

  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);

  background: rgb(255, 255, 255);
  background: linear-gradient(
    125deg,
    rgba(255, 255, 255, 1) 5%,
    rgba(231, 231, 231, 1) 30%,
    rgba(240, 240, 240, 1) 100%
  );
  box-shadow: 8px 8px 12px 0 rgba(0, 0, 15, 0.2),
    -8px -8px 12px 0 rgba(240, 240, 255, 0.8);

  a {
    &:before {
      content: none;
    }
  }
}

.rf-link {
  flex-direction: row;
}

hr {
  color: gray;
  border-style: inset;
  border-width: 1px;
  margin: 0.5em auto;
}
</style>
