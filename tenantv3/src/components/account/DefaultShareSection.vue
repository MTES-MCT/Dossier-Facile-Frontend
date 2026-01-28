<template>
  <div class="default-share-section bg-white fr-p-4w">
    <div class="link-section">
      <span class="fr-badge fr-badge--success fr-badge--sm fr-mb-2w">{{ t('badge-validated') }}</span>
      <h2 class="fr-h4 fr-mb-2w">{{ t('title') }}</h2>
      <p class="fr-mb-2w">
        {{ t('description-1') }} <strong>{{ t('description-bold-1') }}</strong> {{ t('description-2') }} <strong>{{ t('description-bold-2') }}</strong>
      </p>
      <div class="form-row fr-mb-2w">
        <div class="select-wrapper fr-mb-0w">
          <DsfrSelect
            v-model="selectedShareType"
            :label="t('share-type-label')"
            :options="shareTypeOptions"
            name="shareType"
          />
        </div>
        <div class="btn-wrapper">
          <button 
            type="button" 
            class="fr-btn" 
            :disabled="loading"
            @click="getLink"
          >
            {{ t('get-link') }}
            <RiFileCopyLine aria-hidden="true" size="16" class="fr-ml-1v" />
          </button>
        </div>
      </div>
      <!-- Only visible after clicking the getLink button -->
      <div v-if="generatedLink" class="link-result">
        <div class="link-badges fr-mb-2w">
          <span class="link-badge">
            <RiTimerLine aria-hidden="true" size="16" class="badge-icon" />
            {{ t('expires-in-n-days', { days: daysUntilExpiration }) }}
          </span>
          <span class="link-badge">
            <RiLockLine aria-hidden="true" size="16" class="badge-icon" />
            {{ generatedLink.fullData ? t('badge-with-docs') : t('badge-without-docs') }}
          </span>
        </div>
        <div class="link-display">
          <p class="link-url fr-mb-0">{{ fullUrl }}</p>
        </div>
        <div class="link-actions fr-mt-2w">
          <button type="button" class="fr-btn fr-btn--tertiary btn-copy" @click="copyLink">
            {{ t('copy-link') }}
            <RiFileCopyLine aria-hidden="true" size="16" class="fr-ml-1v" />
          </button>
          <a :href="fullUrl" class="fr-btn fr-btn--secondary btn-view-file" target="_blank" rel="noopener" @click="AnalyticsService.sharingSeeDefaultLink()">
            {{ t('view-file') }}
            <RiEyeLine aria-hidden="true" size="16" class="fr-ml-1v" />
          </a>
        </div>
        <p v-if="linkCopied" class="link-copied-message fr-mt-2w">
          {{ t('link-copied') }}
        </p>
        <div class="warning-message fr-mt-2w">
          <RiErrorWarningLine aria-hidden="true" size="24" class="warning-icon" />
          <p class="fr-mb-0">
            {{ t('warning-1') }} <strong>{{ t('warning-bold') }}</strong> {{ t('warning-2') }} <strong>{{ t('warning-bold-2') }}</strong>
          </p>
        </div>
      </div>
    </div>
    <hr class="fr-hr fr-mt-3w fr-mb-0" />
    <div class="tracking-section">
      <h3 class="fr-h6 fr-mb-2w fr-mt-0">{{ t('tracking-title') }}</h3>
      <p class="fr-mb-2w">{{ t('tracking-description') }}</p>
      <router-link to="/partages" class="fr-btn fr-btn--secondary" @click="AnalyticsService.sharingGoToAll()">
        {{ t('view-shares') }}
        <RiArrowRightLine aria-hidden="true" size="16" class="fr-ml-1v" />
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { DsfrSelect } from '@gouvminint/vue-dsfr'
import { 
  RiTimerLine, 
  RiLockLine, 
  RiFileCopyLine, 
  RiEyeLine, 
  RiErrorWarningLine,
  RiArrowRightLine
} from '@remixicon/vue'
import { ApartmentSharingLinkService } from '@/services/ApartmentSharingLinkService'
import { AnalyticsService } from '@/services/AnalyticsService'
import type { ApartmentSharingLink } from 'df-shared-next/src/models/ApartmentSharingLink'
import { toast } from '@/components/toast/toastUtils'
import dayjs from 'dayjs'

const { t } = useI18n()

const selectedShareType = ref('full')
const generatedLink = ref<ApartmentSharingLink | null>(null)
const loading = ref(false)
const linkCopied = ref(false)

const shareTypeOptions = computed(() => [
  { value: 'full', text: t('file-with-docs') },
  { value: 'restricted', text: t('file-without-docs') }
])

const fullUrl = computed(() => {
  if (!generatedLink.value?.url) return ''
  return `${globalThis.location.origin}${generatedLink.value.url}`
})

const daysUntilExpiration = computed(() => {
  if (!generatedLink.value?.expirationDate) return 0
  return dayjs(generatedLink.value.expirationDate).diff(dayjs(), 'day')
})

