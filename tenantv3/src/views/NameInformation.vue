<template>
  <aside class="name-container fr-container fr-container-full-size bg--grey fr-grid-row">
    <div class="fr-col-xs-12 fr-col-md-4 bg--dark-blue">
      <div class="title-container">
        <h2 class="fr-h1">{{ t('nameinformation.title') }}</h2>
        <h3 class="fr-h5 fr-mb-1w text-bold">
          {{ t('nameinformation.prepare-documents') }}
        </h3>
        <ul>
          <li>{{ t('nameinformation.identification') }}</li>
          <li>{{ t('nameinformation.residency') }}</li>
          <li>{{ t('nameinformation.professional') }}</li>
          <li>{{ t('nameinformation.financial') }}</li>
          <li>{{ t('nameinformation.tax') }}</li>
        </ul>
        <p>
          <span class="text-bold">{{ t('nameinformation.same-for-guarantors') }}</span>
          <br />
          🧐
          <a href="https://aide.dossierfacile.logement.gouv.fr/fr/" target="_blank" rel="noopener">{{
            t('nameinformation.see-documentation')
          }}</a>
        </p>
      </div>
    </div>
    <div class="fr-col-md-8 fr-col-xs-12 fr-grid-row fr-grid-row--center d-p-200">
      <div class="fr-col-xs-12 fr-col-md-10 max-600">
        <NameInformationForm :user="user"></NameInformationForm>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import NameInformationForm from '../components/NameInformationForm.vue'
import useTenantStore from '@/stores/tenant-store'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useTenantStore()
const user = computed(() => {
  return store.user
})

</script>

<style lang="scss" scoped>
.fr-h5,
.fr-h1 {
  color: var(--text-inverted-grey);
}
.fr-h1 {
  font-size: 2rem !important;
}
.fr-h5 {
  font-size: 1.25rem !important;
}

.title-container {
  color: var(--text-inverted-grey);
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

li {
  list-style-type: '👉 ';
}
</style>
