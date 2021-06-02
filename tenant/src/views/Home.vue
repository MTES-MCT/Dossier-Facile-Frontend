<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Home extends Vue {

  mounted() {
    this.$nextTick(function() {
      window.stop();
      window.location.replace("https://www.dossierfacile.fr");
  })
  }
}
</script>
