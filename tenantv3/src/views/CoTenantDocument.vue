<template>
  <ProfileContainer :step="step">
    <RouterView></RouterView>
  </ProfileContainer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ProfileContainer from '../components/ProfileContainer.vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const step = computed(() => Number(route.params.step) || 0)
</script>
