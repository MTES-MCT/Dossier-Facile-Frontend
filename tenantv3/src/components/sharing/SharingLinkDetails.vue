<template>
  <div class="details">
    <div class="wrapper">
      <div class="section">
        <h3 class="fr-text--sm blue-text fr-mb-0">{{ t('general-info') }}</h3>
        <table class="table">
          <tbody>
            <tr :class="{ 'title-row-editing': isEditingTitle }">
              <td class="fr-text-mention--grey">{{ t('title-of-share') }}</td>
              <td class="title-cell">
                <div v-if="!isEditingTitle" class="title-display">
                  <span>{{ link.title }}</span>
                  <button type="button" class="link-button blue-text" :title="t('update-title')" @click="startEditingTitle">{{ t('update') }} <RiPencilLine aria-hidden="true" size="1em" /></button>
                </div>
                <div v-else class="title-edit">
                  <input
                    v-model="editedTitle"
                    type="text"
                    class="fr-input"
                    @keyup.enter="saveTitle"
                    @keyup.escape="cancelEditingTitle"
                  />
                  <div class="title-edit-buttons">
                    <button type="button" class="fr-btn fr-btn--tertiary fr-btn--sm" @click="saveTitle">{{ t('validate') }}</button>
                    <button type="button" class="fr-btn fr-btn--tertiary fr-btn--sm" @click="cancelEditingTitle">{{ t('cancel') }}</button>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td class="fr-text-mention--grey">{{ t('created-on') }}</td>
              <td>{{ formatDate(link.creationDate) }}</td>
            </tr>
            <tr>
              <td class="fr-text-mention--grey">{{ t('expires-on') }}</td>
              <td class="expiration-cell">
                <template v-if="!isEditingExpiration">
                  {{ formatDate(link.expirationDate) }}
                  <button type="button" class="link-button blue-text" @click="isEditingExpiration = true">{{ t('update') }} <RiPencilLine aria-hidden="true" size="1em" /></button>
                </template>
                <VueDatePicker
                  v-else
                  v-model="expirationDate"
                  :min-date="minDate"
                  :enable-time-picker="false"
                  :clearable="false"
                  model-type="yyyy-MM-dd"
                  auto-apply
                  :teleport="true"
                  @update:model-value="updateExpirationDate"
                  @closed="isEditingExpiration = false"
                >
                  <template #dp-input="{ value }">
                    <div class="dp-custom-input">
                      <RiCalendarLine aria-hidden="true" size="16px" />
                      <span>{{ formatDatePicker(value) }}</span>
                      <button type="button" class="dp-custom-input__close" @click.stop="isEditingExpiration = false" aria-label="Fermer">×</button>
                    </div>
                  </template>
                </VueDatePicker>
              </td>
            </tr>
            <tr>
              <td class="fr-text-mention--grey">{{ t('file-type') }}</td>
              <td>{{ link.fullData ? 'Avec justificatifs' : 'Sans justificatifs' }}</td>
            </tr>
            <tr>
              <td class="fr-text-mention--grey">{{ t('created-by') }}</td>
              <td>{{ link.createdBy || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="section">
        <h3 class="fr-text--sm blue-text fr-mb-0">{{ t('usage-stats') }}</h3>
        <table class="table">
          <tbody>
            <tr>
              <td class="fr-text-mention--grey">{{ t('first-consultation') }}</td>
              <td>{{ link.nbVisits > 0 ? formatDate(link.firstVisit) : t('no-consultation') }}</td>
            </tr>
            <tr>
              <td class="fr-text-mention--grey">{{ t('last-consultation') }}</td>
              <td>{{ link.nbVisits > 0 ? formatDate(link.lastVisit) : t('no-consultation') }}</td>
            </tr>
            <tr>
              <td class="fr-text-mention--grey">{{ t('nb-consultations') }}</td>
              <td>{{ link.nbVisits }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="info">
      <LinkWarning />
      <form class="display--flex align-items--center" @submit.prevent="pause">
        <p class="fr-mt-1w">TODO: lien</p>
        <DfButton ref="pause-btn" class="fr-ml-auto"
          >{{ link.enabled ? 'Mettre en pause' : 'Réactiver' }}
          <RiPauseCircleLine aria-hidden="true" size="1rem" class="fr-ml-1w" />
        </DfButton>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import type { ApartmentSharingLink } from 'df-shared-next/src/models/ApartmentSharingLink'
import LinkWarning from './LinkWarning.vue'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import { RiPauseCircleLine, RiCalendarLine, RiPencilLine } from '@remixicon/vue'
import { ApartmentSharingLinkService } from '@/services/ApartmentSharingLinkService'
import { toast } from '../toast/toastUtils'
import { useI18n } from 'vue-i18n'
import { ref, useTemplateRef } from 'vue'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const { link } = defineProps<{ link: ApartmentSharingLink }>()
const emit = defineEmits<{ refresh: [] }>()

const { t } = useI18n()
const pauseButton = useTemplateRef('pause-btn')

const isEditingExpiration = ref(false)
const expirationDate = ref(link.expirationDate.split('T')[0])

const isEditingTitle = ref(false)
const editedTitle = ref(link.title)

const formatDate = (date: string) => dayjs(date).format('D MMM YYYY')
const formatDatePicker = (date: Date | string) => dayjs(date).format('DD/MM/YYYY')

const minDate = new Date()
minDate.setDate(minDate.getDate() + 1)

async function pause() {
  try {
    await ApartmentSharingLinkService.updateLinkStatus(link, !link.enabled)
    emit('refresh')
  } catch (error) {
    console.error(error)
    toast.error(t('error'), pauseButton.value?.button)
  }
}

async function updateExpirationDate(date: string) {
  try {
    await ApartmentSharingLinkService.updateLinkExpiration(link, date)
    isEditingExpiration.value = false
    toast.success(t('expiration-updated'), null)
    emit('refresh')
  } catch (error) {
    console.error(error)
    toast.error(t('error'), null)
  }
}

function startEditingTitle() {
  editedTitle.value = link.title
  isEditingTitle.value = true
}

function cancelEditingTitle() {
  isEditingTitle.value = false
  editedTitle.value = link.title
}

async function saveTitle() {
  try {
    await ApartmentSharingLinkService.updateLinkTitle(link, editedTitle.value)
    isEditingTitle.value = false
    toast.success(t('title-updated'), null)
    emit('refresh')
  } catch (error) {
    console.error(error)
    toast.error(t('error'), null)
  }
}
</script>

<style scoped>
.details {
  border-radius: 0 0 4px 4px;
  padding: 10px 16px;
  background-color: #f6f6f6;
  display: flex;
  flex-direction: column;
}
.wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
.section {
  display: flex;
  flex-direction: column;
  flex: 1 0 20rem;
}
.table {
  display: flex;
  flex-direction: column;
  tr {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ddd;
    padding: 8px 0;
    td + td {
      flex: 1;
      text-align: right;
    }
  }
  tr.title-row-editing {
    align-items: flex-start;
    td:first-child {
      padding-top: 0.625rem;
    }
  }
}
.info {
  background-color: white;
  border-radius: 4px;
  padding: 8px;
}
h3 {
  border-bottom: 1px solid var(--blue-france-sun-113-625);
}
.expiration-cell {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
}
.expiration-cell :deep(.dp__main) {
  width: auto;
}
.expiration-cell :deep(.dp--clear-btn) {
  display: none;
}
.dp-custom-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}
.dp-custom-input__close {
  border: none;
  background: none;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  color: #666;
  padding: 0;
  margin-left: 4px;
}
.dp-custom-input__close:hover {
  color: #333;
}
.link-button {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  border: none;
  border-bottom: 1px solid currentColor;
  background: none;
  cursor: pointer;
  padding: 0;
  font-size: inherit;
}
.title-cell {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}
.title-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.title-edit {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}
.title-edit .fr-input {
  width: 280px;
  text-align: left;
}
.title-edit-buttons {
  display: flex;
  gap: 0.5rem;
}

@media (max-width: 767px) {
  .details {
    padding: 10px;
  }
  .section {
    flex: 1 0 100%;
    min-width: 0;
  }
  .title-edit .fr-input {
    width: 158px;
  }
  .table tr {
    flex-wrap: wrap;
  }
}
</style>

<i18n>
{
  "en": {
    "general-info":"General information",
    "title-of-share": "Title of the share",
    "update": "Update",
    "update-title": "Update the title",
    "validate": "Validate",
    "cancel": "Cancel",
    "created-on": "Created on",
    "expires-on": "Expires on",
    "file-type": "Type of file",
    "created-by": "Created by",
    "usage-stats": "Usage statistics",
    "first-consultation": "First consultation",
    "last-consultation": "Last consultation",
    "nb-consultations": "Number of consultations",
    "no-consultation": "No consultation",
    "expiration-updated": "Expiration date updated successfully",
    "title-updated": "Title updated successfully"
  },
  "fr": {
    "general-info":"Informations générales",
    "title-of-share": "Titre du partage",
    "update": "Modifier",
    "update-title": "Modifier le titre",
    "validate": "Valider",
    "cancel": "Annuler",
    "created-on": "Créé le",
    "expires-on": "Expire le",
    "file-type": "Type de dossier",
    "created-by": "Créé par",
    "usage-stats": "Statistiques d'utilisation",
    "first-consultation": "Première consultation",
    "last-consultation": "Dernière consultation",
    "nb-consultations": "Nombre de consultations",
    "no-consultation": "Pas de consultation",
    "expiration-updated": "Date d'expiration modifiée avec succès",
    "title-updated": "Titre modifié avec succès"
  }
}
</i18n>
