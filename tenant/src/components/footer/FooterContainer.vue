<template>
  <div>
    <div class="horizontal-spacer"></div>
    <div class="profile-footer">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class FooterContainer extends Vue {}
</script>

<style lang="scss">
.profile-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #e5e5f4;
  padding: 20px;
  z-index: 2;
}

.horizontal-spacer {
  margin-top: 50px;
}
</style>
