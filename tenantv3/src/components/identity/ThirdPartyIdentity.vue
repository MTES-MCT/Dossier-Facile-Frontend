<template>
  <BackLinkRow :label="t('third-party-identity')" @click="onClick" />
  <IdentityForm text-key="third-party" />
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
    "third-party-identity": "For someone else"
  },
  "fr": {
    "third-party-identity": "Pour une autre personne"
  }
}
</i18n>
