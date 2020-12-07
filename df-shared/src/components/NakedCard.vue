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
