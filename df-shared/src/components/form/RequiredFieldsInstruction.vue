<template>
  <small>
    <i18n path="instruction">
      <template v-slot:asterix>
        <span style="color:red">*</span>
      </template>
    </i18n>
  </small>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class RequiredFieldsInstruction extends Vue {}
</script>

<style scoped lang="scss"></style>

<i18n>
{
  "en": {
    "instruction" : "Fields with {asterix} are required."
  },
  "fr": {
    "instruction" : "Les champs marqués d'un {asterix} sont obligatoires."
  }
}
</i18n>
