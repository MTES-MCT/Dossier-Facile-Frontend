<template>
  <ProfileContainer :step="3">
    <GuarantorChoice></GuarantorChoice>
  </ProfileContainer>
</template>

<script setup lang="ts">
import GuarantorChoice from '../components/GuarantorChoice.vue'
import ProfileContainer from '../components/ProfileContainer.vue'

</script>

<style lang="scss" scoped>
h4 {
  margin: 0;
}
</style>
