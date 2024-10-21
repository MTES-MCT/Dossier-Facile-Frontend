<!-- eslint-disable max-len -->
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import ovoidSprite from '@gouvfr/dsfr/dist/artwork/background/ovoid.svg'
import technicalErrorSprite from '@gouvfr/dsfr/dist/artwork/pictograms/system/technical-error.svg'

const { t } = useI18n()
</script>

<template>
  <div class="fr-container">
    <div
      class="fr-my-7w fr-mt-md-12w fr-mb-md-10w fr-grid-row fr-grid-row--gutters fr-grid-row--middle fr-grid-row--center"
    >
      <div class="fr-py-0 fr-col-12 fr-col-md-6">
        <h1>{{ t('404.title') }}</h1>
        <p class="fr-text--sm fr-mb-3w">{{ t('404.subtitle') }}</p>
        <p class="fr-text--lead fr-mb-3w">{{ t('404.caption') }}</p>
        <p class="fr-text--sm fr-mb-5w">
          {{ t('404.content.line1') }}<br />
          {{ t('404.content.line2') }}<br />
          {{ t('404.content.line3') }}
        </p>
        <ul class="fr-btns-group fr-btns-group--inline-md">
          <li>
            <a class="fr-btn" href="/">
              {{ t('404.homepage') }}
            </a>
          </li>
          <li>
            <a class="fr-btn fr-btn--secondary" href="/contact">
              {{ t('404.contact-us') }}
            </a>
          </li>
        </ul>
      </div>
      <div class="fr-col-12 fr-col-md-3 fr-col-offset-md-1 fr-px-6w fr-px-md-0 fr-py-0">
        <svg
          aria-label="Fond ecran"
          xmlns="http://www.w3.org/2000/svg"
          class="fr-responsive-img fr-artwork"
          aria-hidden="true"
          width="160"
          height="200"
          viewBox="0 0 160 200"
        >
          <use class="fr-artwork-motif" :href="ovoidSprite + '#artwork-motif'"></use>
          <use class="fr-artwork-background" :href="ovoidSprite + '#artwork-background'"></use>
          <g transform="translate(40, 60)">
            <use
              class="fr-artwork-decorative"
              :href="technicalErrorSprite + '#artwork-decorative'"
            ></use>
            <use class="fr-artwork-minor" :href="technicalErrorSprite + '#artwork-minor'"></use>
            <use class="fr-artwork-major" :href="technicalErrorSprite + '#artwork-major'"></use>
          </g>
        </svg>
      </div>
    </div>
  </div>
</template>
