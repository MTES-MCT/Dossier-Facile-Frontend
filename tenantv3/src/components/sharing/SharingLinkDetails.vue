<template>
  <div class="details">
    <div class="wrapper">
      <div class="section">
        <h3 class="fr-text--sm blue-text fr-mb-0">{{ t('general-info') }}</h3>
        <table class="table">
          <tbody>
            <tr v-if="isLinkOrMail" :class="{ 'title-row-editing': isEditingTitle }">
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
            <tr v-if="isLinkOrMail">
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
              <td>{{ link.fullData ? t('with-docs') : t('without-docs') }}</td>
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
    <div v-if="isLinkOrMail" class="info">
      <LinkWarning />
      <!-- Partage par lien -->
      <div v-if="link.type === 'LINK' && link.url" class="link-row fr-mt-1w">
        <div class="link-info">
          <p class="fr-text-mention--grey fr-mb-0">
            {{ link.fullData ? t('link-with-docs') : t('link-without-docs') }}
          </p>
          <p class="fr-mb-0">{{ fullUrl }}</p>
        </div>
        <div class="link-actions">
          <button
            type="button"
            class="fr-btn fr-btn--secondary fr-btn--sm"
            :disabled="!link.enabled"
            @click="copyLink"
          >
            {{ t('copy-link') }}
            <RiFileCopyLine aria-hidden="true" size="1rem" class="fr-ml-1w" />
          </button>
          <button type="button" class="fr-btn fr-btn--secondary fr-btn--sm" @click="pause">
            {{ link.enabled ? t('pause-share') : t('resume-share') }}
            <RiPauseCircleLine aria-hidden="true" size="1rem" class="fr-ml-1w" />
          </button>
        </div>
      </div>
      <!-- Partage par mail -->
      <div v-else-if="link.type === 'MAIL'" class="link-row fr-mt-1w">
        <div class="link-info">
          <p class="fr-text-mention--grey fr-mb-0">{{ t('email-sent-to') }}</p>
          <p class="fr-mb-0">{{ link.ownerEmail }}</p>
        </div>
        <div class="link-actions">
          <button
            type="button"
            class="fr-btn fr-btn--secondary fr-btn--sm"
            :disabled="!link.enabled"
            @click="resendMail"
          >
            {{ t('resend-mail') }}
            <RiSendPlaneLine aria-hidden="true" size="1rem" class="fr-ml-1w" />
          </button>
          <button type="button" class="fr-btn fr-btn--secondary fr-btn--sm" @click="pause">
            {{ link.enabled ? t('pause-share') : t('resume-share') }}
            <RiPauseCircleLine aria-hidden="true" size="1rem" class="fr-ml-1w" />
          </button>
          <p class="fr-text-mention--grey fr-text--sm fr-mb-0">
            {{ t('last-sent', { date: formatDateTime(link.lastVisit || link.creationDate) }) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import type { ApartmentSharingLink } from 'df-shared-next/src/models/ApartmentSharingLink'
import LinkWarning from './LinkWarning.vue'
import { RiPauseCircleLine, RiCalendarLine, RiPencilLine, RiFileCopyLine, RiSendPlaneLine } from '@remixicon/vue'
import { ApartmentSharingLinkService } from '@/services/ApartmentSharingLinkService'
import { toast } from '../toast/toastUtils'
import { useI18n } from 'vue-i18n'
import { ref, computed } from 'vue'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const { link } = defineProps<{ link: ApartmentSharingLink }>()
const emit = defineEmits<{ refresh: [] }>()

const { t } = useI18n()

const isEditingExpiration = ref(false)
const expirationDate = ref(link.expirationDate ? link.expirationDate.split('T')[0] : '')

const fullUrl = computed(() => {
  if (!link.url) return ''
  return `${window.location.origin}${link.url}`
})

const isLinkOrMail = computed(() => link.type === 'LINK' || link.type === 'MAIL')
const isPartnerOrOwner = computed(() => link.type === 'PARTNER' || link.type === 'OWNER')

const isEditingTitle = ref(false)
const editedTitle = ref(link.title)

const formatDate = (date: string) => dayjs(date).format('D MMM YYYY')
const formatDatePicker = (date: Date | string) => dayjs(date).format('DD/MM/YYYY')
const formatDateTime = (date: string) => dayjs(date).format('D MMMM YYYY - HH[h]mm')

const minDate = new Date()
minDate.setDate(minDate.getDate() + 1)

async function pause() {
  try {
    await ApartmentSharingLinkService.updateLinkStatus(link, !link.enabled)
    emit('refresh')
  } catch (error) {
    console.error(error)
    toast.error(t('error'), null)
  }
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(fullUrl.value)
    toast.success(t('link-copied'), null)
  } catch (error) {
    console.error(error)
    toast.error(t('error'), null)
  }
}

async function resendMail() {
  try {
    await ApartmentSharingLinkService.resendLink(link)
    toast.success(t('mail-resent'), null)
    emit('refresh')
  } catch (error) {
    console.error(error)
    toast.error(t('error'), null)
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
.link-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
}
.link-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
  min-width: 0;
  word-break: break-all;
}
.link-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;
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
  .link-row {
    flex-direction: column;
  }
  .link-actions {
    align-items: flex-start;
    width: 100%;
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
    "with-docs": "With supporting documents",
    "without-docs": "Without supporting documents",
    "expiration-updated": "Expiration date updated successfully",
    "title-updated": "Title updated successfully",
    "link-with-docs": "Link to file with supporting documents",
    "link-without-docs": "Link to file without supporting documents",
    "copy-link": "Copy link",
    "link-copied": "Link copied to clipboard",
    "pause-share": "Pause share",
    "resume-share": "Resume share",
    "email-sent-to": "Email sent to",
    "resend-mail": "Resend share by email",
    "mail-resent": "Email resent successfully",
    "last-sent": "Last sent: {date}"
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
    "with-docs": "Avec justificatifs",
    "without-docs": "Sans justificatifs",
    "expiration-updated": "Date d'expiration modifiée avec succès",
    "title-updated": "Titre modifié avec succès",
    "link-with-docs": "Lien du dossier avec documents justificatifs",
    "link-without-docs": "Lien du dossier sans documents justificatifs",
    "copy-link": "Copier le lien",
    "link-copied": "Lien copié dans le presse-papier",
    "pause-share": "Mettre le partage en pause",
    "resume-share": "Réactiver le partage",
    "email-sent-to": "Envoi par email à l'adresse",
    "resend-mail": "Renvoyer le partage par mail",
    "mail-resent": "Email renvoyé avec succès",
    "last-sent": "Dernier envoi : {date}"
  }
}
</i18n>
