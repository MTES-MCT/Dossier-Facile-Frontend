<template>
  <div>
    <p v-html="$t('roommatesinformationhelp.paragraph1')"></p>
    <p v-html="$t('roommatesinformationhelp.paragraph2')"></p>
    <p v-html="$t('roommatesinformationhelp.paragraph3')"></p>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
p {
  overflow-wrap: break-word;
  word-wrap: break-word;
}
</style>
