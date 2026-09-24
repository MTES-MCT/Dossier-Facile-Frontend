<template>
  <DsfrAlert
    :type="isVerified ? 'success' : 'info'"
    :title="t(isVerified ? 'title-verified' : 'title-unverified')"
    class="bg-white"
  >
    <ul class="status-lines fr-mb-0 fr-mt-1w" role="list">
      <li class="status-line">
        <RiCheckboxCircleLine aria-hidden="true" size="18" class="status-line-icon" />
        <span v-safe-html="t(isVerified ? 'documents-verified' : 'documents-unverified')" />
      </li>
      <li class="status-line">
        <RiShieldCheckLine v-if="isVerified" aria-hidden="true" size="18" class="status-line-icon" />
        <RiEyeOffLine v-else aria-hidden="true" size="18" class="status-line-icon" />
        <span v-safe-html="t(isVerified ? 'review-verified' : 'review-unverified')" />
      </li>
    </ul>
  </DsfrAlert>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { DsfrAlert } from '@gouvminint/vue-dsfr'
import { RiCheckboxCircleLine, RiEyeOffLine, RiShieldCheckLine } from '@remixicon/vue'

const props = defineProps<{
  dossierStatus: 'VALIDATED' | 'COMPLETED' | 'TO_PROCESS'
}>()

const { t } = useI18n()

const isVerified = computed(() => props.dossierStatus === 'VALIDATED')
</script>

<style scoped lang="scss">
.status-lines {
  list-style: none;
  padding: 0;
}

.status-line {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding-bottom: 0.25rem;
}

.status-line-icon {
  flex-shrink: 0;
  margin-top: 3px;
}

.bg-white {
  background-color: var(--background-default-grey);
}
</style>

<i18n>
{
  "fr": {
    "title-unverified": "Dossier complet",
    "documents-unverified": "Dossier complété : les pièces attendues sont présentes.",
    "review-unverified": "Les pièces <strong>n'ont pas été examinées par un agent</strong> : prenez le temps de les consulter.",
    "title-verified": "Dossier complet et vérifié",
    "documents-verified": "Toutes les pièces attendues sont présentes.",
    "review-verified": "Les pièces <strong>ont été examinées par nos agents</strong>."
  },
  "en": {
    "title-unverified": "Complete file",
    "documents-unverified": "File completed: all expected documents are present.",
    "review-unverified": "The documents <strong>have not been reviewed by an agent</strong>: take the time to check them.",
    "title-verified": "Complete and verified file",
    "documents-verified": "All expected documents are present.",
    "review-verified": "The documents <strong>have been reviewed by our agents</strong>."
  }
}
</i18n>
