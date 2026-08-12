<template>
  <div class="completed-file-banner">
    <p class="fr-badge fr-badge--success fr-badge--sm">{{ t('badge') }}</p>
    <h2 class="fr-h4">{{ t('title') }}</h2>
    <ul class="check-list" role="list">
      <li class="check-list__item">
        <VIcon
          icon="ri:checkbox-circle-line"
          class="check-list__icon"
          color="var(--text-default-success)"
          aria-hidden="true"
        />
        <span>{{ t('check-documents') }}</span>
      </li>
      <li class="check-list__item">
        <VIcon
          icon="ri:shield-line"
          class="check-list__icon"
          color="var(--text-default-success)"
          aria-hidden="true"
        />
        <span>{{ t('check-watermark') }}</span>
      </li>
    </ul>
    <hr class="banner-separator" />
    <p>{{ t('download-description') }}</p>
    <DsfrButton
      ref="download-zip"
      :label="t('download-zip')"
      icon="ri:download-line"
      :icon-right="true"
      secondary
      size="sm"
      @click="onDownload"
    />
  </div>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { DsfrButton, VIcon } from '@gouvminint/vue-dsfr'
import { useZipDownload } from '@/composables/useZipDownload'
import { AnalyticsService } from '@/services/AnalyticsService'

const { t } = useI18n()
const { downloadZip } = useZipDownload()
const downloadZipElt = useTemplateRef<InstanceType<typeof DsfrButton>>('download-zip')

function onDownload() {
  AnalyticsService.optInDownloadZip()
  downloadZip(downloadZipElt.value?.$el)
}
</script>

<style scoped lang="scss">
/* Figma 10700:7601 — padding 24px/32px, 12px between each block */
.completed-file-banner {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1.5rem 2rem;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 18, 0.16);
  background: var(--grey-1000-50);

  > * {
    margin: 0;
  }
}

.check-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
}

.check-list__item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.banner-separator {
  align-self: stretch;
  height: 0;
  padding: 0;
  border: 0;
  border-top: 1px solid var(--border-default-grey);
}

/* The color goes through the VIcon `color` prop: the component sets an inline
   `color: inherit` on the svg, which would override any color set from CSS */
.check-list__icon {
  flex-shrink: 0;
}

</style>

<i18n>
{
  "en": {
    "badge": "Completed file, ready to share",
    "title": "Your file is complete and ready to be shared",
    "check-documents": "Your file contains the required documents.",
    "check-watermark": "All your documents are protected by a watermark.",
    "download-description": "Download your file as a ZIP archive, then send it to the landlord or agency of your choice.",
    "download-zip": "Download my file (ZIP)"
  },
  "fr": {
    "badge": "Dossier complété, prêt à partager",
    "title": "Votre dossier est complet et prêt à être partagé",
    "check-documents": "Votre dossier réunit les documents nécessaires.",
    "check-watermark": "Tous vos documents sont protégés par un filigrane.",
    "download-description": "Téléchargez votre dossier au format ZIP, puis transmettez-le au propriétaire ou à l'agence de votre choix.",
    "download-zip": "Télécharger mon dossier (ZIP)"
  }
}
</i18n>
