<template>
  <NakedCard class="fr-mt-2w">
    <div class="analysis-status">
      <RiHourglassFill size="24px" class="hourglass" aria-hidden="true" />
      <p class="fr-m-0">
        {{
          t('analysis-progress.status', {
            current: numberOfAnalysedDocuments,
            total: numberOfDocuments
          })
        }}
      </p>
    </div>
    <div class="progress-container fr-mt-2w">
      <div class="analysis-loading-progress-bar"></div>
    </div>
  </NakedCard>
</template>

<script setup lang="ts">
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { RiHourglassFill } from '@remixicon/vue'
import { useI18n } from 'vue-i18n'

defineProps<{
  numberOfDocuments: number
  numberOfAnalysedDocuments: number
}>()

const { t } = useI18n()
</script>

<style scoped lang="scss">
.progress-container {
  height: 8px;
  background-color: var(--background-contrast-grey);
  border-radius: 0;
  overflow: hidden;
}

.analysis-loading-progress-bar {
  height: 100%;
  width: 30%;
  background-color: var(--blue-france-sun-113-625);
  animation: indeterminate 1.5s infinite ease-in-out;
}

@keyframes indeterminate {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(433%);
  }
}

.analysis-status {
  display: flex;
  align-items: center;
}

.hourglass {
  color: var(--blue-france-sun-113-625);
  margin-right: 6px;
  flex-shrink: 0;
}
</style>

<i18n>
{
  "en": {
    "analysis-progress": {
      "status": "Analysis: {current}/{total} documents processed (less than 30 seconds remaining)"
    }
  },
  "fr": {
    "analysis-progress": {
      "status": "Analyse : {current}/{total} documents traités (moins de 30 secondes restantes)"
    }
  }
}
</i18n>
