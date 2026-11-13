<template>
  <i18n-t
    id="link-warning"
    tag="p"
    keypath="link-warning"
    class="blue-text fr-mb-0 fr-icon-alert-line"
  >
    <template #access>
      <strong>{{ t('access-to-file') }}</strong>
    </template>
    <template #people-you-trust>
      <strong>{{ t('people-you-trust') }}</strong>
    </template>
  </i18n-t>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "access-to-file": "access to your file",
    "people-you-trust": "people you trust",
    "link-warning": "This link provides {access}. Only share it with {people-you-trust}."
  },
  "fr": {
    "access-to-file": "accès à votre dossier",
    "people-you-trust": "des personnes de confiance",
    "link-warning": "Ce lien donne {access}. Partagez-le uniquement avec {people-you-trust}."
  }
}
</i18n>
