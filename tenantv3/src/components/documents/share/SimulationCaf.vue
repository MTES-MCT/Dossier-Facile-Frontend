<template>
  <div class="caf-box fr-px-md-5w fr-pb-md-2w fr-mb-3w bg-purple">
    <h2 class="fr-h6 fr-m-0">
      {{ t('simulationcaf.simulation-caf-title') }}
    </h2>
    <img alt="" class="logo-caf" width="132" height="43" src="../../../assets/caf.svg" />

    <p class="fr-mb-0">{{ t('simulationcaf.simulation-caf-text') }}</p>

    <a
      class="fr-btn fr-btn--secondary fr-ml-auto"
      href="https://wwwd.caf.fr/wps/portal/caffr/aidesetdemarches/mesdemarches/faireunesimulation/lelogement#/preparation"
      :title="`${t('simulationcaf.btn-caf')} - ${t('new-window')}`"
      target="_blank"
      @click="AnalyticsService.openSimulationCAF()"
    >
      {{ t('simulationcaf.btn-caf') }}
    </a>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { AnalyticsService } from '../../../services/AnalyticsService'

const { t } = useI18n()
</script>

<style scoped>
.caf-box {
  --gap-width: 1rem;
  --image-width: 132px;

  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

h2 {
  flex: 1 1 calc(100% - var(--gap-width) - var(--image-width));
  min-width: 16ch;
}
img {
  flex: 0 0 132px;
}
</style>
