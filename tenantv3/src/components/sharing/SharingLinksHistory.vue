<template>
  <NakedCard id="sharing-history" class="fr-p-3w fr-grid-col">
    <h2 class="fr-h3">{{ t('title') }}</h2>
    <p>{{ t('consult-sharing-links') }}</p>
    <p class="bold fr-mb-1w">{{ t('active-shares-count', [links.length]) }}</p>
    <hr />
    <ul class="share-list">
      <li v-for="link of links" :key="link.id" class="share-item">
        <input type="checkbox" name="selected" class="checkbox" />
        <ActiveShare :link class="flex--1" />
      </li>
    </ul>
    <DfButton class="fr-ml-auto" tertiary disabled
      >{{ t('delete-selection') }}
      <RiDeleteBin6Line aria-hidden="true" size="1rem" class="fr-ml-1v" />
    </DfButton>
    <hr class="fr-mt-3w" />
    <h3 class="fr-h5">{{ t('suspend-access') }}</h3>
    <p>{{ t('suspend-all') }}</p>
    <DfButton class="fr-mx-auto"
      >{{ t('pause-all') }}
      <RiPauseCircleLine aria-hidden="true" size="1rem" class="fr-ml-1w" />
    </DfButton>
  </NakedCard>
</template>

<script setup lang="ts">
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import type { ApartmentSharingLink } from 'df-shared-next/src/models/ApartmentSharingLink'
import { useI18n } from 'vue-i18n'
import ActiveShare from './ActiveShare.vue'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import { RiDeleteBin6Line, RiPauseCircleLine } from '@remixicon/vue'

defineProps<{ links: ApartmentSharingLink[] }>()

const { t } = useI18n()
</script>

<style scoped>
.share-list {
  list-style: none;
  padding: 0;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.checkbox {
  height: 1rem;
  width: 1rem;
}

.share-item {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>

<i18n>
{
  "en": {
    "title": "Your sharing activity",
    "consult-sharing-links": "View your sharing activity history: access details about consultations, downloads, or pauses in your file",
    "active-share-count": "Total number of active shares: {0}",
    "delete-selection": "Delete selection",
    "suspend-access": "Temporarily suspend access to your file",
    "suspend-all": "All your shares will be suspended. People with a link will no longer have access to them until you reactivate sharing.",
    "pause-all": "Pause all sharing"
  },
  "fr": {
    "title": "Activité de vos partages",
    "consult-sharing-links": "Consultez l’historique d’activité de vos partages : accédez aux détails des consultations, téléchargements ou mises en pause de votre dossier.",
    "active-shares-count": "Nombre total de partages actifs : {0}",
    "delete-selection": "Supprimer la sélection",
    "suspend-access": "Suspendre temporairement l’accès à votre dossier",
    "suspend-all": "Tous vos partages seront suspendus. Les personnes disposant d’un lien n’y auront plus accès tant que vous n’aurez pas réactivé le partage.",
    "pause-all": "Mettre en pause tous les partages"
  }
}
</i18n>
