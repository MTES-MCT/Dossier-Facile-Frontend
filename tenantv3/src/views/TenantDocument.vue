<template>
  <ProfileContainer :step="2">
    <div class="fr-mb-15w">
      <RouterView />
    </div>
  </ProfileContainer>
</template>

<script setup lang="ts">
import ProfileContainer from '@/components/ProfileContainer.vue'
</script>
