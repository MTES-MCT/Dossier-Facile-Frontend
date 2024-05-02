<template>
  <div class="bg-blue">
    <div class="fr-container">
      <Breadcrumb :currentPage="t('contact.title')"/>
      <ContactForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import ContactForm from "df-shared-next/src/components/ContactForm.vue";
import Breadcrumb from "df-shared-next/src/components/dsfr/Breadcrumb.vue";
import { useHead } from '@unhead/vue'
import { useI18n } from "vue-i18n";

const { t } = useI18n();

useHead({
      title: "Contactez-nous - DossierFacile",
  meta: [
    {
      name: 'description',
      content: "Formulaire de contact",
    },
  ],
})

</script>