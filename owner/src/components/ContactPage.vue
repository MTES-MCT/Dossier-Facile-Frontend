<template>
  <ContactForm :user="user" />
</template>

<script setup lang="ts">
import ContactForm from 'df-shared-next/src/components/ContactForm.vue';
import useOwnerStore from '../store/owner-store';

const store = useOwnerStore();
const user = store.getUser;
</script>

<style scoped lang="scss"></style>
