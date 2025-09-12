<template>
  <div class="caf-box fr-px-md-5w fr-pb-md-2w fr-mb-3w bg-purple">
    <div class="header fr-h6">
      <div class="header-title">
        {{ t('simulationcaf.simulation-caf-title') }}
      </div>
      <img alt="Allocations Familiales" class="logo-caf" src="../../../assets/caf.svg" />
    </div>
    <p class="fr-mb-0">{{ t('simulationcaf.simulation-caf-text') }}</p>
    <div class="body-btn-container">
      <a
        class="fr-btn fr-btn--secondary fr-ml-auto fr-mt-2w"
        href="https://wwwd.caf.fr/wps/portal/caffr/aidesetdemarches/mesdemarches/faireunesimulation/lelogement#/preparation"
        :title="`${t('simulationcaf.btn-caf')} - ${t('new-window')}`"
        target="_blank"
        @click="AnalyticsService.openSimulationCAF()"
      >
        {{ t('simulationcaf.btn-caf') }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { AnalyticsService } from '../../../services/AnalyticsService'

const { t } = useI18n()
</script>

<style lang="scss" scoped>
.header {
  display: inline-flex;
  width: 100%;
  .header-title {
    padding-top: 0.5rem;
  }
  .logo-caf {
    margin-left: auto;
  }
}

.body-btn-container {
  display: inline-flex;
  width: 100%;
}
</style>