async function getLink() {
  const isFullData = selectedShareType.value === 'full'
  AnalyticsService.getDefaultLink(isFullData ? 'full' : 'limited')
  
  loading.value = true
  linkCopied.value = false
  try {
    const response = await ApartmentSharingLinkService.getOrCreateDefaultLink(isFullData)
    generatedLink.value = response.data
  } catch (error) {
    console.error(error)
    toast.error(t('error'), null)
  } finally {
    loading.value = false
  }
}

async function copyLink() {
  AnalyticsService.sharingCopyDefaultLink()
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
    linkCopied.value = true
  } catch (error) {
    console.error(error)
    toast.error(t('copy-error'), null)
  }
}
</script>

<style scoped lang="scss">
.default-share-section {
  box-shadow: 0 2px 6px 0 rgba(0, 0, 18, 0.16);
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
  }
}

.select-wrapper {
  flex: 1;
  max-width: 500px;
}

.btn-wrapper {
  display: flex;
  align-items: flex-start;

  @media (min-width: 768px) {
    padding-top: 32px;
  }
}

.link-result {
  background-color: #ececfe;
  padding: 12px;
  overflow: hidden;
}

.link-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.link-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background-color: var(--light-options-illustration-color-sun-default-brown-caramel-sun-425, #845d48);
  color: white;
  font-size: 12px;
  font-weight: 700;
  line-height: 20px;
  text-transform: uppercase;
  padding: 0 6px;
  border-radius: 4px;

  .badge-icon {
    flex-shrink: 0;
  }
}

.link-display {
  background-color: white;
  padding: 10px 5px;
  overflow: hidden;
}

.link-url {
  word-break: break-all;
}

.link-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.btn-copy {
  background: var(--light-decisions-background-background-transparent-active, rgba(0, 0, 0, 0.08));
}

.btn-view-file::after {
  display: none !important;
}

.link-copied-message {
  color: #18753c;
  font-weight: 700;
}

.warning-message {
  display: flex;
  align-items: flex-start;
  gap: 2px;
  color: #000091;

  .warning-icon {
    flex-shrink: 0;
    color: #000091;
  }
}
</style>

<i18n>
{
  "en": {
    "badge-validated": "VALIDATED FILE",
    "title": "Your file is validated and ready to be shared",
    "description-1": "This link gives access to your file.",
    "description-bold-1": "Share it",
    "description-2": "only with",
    "description-bold-2": "people you trust.",
    "share-type-label": "Type of file to share",
    "file-with-docs": "Complete file with your supporting documents",
    "file-without-docs": "File with information only (no documents)",
    "hint-with-docs": "Your complete file, with supporting documents.",
    "hint-without-docs": "Information about your situation, without supporting documents.",
    "get-link": "Get the link",
    "copy-link": "Copy link",
    "view-file": "View your file",
    "link-copied": "The link has been copied.",
    "warning-1": "This link gives",
    "warning-bold": "access to your file.",
    "warning-2": "Share it only with",
    "warning-bold-2": "people you trust.",
    "tracking-title": "Track your shares",
    "tracking-description": "Create personalized links, control access, set expiration dates and track activity in real time.",
    "view-shares": "View my file shares",
    "error": "An error occurred",
    "copy-error": "Unable to copy. Please try again.",
    "expires-in-n-days": "EXPIRES IN {days} DAYS",
    "badge-with-docs": "WITH DOCUMENTS",
    "badge-without-docs": "WITHOUT DOCUMENTS"
  },
  "fr": {
    "badge-validated": "DOSSIER VALIDÉ",
    "title": "Votre dossier est validé et prêt à être partagé",
    "description-1": "Ce lien donne accès à votre dossier.",
    "description-bold-1": "Partagez-le",
    "description-2": "uniquement avec",
    "description-bold-2": "des personnes de confiance.",
    "share-type-label": "Type de dossier à partager",
    "file-with-docs": "Dossier complet avec vos documents justificatifs",
    "file-without-docs": "Dossier avec informations seulement (sans documents)",
    "hint-with-docs": "Votre dossier complet, avec pièces justificatives.",
    "hint-without-docs": "Les informations sur votre situation, sans pièces justificatives.",
    "get-link": "Obtenir le lien",
    "copy-link": "Copier le lien",
    "view-file": "Voir votre dossier",
    "link-copied": "Le lien a bien été copié.",
    "warning-1": "Ce lien donne",
    "warning-bold": "accès à votre dossier.",
    "warning-2": "Partagez-le uniquement avec",
    "warning-bold-2": "des personnes de confiance.",
    "tracking-title": "Suivi de vos partages",
    "tracking-description": "Créez des liens personnalisés, contrôlez les accès, définissez des dates d'expiration et suivez l'activité en temps réel.",
    "view-shares": "Voir mes partages de dossier",
    "error": "Une erreur est survenue",
    "copy-error": "Impossible de copier. Veuillez réessayer.",
    "expires-in-n-days": "EXPIRE DANS {days} JOURS",
    "badge-with-docs": "AVEC DOCUMENTS",
    "badge-without-docs": "SANS DOCUMENTS"
  }
}
</i18n>
