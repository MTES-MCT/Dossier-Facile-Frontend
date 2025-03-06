<template>
  <div class="card">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
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
</style>
