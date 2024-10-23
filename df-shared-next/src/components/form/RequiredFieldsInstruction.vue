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
import { useI18n } from 'vue-i18n'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { t } = useI18n() // this is used by i18n-t, don't remove
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
