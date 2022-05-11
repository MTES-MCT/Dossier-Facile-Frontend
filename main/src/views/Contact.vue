<template>
  <ContactForm />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ContactForm from "df-shared/src/components/ContactForm.vue";

@Component({
  components: {
    ContactForm
  }
})
export default class Contact extends Vue {}
</script>

<style scoped lang="scss">
</style>
