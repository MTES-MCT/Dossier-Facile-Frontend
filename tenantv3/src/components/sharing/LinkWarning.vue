<template>
  <i18n-t tag="p" keypath="link-warning" class="blue-text fr-mb-0">
    <template #icon>
      <RiAlertLine aria-hidden="true" style="vertical-align: bottom" />
    </template>
    <template #access>
      <strong>{{ t('access-to-file') }}</strong>
    </template>
    <template #people-you-trust>
      <strong>{{ t('people-you-trust') }}</strong>
    </template>
  </i18n-t>
</template>

<script setup lang="ts">
import { RiAlertLine } from '@remixicon/vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<i18n>
{
  "en": {
    "access-to-file": "access to your file",
    "people-you-trust": "people you trust",
    "link-warning": "{icon} This link provides {access}. Only share it with {people-you-trust}."
  },
  "fr": {
    "access-to-file": "accès à votre dossier",
    "people-you-trust": "des personnes de confiance",
    "link-warning": "{icon} Ce lien donne {access}. Partagez-le uniquement avec {people-you-trust}."
  }
}
</i18n>
