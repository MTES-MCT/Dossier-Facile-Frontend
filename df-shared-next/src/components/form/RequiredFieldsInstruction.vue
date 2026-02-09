<template>
  <p class="fr-text--sm">
    <span v-if="allRequired">{{ t('all') }}</span>
    <i18n-t v-else keypath="instruction">
      <template #asterix>
        <span class="color--required">*</span>
      </template>
    </i18n-t>
  </p>
</template>

<script setup lang="ts">
import { I18nT, useI18n } from 'vue-i18n'

interface Props {
  allRequired?: boolean
}

const { allRequired = false } = defineProps<Props>()

const { t } = useI18n()
</script>

<i18n>
{
  "en": {
    "instruction" : "Fields with {asterix} are required.",
		"all": "All fields are required."
  },
  "fr": {
    "instruction" : "Les champs marqués d'un {asterix} sont obligatoires.",
		"all": "Tous les champs sont obligatoires."
  }
}
</i18n>
