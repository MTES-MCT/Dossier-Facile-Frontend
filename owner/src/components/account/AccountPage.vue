<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import NameInformationForm from './NameInformationForm.vue'

const { t } = useI18n()
</script>

<template>
  <div class="name-container fr-container fr-container-full-size bg--grey fr-grid-row">
    <div class="fr-col-xs-12 fr-col-md-4 bg--dark-blue">
      <div class="title-container">
        <h1 class="fr-h2">{{ t('account.title') }}</h1>
        <p class="fr-h5">{{ t('account.subtitle') }}</p>
      </div>
    </div>
    <div class="fr-col-md-8 fr-col-xs-12 fr-grid-row fr-grid-row--center d-p-200">
      <div class="fr-col-xs-12 fr-col-md-10 max-600">
        <NameInformationForm></NameInformationForm>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
h1,
p {
  color: var(--text-inverted-grey);
}
.title-container {
  padding: 1.5rem;
  @media all and (min-width: 768px) {
    padding-top: 200px;
    padding-left: 1.5rem;
    padding-right: 1rem;
  }
}

.name-container {
  @media all and (min-width: 768px) {
    min-height: 100%;
  }
}

.d-p-200 {
  @media all and (min-width: 768px) {
    display: flex;
    flex-direction: column;
    align-content: center;
    padding-left: 4rem;
    padding-right: 4rem;
  }
}
</style>
