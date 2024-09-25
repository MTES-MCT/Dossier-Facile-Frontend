<template>
  <div>
    <div class="profile-footer">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss">
.profile-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  box-shadow:
    0 -5px 5px -2.5px rgba(0, 0, 0, 0.04),
    0 -10px 12.5px -2.5px rgba(0, 0, 0, 0.1);
  padding: 20px;
  z-index: 2;
}
</style>
