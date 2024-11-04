<template>
  <ProfileContainer :step="2">
    <UploadDocuments :substep="getStep()"></UploadDocuments>
  </ProfileContainer>
</template>

<script setup lang="ts">
import UploadDocuments from '../components/UploadDocuments.vue'
import ProfileContainer from '../components/ProfileContainer.vue'
import { useRoute } from 'vue-router'
const route = useRoute()

function getStep() {
  return Number(route.params.substep) || 0
}
</script>

<style lang="scss" scoped>
h4 {
  margin: 0;
}
</style>
