<template>
  <ContactForm />
</template>

<script setup lang="ts">
import ContactForm from "df-shared-next/src/components/ContactForm.vue";
import { useHead } from '@unhead/vue'

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