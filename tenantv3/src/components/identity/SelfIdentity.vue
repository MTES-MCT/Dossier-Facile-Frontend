<template>
  <IdentityBackLinkRow
    :label="t('self-identity')"
    :disabled="isBacklinkRowDisabled"
    @click="AnalyticsService.tenantIdentityModifySelf()"
  />
  <IdentityForm text-key="self" />
</template>

<script setup lang="ts">
import { AnalyticsService } from '@/services/AnalyticsService'
import { useI18n } from 'vue-i18n'
import IdentityForm from './IdentityForm.vue'
import IdentityBackLinkRow from './lib/IdentityBackLinkRow.vue'
import { useTenantStore } from '@/stores/tenant-store'
import { computed } from 'vue'

const store = useTenantStore()

const isBacklinkRowDisabled = computed(() => store.user.tenantType !== 'CREATE')

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
