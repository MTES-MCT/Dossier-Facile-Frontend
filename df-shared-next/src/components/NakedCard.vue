<template>
  <div class="card">
    <slot></slot>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.hidden {
  display: none;
}
.card {
  padding: 1rem;
  box-shadow:
    0 0.5px 1.5px 0 rgba(0, 0, 0, 0.1),
    0 0.5px 1px 0 rgba(0, 0, 0, 0.06);
  background: var(--background-default-grey);

  a {
    &:before {
      content: none;
    }
  }
}

.fr-btn {
  flex-direction: row;
}

hr {
  color: gray;
  border-style: inset;
  border-width: 1px;
  margin: 0.5em auto;
}
</style>
