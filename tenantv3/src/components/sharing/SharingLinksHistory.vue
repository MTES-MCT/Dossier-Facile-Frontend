<template>
  <NakedCard id="sharing-history" class="fr-p-3w">
    <h2 class="fr-h3">{{ t('title') }}</h2>
    <p>{{ t('consult-sharing-links') }}</p>
    <p class="bold fr-mb-1w">{{ t('active-shares-count', [links.length]) }}</p>
    <hr />
    <form class="fr-grid-col" @submit.prevent="deleteLinks">
      <ul class="share-list">
        <li v-for="link of links" :key="link.id" class="share-item">
          <ActiveShare v-slot="{ id }" :link class="flex--1">
            <input
              :id
              v-model="selectedLinks"
              :value="link.id"
              type="checkbox"
              name="selected"
              class="checkbox"
            />
          </ActiveShare>
        </li>
      </ul>
      <DfButton ref="delete-btn" class="fr-ml-auto" tertiary :disabled="selectedLinks.length === 0"
        >{{ t('delete-selection') }}
        <RiDeleteBin6Line aria-hidden="true" size="1rem" class="fr-ml-1v" />
      </DfButton>
    </form>
    <hr class="fr-mt-3w" />
    <h3 class="fr-h5">{{ t('suspend-access') }}</h3>
    <p>{{ t('suspend-all') }}</p>
    <form class="display--flex" @submit.prevent="toggleLinks">
      <DfButton ref="toggle-btn" class="fr-mx-auto"
        >{{ allLinksPaused ? t('enable-all') : t('pause-all') }}
        <RiPauseCircleLine aria-hidden="true" size="1rem" class="fr-ml-1w" />
      </DfButton>
    </form>
  </NakedCard>
</template>

<script setup lang="ts">
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import type { ApartmentSharingLink } from 'df-shared-next/src/models/ApartmentSharingLink'
import { useI18n } from 'vue-i18n'
import ActiveShare from './ActiveShare.vue'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import { RiDeleteBin6Line, RiPauseCircleLine } from '@remixicon/vue'
import { computed, ref, useTemplateRef } from 'vue'
import { ApartmentSharingLinkService } from '@/services/ApartmentSharingLinkService'
import { toast } from '../toast/toastUtils'

const { links } = defineProps<{ links: ApartmentSharingLink[] }>()
const emit = defineEmits<{ refresh: [] }>()

const { t } = useI18n()
const selectedLinks = ref([])
const deleteButton = useTemplateRef('delete-btn')
const toggleButton = useTemplateRef('toggle-btn')

const allLinksPaused = computed(() => links.every((link) => !link.enabled))

async function deleteLinks() {
  try {
    await ApartmentSharingLinkService.deleteLinks(selectedLinks.value)
    selectedLinks.value = []
    emit('refresh')
    toast.success(t('delete-links-success'), deleteButton.value?.button)
  } catch (error) {
    console.error(error)
    toast.error(t('error'), deleteButton.value?.button)
  }
}

async function toggleLinks() {
  const enable = allLinksPaused.value
  const method = allLinksPaused.value ? 'enableAllLinks' : 'disableAllLinks'
  try {
    await ApartmentSharingLinkService[method]()
    emit('refresh')
    toast.success(enable ? t('reactivate-success') : t('pause-success'), toggleButton.value?.button)
  } catch (error) {
    console.error(error)
    toast.error(t('error'), toggleButton.value?.button)
  }
}
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0;
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
    "pause-all": "Pause all sharing",
    "enable-all": "Reactivate your sharing links",
    "delete-links-success": "The shares have been successfully deleted",
    "pause-success": "File paused - sharing links are temporarily disabled.",
    "reactivate-success": "Sharing links have been reactivated."
  },
  "fr": {
    "title": "Activité de vos partages",
    "consult-sharing-links": "Consultez l’historique d’activité de vos partages : accédez aux détails des consultations, téléchargements ou mises en pause de votre dossier.",
    "active-shares-count": "Nombre total de partages actifs : {0}",
    "delete-selection": "Supprimer la sélection",
    "suspend-access": "Suspendre temporairement l’accès à votre dossier",
    "suspend-all": "Tous vos partages seront suspendus. Les personnes disposant d’un lien n’y auront plus accès tant que vous n’aurez pas réactivé le partage.",
    "pause-all": "Mettre en pause tous les partages",
    "enable-all": "Réactiver vos liens de partage",
    "delete-links-success": "Les partages ont bien été supprimés",
    "pause-success": "Dossier en pause - les liens de partage sont temporairement désactivés.",
    "reactivate-success": "Les liens de partages ont été réactivés."
  }
}
</i18n>
