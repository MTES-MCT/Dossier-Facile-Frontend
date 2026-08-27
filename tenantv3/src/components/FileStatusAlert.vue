<template>
  <DsfrAlert :type="alertType" :title="t(`title-${dossierStatus}`)" class="bg-white">
    <ul class="status-lines fr-mb-0 fr-mt-1w" role="list">
      <li class="status-line">
        <RiCheckboxCircleLine aria-hidden="true" size="18" class="status-line-icon" />
        <span v-safe-html="t(`documents-${dossierStatus}`)" />
      </li>
      <li class="status-line">
        <RiEyeOffLine
          v-if="dossierStatus === 'COMPLETED'"
          aria-hidden="true"
          size="18"
          class="status-line-icon"
        />
        <RiShieldCheckLine v-else aria-hidden="true" size="18" class="status-line-icon" />
        <span v-safe-html="t(`review-${dossierStatus}`)" />
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
  dossierStatus: 'VALIDATED' | 'COMPLETED'
}>()

const { t } = useI18n()

const alertType = computed(() => (props.dossierStatus === 'COMPLETED' ? 'info' : 'success'))
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
    "title-COMPLETED": "Dossier complet",
    "documents-COMPLETED": "Dossier complété : les pièces attendues sont présentes.",
    "review-COMPLETED": "Les pièces <strong>n'ont pas été examinées par un agent</strong> : prenez le temps de les consulter.",
    "title-VALIDATED": "Dossier complet et vérifié",
    "documents-VALIDATED": "Toutes les pièces attendues sont présentes.",
    "review-VALIDATED": "Les pièces <strong>ont été examinées par nos agents</strong>."
  },
  "en": {
    "title-COMPLETED": "Complete file",
    "documents-COMPLETED": "File completed: all expected documents are present.",
    "review-COMPLETED": "The documents <strong>have not been reviewed by an agent</strong>: take the time to check them.",
    "title-VALIDATED": "Complete and verified file",
    "documents-VALIDATED": "All expected documents are present.",
    "review-VALIDATED": "The documents <strong>have been reviewed by our agents</strong>."
  }
}
</i18n>
