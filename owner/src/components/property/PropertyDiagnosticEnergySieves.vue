<template>
      <div class="fr-background-contrast--blue-france fr-mt-3w fr-p-3w desktop" v-if="getForbiddenDate()">
        <div class="title-icon-container">
          <h2 class="fr-h6">{{ t("propertydiagnostic.details.title") }}</h2>
          <img alt="France Renov" src="../../assets/FranceRenov.svg" class="france_renov" />
        </div>
        <p>{{ t("propertydiagnostic.details.subtitle", [letter]) }}</p>
        <ul>
          <li v-html="t('propertydiagnostic.details.list1')"></li>
          <li v-html="t('propertydiagnostic.details.list2')"></li>
          <li v-html="t('propertydiagnostic.details.list3', [getForbiddenDate()])"></li>
        </ul>
        <h3 class="fr-h6">{{ t("propertydiagnostic.details.france-renov-title") }}</h3>
        <p v-html="t('propertydiagnostic.details.france-renov-text1')"></p>
        <p v-html="t('propertydiagnostic.details.france-renov-text2')"></p>
        <div class="text-align--right">
          <a class="fr-btn fr-btn--secondary" href="#" @click="redirectFranceRenov">{{
            t("propertydiagnostic.details.contact-france-renov") }}</a>
        </div>
      </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import AnalyticsService from '../../services/AnalyticsService';

const { t } = useI18n();

const props = defineProps<{
  letter: string
}>();

function getForbiddenDate() {
  switch (props.letter) {
    case 'G': return '1er janvier 2025';
    case 'F': return '1er janvier 2028';
    case 'E': return '1er janvier 2034';
    default: return null;
  }
}

function redirectFranceRenov() {
  AnalyticsService.dpeEvent('dpe_contact_FranceRenov');
  window.open(
    'https://france-renov.gouv.fr/espaces-conseil-fr?utm_source=dossierfacile&utm_medium=display&utm_campaign=dossierfacile ',
    '_blank',
    'noopener',
  );
}

</script>
