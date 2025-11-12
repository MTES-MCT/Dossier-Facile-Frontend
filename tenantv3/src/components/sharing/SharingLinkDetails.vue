<template>
  <div class="details">
    <div class="wrapper">
      <div class="section">
        <h3 class="fr-text--sm blue-text fr-mb-0">{{ t('general-info') }}</h3>
        <table class="table">
          <tbody>
            <tr>
              <td class="fr-text-mention--grey">{{ t('title-of-share') }}</td>
              <td>
                {{ link.title }}
                <button type="button" class="blue-text">{{ t('update') }}</button>
              </td>
            </tr>
            <tr>
              <td class="fr-text-mention--grey">{{ t('created-on') }}</td>
              <td>{{ formatDate(link.creationDate) }}</td>
            </tr>
            <tr>
              <td class="fr-text-mention--grey">{{ t('expires-on') }}</td>
              <td>
                {{ formatDate(link.expirationDate) }}
                <button type="button" class="blue-text">{{ t('update') }}</button>
              </td>
            </tr>
            <tr>
              <td class="fr-text-mention--grey">{{ t('file-type') }}</td>
              <td>{{ link.fullData ? 'Avec justificatifs' : 'Sans justificatifs' }}</td>
            </tr>
            <tr>
              <td class="fr-text-mention--grey">{{ t('created-by') }}</td>
              <td>TODO</td>
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
              <td>{{ formatDate(link.firstVisit) }}</td>
            </tr>
            <tr>
              <td class="fr-text-mention--grey">{{ t('last-consultation') }}</td>
              <td>{{ formatDate(link.lastVisit) }}</td>
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
import { RiPauseCircleLine } from '@remixicon/vue'
import { ApartmentSharingLinkService } from '@/services/ApartmentSharingLinkService'
import { toast } from '../toast/toastUtils'
import { useI18n } from 'vue-i18n'
import { useTemplateRef } from 'vue'

const { link } = defineProps<{ link: ApartmentSharingLink }>()
const emit = defineEmits<{ refresh: [] }>()

const { t } = useI18n()
const pauseButton = useTemplateRef('pause-btn')

const formatDate = (date: string) => dayjs(date).format('D MMM YYYY')

async function pause() {
  try {
    await ApartmentSharingLinkService.updateLinkStatus(link, !link.enabled)
    emit('refresh')
  } catch (error) {
    console.error(error)
    toast.error(t('error'), pauseButton.value?.button)
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
    border-bottom: 1px solid #ddd;
    margin-top: 4px;
    td + td {
      flex: 1;
      text-align: right;
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
</style>

<i18n>
{
  "en": {
    "general-info":"General information",
    "title-of-share": "Title of the share",
    "update": "Update",
    "created-on": "Created on",
    "expires-on": "Expires on",
    "file-type": "Type of file",
    "created-by": "Created by",
    "usage-stats": "Usage statistics",
    "first-consultation": "First consultation",
    "last-consultation": "Last consultation",
    "nb-consultations": "Number of consultations"
  },
  "fr": {
    "general-info":"Informations générales",
    "title-of-share": "Titre du partage",
    "update": "Modifier",
    "created-on": "Créé le",
    "expires-on": "Expire le",
    "file-type": "Type de dossier",
    "created-by": "Créé par",
    "usage-stats": "Statistiques d’utilisation",
    "first-consultation": "Première consultation",
    "last-consultation": "Dernière consultation",
    "nb-consultations": "Nombre de consultations"
  }
}
</i18n>
