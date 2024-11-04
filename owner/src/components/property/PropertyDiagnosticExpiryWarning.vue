<template>
  <div class="fr-alert fr-alert--error">
    <h2 class="fr-h6">
      {{ t('propertydiagnosticexpirywarning.expiry-title') }}
    </h2>
    <p>{{ t('propertydiagnosticexpirywarning.expiry-text-1') }}</p>
    <p>{{ t('propertydiagnosticexpirywarning.expiry-text-2') }}</p>
    <div class="text-align--right">
      <a
        target="_blank"
        rel="noopener noreferrer"
        @click="AnalyticsService.dpeEvent('dpe_know_more')"
        href="https://www.service-public.fr/particuliers/vosdroits/F16096"
        >{{ t('propertydiagnosticexpirywarning.know-more') }}</a
      >
      <a
        target="_blank"
        rel="noopener noreferrer"
        class="fr-btn fr-btn--secondary fr-ml-3w"
        @click="redirectFranceRenov"
        href="#"
        >{{ t('propertydiagnosticexpirywarning.find-inspector') }}</a
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AnalyticsService from '../../services/AnalyticsService'

const { t } = useI18n()

function redirectFranceRenov($event: Event) {
  AnalyticsService.dpeEvent('dpe_find_diagsnotic')
  window.open(
    'https://www.service-public.fr/particuliers/vosdroits/R57710?utm_source=dossierfacile&utm_medium=display&utm_campaign=dossierfacile ',
    '_blank',
    'noopener'
  )
  $event.preventDefault()
}
</script>
