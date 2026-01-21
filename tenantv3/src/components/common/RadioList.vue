<template>
  <ul role="list">
    <slot></slot>
  </ul>
</template>

<style scoped>
ul > :deep(li + li) {
  margin-block-start: 1rem;
}
</style>
