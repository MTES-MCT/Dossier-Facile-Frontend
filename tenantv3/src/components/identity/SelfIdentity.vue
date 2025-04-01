<template>
  <IdentityBackLinkRow :label="t('self-identity')" />
  <IdentityForm text-key="self" />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import IdentityForm from './IdentityForm.vue'
import IdentityBackLinkRow from './lib/IdentityBackLinkRow.vue'

const { t } = useI18n()
</script>

<i18n>
{
  "en": {
    "self-identity": "For yourself"
  },
  "fr": {
    "self-identity": "Pour vous"
  }
}
</i18n>
