<template>
  <div class="wrapper">
    <div class="owner-banner-bg text--white">
      <img class="men" aria-hidden="true" alt="Homme debout" src="../assets/owner/Homme.svg" />
      <div class="main">
        <h2 class="fr-h6 text--white">
          {{ t('ownerbanner.title1') }}<br />{{ t('ownerbanner.title2') }}
        </h2>
        <p class=""></p>
        <ul>
          <li>{{ t('ownerbanner.text1') }}</li>
          <li>{{ t('ownerbanner.text2') }}</li>
          <li>{{ t('ownerbanner.text3') }}</li>
        </ul>
        <a
          class="fr-btn dark"
          :href="OWNER_URL"
          :title="`${t('ownerbanner.btn')} - ${t('new-window')}`"
          target="_blank"
          @click="AnalyticsService.openCreateOwnerAccount()"
          >{{ t('ownerbanner.btn') }}</a
        >
      </div>
      <img class="tenant" aria-hidden="true" alt="Locataire" src="../assets/owner/Locataire.svg" />
      <img
        class="dog"
        aria-hidden="true"
        alt="Chien de compagnie"
        src="../assets/owner/Chien.svg"
        width="154px"
        height="169px"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { AnalyticsService } from '@/services/AnalyticsService'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const OWNER_URL = `//${import.meta.env.VITE_OWNER_URL}/creation`
</script>

<style scoped lang="scss">
.owner-banner-bg {
  background-color: #1b1b35;
  border-radius: 0.5rem;
  display: flex;
}

.main {
  flex: 1;
  padding: 2rem;

  @media all and (max-width: 768px) {
    padding: 1rem;
  }
}

.wrapper {
  overflow: hidden;
  margin-left: -30px;
  padding-left: 30px;
  margin-right: -30px;
  padding-right: 30px;
}

.men {
  margin-left: -30px;
  height: 250px;
  width: 96px;
  align-self: flex-end;
  margin-bottom: -30px;

  @media all and (max-width: 768px) {
    margin-left: -60px;
  }
}

.tenant {
  height: 350px;
  width: 235px;
  align-self: flex-end;
  margin-bottom: -115px;

  @media all and (max-width: 990px) {
    display: none;
  }
}

.dog {
  align-self: flex-end;
  margin-right: -40px;
  margin-bottom: -29px;

  @media all and (max-width: 990px) {
    display: none;
  }
}

.text--white {
  --text-title-grey: white;
}

ul {
  list-style-type: none;
  padding-inline-start: 0;
}

@media all and (min-width: 990px) {
  ul li {
    display: inline;

    &:not(:first-child) {
      &:before {
        content: ' · ';
      }
    }
  }
}
</style>
