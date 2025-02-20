<template>
  <ProfileContainer :step="1">
    <TenantInformationForm></TenantInformationForm>
  </ProfileContainer>
</template>

<script setup lang="ts">
import TenantInformationForm from '../components/TenantInformationForm.vue'
import ProfileContainer from '../components/ProfileContainer.vue'
</script>
