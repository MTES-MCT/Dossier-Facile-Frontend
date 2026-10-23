<template>
  <NakedCard id="sharing-history" class="fr-p-3w">
    <h2 class="fr-h3">{{ t('title') }}</h2>
    <p>{{ t('consult-sharing-links') }}</p>
    <hr />
    <form class="fr-grid-col" @submit.prevent="openDeleteModal">
      <fieldset class="share-list">
        <legend ref="share-legend" class="bold fr-mb-1w" tabindex="-1">
          {{ t('active-shares-count', [links.length]) }}
        </legend>
        <template v-for="link of links" :key="link.id">
          <ActiveShare v-slot="{ id }" :link class="flex--1" @refresh="emit('refresh')">
            <input
              :id
              v-model="selectedLinks"
              :value="link.id"
              type="checkbox"
              name="selected"
              class="checkbox"
            />
          </ActiveShare>
        </template>
      </fieldset>
      <DsfrButton
        ref="delete-btn"
        class="fr-ml-auto"
        type="submit"
        :label="t('delete-selection')"
        tertiary
        icon="fr-icon-delete-bin-line"
        icon-right
        :disabled="selectedLinks.length === 0"
      />
    </form>

    <DsfrModalPatch
      v-model:is-opened="isMultiDeleteModalOpen"
      :title="t('delete-confirmation-title')"
      :actions="modalActions"
      size="xl"
    >
      <p>{{ t('delete-confirmation-message', [selectedLinks.length]) }}</p>
    </DsfrModalPatch>

    <hr class="fr-mt-3w" />
    <h3 class="fr-h5">{{ t('suspend-access') }}</h3>
    <p>{{ t('suspend-all') }}</p>

    <DsfrButton
      ref="toggle-btn"
      class="fr-mx-auto"
      type="submit"
      :label="allLinksPaused ? t('enable-all') : t('pause-all')"
      secondary
      :icon="allLinksPaused ? 'fr-icon-play-circle-line' : 'fr-icon-pause-circle-line'"
      icon-right
      @click="toggleLinks"
    />
  </NakedCard>
</template>

<script setup lang="ts">
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import type { ApartmentSharingLink } from 'df-shared-next/src/models/ApartmentSharingLink'
import { useI18n } from 'vue-i18n'
import ActiveShare from './ActiveShare.vue'
import { computed, nextTick, provide, ref, useTemplateRef, type ComputedRef } from 'vue'
import { ApartmentSharingLinkService } from '@/services/ApartmentSharingLinkService'
import { AnalyticsService } from '@/services/AnalyticsService'
import { toast } from '../toast/toastUtils'
import DsfrModalPatch from 'df-shared-next/src/components/patches/DsfrModalPatch.vue'
import type { DsfrButtonProps } from '@gouvminint/vue-dsfr'
import { DsfrButton } from '@gouvminint/vue-dsfr'
import { FocusLegendKey } from '@/models/InjectionKeys'

const { links } = defineProps<{ links: ApartmentSharingLink[] }>()
const emit = defineEmits<{ refresh: [] }>()

const { t } = useI18n()
const selectedLinks = ref([])
const deleteButton = useTemplateRef('delete-btn')
const toggleButton = useTemplateRef('toggle-btn')
const shareLegend = useTemplateRef<HTMLLegendElement>('share-legend')

const isMultiDeleteModalOpen = ref(false)
const modalActions: ComputedRef<DsfrButtonProps[]> = computed(() => [
  {
    label: t('cancel'),
    secondary: true,
    onClick() {
      isMultiDeleteModalOpen.value = false
    }
  },
  {
    label: t('confirm-delete'),
    onClick() {
      confirmDelete()
    }
  }
])

const allLinksPaused = computed(() => links.every((link) => !link.enabled))

function openDeleteModal() {
  isMultiDeleteModalOpen.value = true
}

async function confirmDelete() {
  try {
    await ApartmentSharingLinkService.deleteLinks(selectedLinks.value)
    selectedLinks.value = []
    emit('refresh')
    toast.success(t('delete-links-success'), deleteButton.value?.$el)
  } catch (error) {
    console.error(error)
    toast.error(t('error'), deleteButton.value?.$el)
  } finally {
    isMultiDeleteModalOpen.value = false
    setFocusLegend()
  }
}

async function toggleLinks() {
  const enable = allLinksPaused.value
  AnalyticsService.sharingToggleAllLinks(enable ? 'enable' : 'disable')

  const method = enable ? 'enableAllLinks' : 'disableAllLinks'
  try {
    await ApartmentSharingLinkService[method]()
    emit('refresh')
    toast.success(enable ? t('reactivate-success') : t('pause-success'), toggleButton.value?.$el)
  } catch (error) {
    console.error(error)
    toast.error(t('error'), toggleButton.value?.$el)
  }
}

const setFocusLegend = async () => {
  await nextTick()
  shareLegend.value?.focus()
}
provide(FocusLegendKey, setFocusLegend)
</script>

<style scoped>
.share-list {
  list-style: none;
  padding: 0;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 0;
}

.checkbox {
  height: 1rem;
  width: 1rem;
}
</style>

<i18n lang="json">
{
  "en": {
    "title": "Your sharing activity",
    "consult-sharing-links": "View your sharing activity history: access details about consultations, downloads, or pauses in your file",
    "active-shares-count": "Total number of active shares: {0}",
    "delete-selection": "Delete selection",
    "suspend-access": "Temporarily suspend access to your file",
    "suspend-all": "All your shares will be suspended. People with a link will no longer have access to them until you reactivate sharing.",
    "pause-all": "Pause all sharing",
    "enable-all": "Reactivate your sharing links",
    "delete-links-success": "The shares have been successfully deleted",
    "pause-success": "File paused - sharing links are temporarily disabled.",
    "reactivate-success": "Sharing links have been reactivated.",
    "delete-confirmation-title": "Delete confirmation",
    "delete-confirmation-message": "Are you sure you want to delete {0} share(s)?",
    "cancel": "Cancel",
    "confirm-delete": "Delete"
  },
  "fr": {
    "title": "Activité de vos partages",
    "consult-sharing-links": "Consultez l'historique d'activité de vos partages : accédez aux détails des consultations, téléchargements ou mises en pause de votre dossier.",
    "active-shares-count": "Nombre total de partages actifs: {0}",
    "delete-selection": "Supprimer la sélection",
    "suspend-access": "Suspendre temporairement l'accès à votre dossier",
    "suspend-all": "Tous vos partages seront suspendus. Les personnes disposant d'un lien n'y auront plus accès tant que vous n'aurez pas réactivé le partage.",
    "pause-all": "Mettre en pause tous les partages",
    "enable-all": "Réactiver vos liens de partage",
    "delete-links-success": "Les partages ont bien été supprimés",
    "pause-success": "Dossier en pause - les liens de partage sont temporairement désactivés.",
    "reactivate-success": "Les liens de partages ont été réactivés.",
    "delete-confirmation-title": "Confirmation de suppression",
    "delete-confirmation-message": "Êtes-vous sûr de vouloir supprimer {0} partage(s) ?",
    "cancel": "Annuler",
    "confirm-delete": "Supprimer"
  }
}
</i18n>
