<template>
  <div class="details">
    <div class="wrapper">
      <div class="section">
        <table class="table">
          <caption class="fr-text--sm blue-text fr-mb-0">
            {{
              t('general-info')
            }}
          </caption>
          <thead class="sr-only">
            <tr>
              <th scope="col">{{ t('property') }}</th>
              <th scope="col">{{ t('value') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLinkOrMail" :class="{ 'title-row-editing': isEditingTitle }">
              <th :id="`${linkId}-edit-title`" scope="row" class="fr-text-mention--grey">
                {{ t('title-of-share') }}
              </th>
              <td class="title-cell">
                <div v-if="!isEditingTitle" class="title-display">
                  {{ link.title }}
                  <DsfrButton
                    ref="edit-title-btn"
                    type="button"
                    :label="t('update')"
                    tertiary
                    icon="fr-icon-pencil-line"
                    icon-right
                    size="sm"
                    :aria-describedby="`${linkId}-edit-title`"
                    @click="startEditingTitle"
                  />
                </div>
                <div v-else class="title-edit">
                  <input
                    ref="edit-title-input"
                    v-model="editedTitle"
                    type="text"
                    class="fr-input"
                    name="title"
                    :aria-labelledby="`${linkId}-edit-title`"
                    :aria-describedby="`${linkId}-title`"
                    @keydown.enter="saveTitle"
                    @keyup.escape="cancelEditingTitle"
                  />
                  <div class="title-edit-buttons">
                    <DsfrButton
                      type="button"
                      :label="t('validate')"
                      tertiary
                      size="sm"
                      @click="saveTitle"
                    />
                    <DsfrButton
                      type="button"
                      :label="t('cancel')"
                      tertiary
                      size="sm"
                      @click="cancelEditingTitle"
                    />
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th scope="row" class="fr-text-mention--grey">{{ t('created-on') }}</th>
              <td>{{ formatDate(link.creationDate) }}</td>
            </tr>
            <tr v-if="isLinkOrMail">
              <th :id="`${linkId}-expire`" scope="row" class="fr-text-mention--grey">
                {{ t('expires-on') }}
              </th>
              <td class="expiration-cell">
                <template v-if="!isEditingExpiration">
                  <time :datetime="link.expirationDate">{{ formatDate(link.expirationDate) }}</time>
                  <DsfrButton
                    ref="edit-expiration-btn"
                    type="button"
                    :label="t('update')"
                    tertiary
                    icon="fr-icon-pencil-line"
                    icon-right
                    size="sm"
                    :aria-describedby="`${linkId}-expire`"
                    @click="openUpdateExpirationDate"
                  />
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
                  @closed="closeUpdateExpirationDate"
                  @keyup.esc="closeUpdateExpirationDate"
                >
                  <template #dp-input="{ value }">
                    <div class="dp-custom-input">
                      <button ref="date-picker-btn" type="button">
                        <span class="fr-icon-calendar-line fr-icon--sm" />
                        {{ formatDatePicker(value) }}
                      </button>
                      <DsfrButton
                        type="button"
                        class="dp-custom-input__close fr-m-0 fr-p-0"
                        :label="t('cancel')"
                        tertiary
                        no-outline
                        icon="fr-icon-close-line"
                        icon-only
                        size="sm"
                        @click.stop="closeUpdateExpirationDate"
                      />
                    </div>
                  </template>
                </VueDatePicker>
              </td>
            </tr>
            <tr>
              <th scope="row" class="fr-text-mention--grey">{{ t('created-by') }}</th>
              <td>{{ link.createdBy || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="section">
        <table class="table">
          <caption class="fr-text--sm blue-text fr-mb-0">
            {{
              t('usage-stats')
            }}
          </caption>
          <thead class="sr-only">
            <tr>
              <th scope="col">{{ t('property') }}</th>
              <th scope="col">{{ t('value') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" class="fr-text-mention--grey">{{ t('first-consultation') }}</th>
              <td>{{ link.nbVisits > 0 ? formatDate(link.lastVisit) : t('no-consultation') }}</td>
            </tr>
            <tr>
              <th scope="row" class="fr-text-mention--grey">{{ t('last-consultation') }}</th>
              <td>{{ link.nbVisits > 0 ? formatDate(link.lastVisit) : t('no-consultation') }}</td>
            </tr>
            <tr>
              <th scope="row" class="fr-text-mention--grey">{{ t('nb-consultations') }}</th>
              <td>{{ link.nbVisits }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-if="isLinkOrMail" class="info fr-mt-1w">
      <LinkWarning />
      <div class="link-row fr-mt-1w">
        <div class="link-info">
          <p v-if="link.type === 'LINK'" class="fr-mb-0">
            <span class="fr-text-mention--grey">{{
              link.fullData ? t('link-with-docs') : t('link-without-docs')
            }}</span>
            <br />
            {{ fullUrl }}
          </p>
          <p v-if="link.type === 'MAIL'" class="fr-mb-0">
            <span class="fr-text-mention--grey">{{ t('email-sent-to') }}</span> <br />
            {{ link.ownerEmail }} <br />
            <span class="fr-text-mention--grey fr-text--sm">
              {{
                t('last-sent', { date: formatDateTime(link.lastMailSentDate || link.creationDate) })
              }}
            </span>
          </p>
        </div>
        <div class="link-actions">
          <!-- Partage par lien -->
          <DsfrButton
            v-if="link.type === 'LINK' && link.url && link.enabled"
            type="button"
            :label="t('copy-link')"
            secondary
            icon="fr-icon-clipboard-line"
            icon-right
            size="sm"
            :aria-describedby="`${linkId}-title`"
            @click="copyLink"
          />
          <!-- Partage par mail -->
          <DsfrButton
            v-if="link.type === 'MAIL'"
            type="button"
            :label="t('resend-mail')"
            secondary
            icon="fr-icon-send-plane-line"
            icon-right
            size="sm"
            :aria-describedby="`${linkId}-title`"
            @click="handleResendMail"
          />
          <DsfrButton
            type="button"
            :label="link.enabled ? t('pause-share') : t('resume-share')"
            secondary
            :icon="link.enabled ? 'fr-icon-pause-circle-line' : 'fr-icon-play-circle-line'"
            icon-right
            size="sm"
            :aria-describedby="`${linkId}-title`"
            @click="pause"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import type { ApartmentSharingLink } from 'df-shared-next/src/models/ApartmentSharingLink'
import LinkWarning from './LinkWarning.vue'
import { ApartmentSharingLinkService } from '@/services/ApartmentSharingLinkService'
import { AnalyticsService } from '@/services/AnalyticsService'
import { useTenantStore } from '@/stores/tenant-store'
import { useResendMail } from '@/composables/useResendMail'
import { toast } from '../toast/toastUtils'
import { useI18n } from 'vue-i18n'
import { ref, computed, useTemplateRef, nextTick } from 'vue'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { DsfrButton } from '@gouvminint/vue-dsfr'

const { link, linkId } = defineProps<{ link: ApartmentSharingLink; linkId: string }>()
const emit = defineEmits<{ refresh: [] }>()

const { t } = useI18n()
const store = useTenantStore()
const { resendMail } = useResendMail()

const isEditingExpiration = ref(false)
const expirationDate = ref(link.expirationDate ? link.expirationDate.split('T')[0] : '')

const fullUrl = computed(() => {
  if (!link.url) return ''
  return `${globalThis.location.origin}${link.url}`
})

const isLinkOrMail = computed(() => link.type === 'LINK' || link.type === 'MAIL')

const isEditingTitle = ref(false)
const editedTitle = ref(link.title)
const editTitleInput = useTemplateRef<HTMLInputElement>('edit-title-input')
const editTitleBtn = useTemplateRef('edit-title-btn')
const editExpirationBtn = useTemplateRef('edit-expiration-btn')
const datePickerBtn = useTemplateRef<HTMLButtonElement>('date-picker-btn')

const formatDate = (date: string) => dayjs(date).format('D MMM YYYY')
const formatDatePicker = (date: Date | string) => dayjs(date).format('DD/MM/YYYY')
const formatDateTime = (date: string) => dayjs(date).format('D MMMM YYYY - HH[h]mm')

const minDate = new Date()
minDate.setDate(minDate.getDate() + 1)

async function pause() {
  AnalyticsService.sharingToggleLink(link.enabled ? 'disable' : 'enable')
  try {
    await ApartmentSharingLinkService.updateLinkStatus(link, !link.enabled)
    emit('refresh')
  } catch (error) {
    console.error(error)
    toast.error(t('error'), null)
  }
}

async function copyLink() {
  const text = fullUrl.value
  try {
    if (navigator.clipboard && globalThis.isSecureContext) {
      await navigator.clipboard.writeText(text)
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      textarea.remove()
    }
    toast.success(t('link-copied'), null)
  } catch (error) {
    console.error(error)
    toast.error(t('error'), null)
  }
}

async function handleResendMail() {
  AnalyticsService.sharingResendMail(store.user.status)
  if (await resendMail(link)) {
    emit('refresh')
  }
}

async function updateExpirationDate(date: string) {
  try {
    await ApartmentSharingLinkService.updateLinkExpiration(link, date)
    isEditingExpiration.value = false
    toast.success(t('expiration-updated'), null)
    emit('refresh')
    await nextTick()
    editExpirationBtn.value?.$el.focus()
  } catch (error) {
    console.error(error)
    toast.error(t('error'), null)
  }
}

async function openUpdateExpirationDate() {
  isEditingExpiration.value = true
  await nextTick()
  datePickerBtn.value?.focus()
}
async function closeUpdateExpirationDate() {
  isEditingExpiration.value = false
  await nextTick()
  editExpirationBtn.value?.$el.focus()
}

async function startEditingTitle() {
  editedTitle.value = link.title
  isEditingTitle.value = true
  await nextTick()
  editTitleInput.value?.focus()
}

async function cancelEditingTitle() {
  isEditingTitle.value = false
  editedTitle.value = link.title
  await nextTick()
  editTitleBtn.value?.$el.focus()
}

async function saveTitle() {
  try {
    await ApartmentSharingLinkService.updateLinkTitle(link, editedTitle.value)
    isEditingTitle.value = false
    toast.success(t('title-updated'), null)
    emit('refresh')
    await nextTick()
    editTitleBtn.value?.$el.focus()
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
    th {
      font-weight: normal;
    }
    td,
    th + td {
      flex: 1;
      text-align: right;
    }
  }
  tr.title-row-editing {
    align-items: flex-start;
    th:first-child {
      padding-top: 0.625rem;
    }
  }
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
.info {
  background-color: white;
  border-radius: 4px;
  padding: 8px;
}
.link-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
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
caption {
  text-align: left;
  font-weight: bold;
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
  line-height: 1;
  color: #666;
  padding: 0;
}
.dp-custom-input__close:hover {
  color: #333;
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
  .title-display {
    flex-direction: column;
    align-items: flex-end;
    gap: 0.25rem;
  }
  .expiration-cell {
    flex-direction: column;
    align-items: flex-end;
    gap: 0.25rem;
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

<i18n lang="json">
{
  "en": {
    "property": "Property",
    "value": "Value",
    "general-info": "General information",
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
    "last-sent": "Last sent: {date}"
  },
  "fr": {
    "property": "Propriété",
    "value": "Valeur",
    "general-info": "Informations générales",
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
    "last-sent": "Dernier envoi : {date}"
  }
}
</i18n>
