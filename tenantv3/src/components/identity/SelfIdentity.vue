<template>
  <BackLinkRow :label="t('self-identity')" @click="onClick" />
  <IdentityForm text-key="self" />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import BackLinkRow from '@/components/common/BackLinkRow.vue'
import { useRouter } from 'vue-router'
import IdentityForm from './IdentityForm.vue'
const { t } = useI18n()
const router = useRouter()

const onClick = () => {
  router.back()
}
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
