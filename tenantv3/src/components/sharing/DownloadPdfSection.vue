<template>
  <div class="download-section">
    <div class="content-wrapper">
      <div class="left-section">
        <div class="icon">
          <RiFileDownloadLine aria-hidden="true" />
        </div>
        <div class="text-content">
          <h3 class="fr-text--lg fr-mb-0">{{ t('title') }}</h3>
          <p class="description-desktop fr-text--sm fr-mb-0">
            <strong>{{ t('warning') }}</strong> {{ t('warning-text') }}
          </p>
        </div>
      </div>
      <p class="description-mobile fr-text--sm fr-mb-0">
        <strong>{{ t('warning') }}</strong> {{ t('warning-text') }}
      </p>
      <div class="btn-wrapper">
        <button
          v-if="showProgressBar"
          type="button"
          class="fr-btn fr-btn--secondary"
          disabled
        >
          {{ t('download-in-progress') }}
          <span><ProgressIndicator diameter="22px" border="3px" /></span>
        </button>
        <button
          v-else
          ref="downloadButton"
          type="button"
          class="fr-btn fr-btn--secondary"
          @click="download"
        >
          {{ t('download-button') }}
          <RiFileDownloadLine aria-hidden="true" size="1rem" class="fr-ml-1v" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { RiFileDownloadLine } from '@remixicon/vue'
import ProgressIndicator from 'df-shared-next/src/Button/ProgressIndicator.vue'
import { ProfileService } from '@/services/ProfileService'
import { UtilsService } from '@/services/UtilsService'
import { toast } from '@/components/toast/toastUtils'
import { AnalyticsService } from '@/services/AnalyticsService'

const { t } = useI18n()

const showProgressBar = ref(false)
const downloadButton = useTemplateRef('downloadButton')
const dossierPdfDocumentStatus = ref<string | undefined>(undefined)

async function fetchCurrentTenantFullData() {
  try {
    const response = await ProfileService.getCurrentTenantFullData()
    dossierPdfDocumentStatus.value = response.data.dossierPdfDocumentStatus
  } catch (error) {
    console.error('Failed to fetch PDF status:', error)
  }
}

onMounted(fetchCurrentTenantFullData)

async function downloadPdf() {
  try {
    const response = await ProfileService.getCurrentTenantPdf()
    const blob = new Blob([response.data], { type: 'application/pdf' })
    const link = globalThis.document.createElement('a')
    link.href = globalThis.URL.createObjectURL(blob)
    const fileName = UtilsService.getFileNameFromHeaders(response.headers, 'dossierFacile.pdf')
    link.download = fileName
    link.click()
  } catch (error) {
    console.error('Failed to download PDF:', error)
    toast.error(t('download-failed'), downloadButton.value)
    showProgressBar.value = false
  } finally {
    showProgressBar.value = false
  }
}

function retryDownload(remainingCount: number) {
  setTimeout(async () => {
    await fetchCurrentTenantFullData()
    if (dossierPdfDocumentStatus.value === 'COMPLETED') {
      await downloadPdf()
    } else if (remainingCount > 0) {
      retryDownload(remainingCount - 1)
    } else {
      showProgressBar.value = false
      toast.error(t('download-failed-try-later'), downloadButton.value)
    }
  }, 10000)
}

function download() {
  AnalyticsService.sharingDownloadFull()
  showProgressBar.value = true
  if (dossierPdfDocumentStatus.value === 'COMPLETED') {
    downloadPdf()
  } else {
    ProfileService.postCreateCurrentTenantPdf()
      .then(() => {
        retryDownload(6)
      })
      .catch(() => {
        showProgressBar.value = false
        toast.error(t('download-failed'), downloadButton.value)
      })
  }
}
</script>

<style scoped>
.download-section {
  border: 1px solid #000091;
  padding: 10px;
  border-radius: 4px;
  background-color: white;

  @media (min-width: 768px) {
    padding: 20px;
  }
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
}

.left-section {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.icon {
  background-color: #000091;
  color: white;
  padding: 8px;
  border-radius: 4px;
  line-height: 1rem;
  flex-shrink: 0;
}

.text-content {
  display: flex;
  flex-direction: column;
  gap: 5px;

  h3 {
    color: #000091;
  }
}

.description-desktop {
  display: none;

  @media (min-width: 768px) {
    display: block;
  }
}

.description-mobile {
  display: block;

  @media (min-width: 768px) {
    display: none;
  }
}

.btn-wrapper {
  flex-shrink: 0;

  button {
    width: 100%;
    justify-content: center;

    @media (min-width: 768px) {
      width: auto;
    }
  }
}
</style>

<i18n>
{
  "en": {
    "title": "Download your PDF file",
    "warning": "Warning:",
    "warning-text": "if you download the file and send it yourself (by e-mail or messaging), you lose the tracking of consultations and control of the content.",
    "download-button": "Download your file",
    "download-in-progress": "Downloading...",
    "download-failed": "Download failed. Please try again.",
    "download-failed-try-later": "Download failed. Please try again later."
  },
  "fr": {
    "title": "Télécharger votre dossier PDF",
    "warning": "Attention :",
    "warning-text": "si vous téléchargez le dossier et l'envoyez vous-même (par e-mail ou messagerie), vous perdez le suivi des consultations et la maîtrise du contenu.",
    "download-button": "Télécharger votre dossier",
    "download-in-progress": "Téléchargement...",
    "download-failed": "Le téléchargement a échoué. Veuillez réessayer.",
    "download-failed-try-later": "Le téléchargement a échoué. Veuillez réessayer plus tard."
  }
}
</i18n>
