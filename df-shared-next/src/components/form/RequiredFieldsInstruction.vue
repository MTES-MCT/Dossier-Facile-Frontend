<template>
  <small>
    <i18n-t keypath="instruction">
      <template #asterix>
        <span style="color: red">*</span>
      </template>
    </i18n-t>
  </small>
</template>

<script setup lang="ts">
import { I18nT, useI18n } from 'vue-i18n'
useI18n()
</script>

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
