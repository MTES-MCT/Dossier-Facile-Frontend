<template>
  <div class="bg-blue">
    <div class="fr-container">
      <Breadcrumb :currentPage="t('contact.title')"/>
      <ContactForm :user="user" profile="owner" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ContactForm from 'df-shared-next/src/components/ContactForm.vue';
import Breadcrumb from "df-shared-next/src/components/dsfr/Breadcrumb.vue";
import useOwnerStore from '../store/owner-store';
import { useI18n } from 'vue-i18n';

const store = useOwnerStore();
const user = store.getUser;
const { t } = useI18n();
</script>

<style scoped lang="scss"></style>
