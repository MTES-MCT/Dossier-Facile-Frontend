<template>
  <div class="fakeannouncement">
    <div class="title">
      <div class="title-content">
        <img alt="" src="../assets/logo_bouclier_secure.svg" />
        <h2 class="fr-h6">
          {{ t('fakeannouncement.fake-announce-title') }}
        </h2>
      </div>
      <img alt="Police nationale" src="../assets/police_nationale.svg" class="logo-police" />
    </div>

    <div class="announcement-container fr-mt-2v">
      <div class="announcement-text">
        <p>
          <i18n-t keypath="fakeannouncement.content">
            <template #nodocument>
              <span style="font-weight: bold">{{ t('fakeannouncement.nodocument') }}</span>
            </template>
            <template #masecurite>
              <a
                href="https://www.masecurite.interieur.gouv.fr/fr"
                rel="noopener"
                :title="t('fakeannouncement.link-title')"
                target="_blank"
                >{{ t('fakeannouncement.masecurite') }}</a
              >
            </template>
          </i18n-t>
        </p>
        <a
          class="fr-btn fr-btn--secondary fr-mr-3w"
          target="_blank"
          href="https://www.service-public.fr/particuliers/vosdroits/N31138#2"
          :title="`${t('fakeannouncement.signal-button')} - ${t('new-window')}`"
          @click="AnalyticsService.openMaSecurite()"
          >{{ t('fakeannouncement.signal-button') }}</a
        >
      </div>
      <div class="announce-card">
        <img alt="" src="../assets/carte_annonce.svg" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AnalyticsService } from '@/services/AnalyticsService'
import { I18nT, useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped lang="scss">
.fakeannouncement {
  --title-spacing: 0 0 0.5rem;
  padding: 2rem;
  border-radius: 4px;
  border: solid 0.5px var(--blue-cb);
  background-color: #e8edff;
  position: relative;
}

.title,
.title-content {
  display: flex;
  gap: 10px;
  justify-content: space-between;
  align-items: center;
}
.title-content {
  flex-wrap: nowrap;
  justify-content: start;

  h2 {
    color: var(--primary);
  }
}

.announcement-container {
  display: flex;
}

.announce-card {
  @media all and (max-width: 767px) {
    display: none;
  }
  img {
    min-width: 410px;
    @media all and (max-width: 1024px) {
      min-width: 300px;
    }
  }
}

.announcement-text {
  @media all and (min-width: 768px) {
    padding-right: 2rem;
  }
}
</style>
