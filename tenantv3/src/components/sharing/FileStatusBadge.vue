<template>
  <div v-if="status" class="fr-badge fr-badge--sm" :class="status.toLowerCase()">
    <StatusIcon :status warn />
    {{ label }}
  </div>
</template>

<script setup lang="ts">
import StatusIcon from 'df-shared-next/src/components/StatusIcon.vue'
import type { TenantFileStatus } from 'df-shared-next/src/models/TenantFileStatus'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { status } = defineProps<{ status: TenantFileStatus | undefined }>()
const { t } = useI18n()
const label = computed(() => (status ? t(status) : ''))
</script>

<style scoped>
.fr-badge.validated {
  background-color: #f3faf7;
  color: #466964;
}

.fr-badge.to_process {
  background-color: #fef3fd;
  color: var(--purple-text);
}

.fr-badge.declined {
  background-color: #ffe9e6;
  color: #ce0500;
}

.fr-badge.incomplete {
  background-color: #ececff;
  color: #000091;
}
</style>

<i18n>
{
  "en": {
    "VALIDATED": "File validated",
    "DECLINED": "Rejected file",
    "ARCHIVED": "File archived",
    "INCOMPLETE": "Incomplete file",
    "TO_PROCESS": "File currently being processed"
  },
  "fr": {
    "VALIDATED": "Dossier validé",
    "DECLINED": "Dossier refusé",
    "ARCHIVED": "Dossier archivé",
    "INCOMPLETE": "Dossier incomplet",
    "TO_PROCESS": "Dossier en cours de traitement"
  }
}
</i18n>
