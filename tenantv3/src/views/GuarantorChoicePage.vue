<template>
  <ProfileContainer :step="3">
    <GuarantorChoice></GuarantorChoice>
  </ProfileContainer>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import GuarantorChoice from '../components/GuarantorChoice.vue'
import ProfileContainer from '../components/ProfileContainer.vue'

onMounted(() => {
  window.Beacon('init', 'e9f4da7d-11be-4b40-9514-ac7ce3e68f67')
})

onBeforeUnmount(() => {
  window.Beacon('destroy')
})
</script>

<style lang="scss" scoped>
h4 {
  margin: 0;
}
</style>
