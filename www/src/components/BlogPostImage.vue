<template>
  <img :src :alt width="800" height="450" />
</template>

<script lang="ts" setup>
interface Props {
  src: string
  alt?: string
}

const { alt = '' } = defineProps<Props>()
</script>

<style scoped>
img {
  margin-block: 1rem;
  max-inline-size: 800px;
  max-block-size: 450px;
  object-fit: cover;
}
</style>
