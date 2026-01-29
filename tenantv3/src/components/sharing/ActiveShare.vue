<template>
  <div>
    <div class="share-row fr-px-2w fr-py-1w">
      <!-- Checkbox + Infos -->
      <div class="share-infos">
        <slot :id="`cbl-${link.id}`"></slot>
        <div class="share-content">
          <label :for="`cbl-${link.id}`" class="share-title">
            <RiLinksLine
              v-if="link.type === 'LINK'"
              size="1rem"
              class="blue-text share-icon"
              title="Partage par lien"
            />
            <RiMailLine
              v-else-if="link.type === 'MAIL'"
              size="1rem"
              class="blue-text share-icon"
              title="Partage par email"
            />
            <RiHome4Line
              v-else-if="link.type === 'OWNER'"
              size="1rem"
              class="blue-text share-icon"
              title="Propriétaire DossierFacile"
            />
            <RiShakeHandsLine
              v-else-if="link.type === 'PARTNER'"
              size="1rem"
              class="blue-text share-icon"
              title="Partenaire"
            />
            <span v-if="link.type === 'PARTNER'" class="fr-ml-1v">Partage avec</span>
            <span class="fr-ml-1v bold">
              {{ link.title }}
            </span>
            <span v-if="link.type === 'MAIL'" class="fr-ml-1v">- {{ link.ownerEmail }}</span>
          </label>
          <!-- Badge visible uniquement en mobile -->
          <div class="share-badge-mobile">
            <DsfrBadge
              v-if="link.enabled"
              :label="t('active-sharing')"
              type="success"
              small
            />
            <p v-else class="fr-badge fr-badge--sm fr-badge--new fr-badge--no-icon fr-mb-0">
              <RiPauseCircleFill aria-hidden="true" size="1em" class="fr-mr-1v" />
              <span>{{ t('disabled-sharing') }}</span>
            </p>
          </div>
          <p class="fr-mb-0 fr-text--xs text-grey share-dates">
            <span class="bold">{{ t('created') }}</span>
            <span>{{ formatDate(link.creationDate) }}</span>
            <span class="bold border-left">{{ t('expires') }}</span>
            <span>{{ link.type === 'PARTNER' ? t('never') : formatDate(link.expirationDate) }}</span>
            <span class="bold border-left">{{ t('consultations') }}</span>
            <span>{{ t('times', [link.nbVisits]) }}</span>
          </p>
          <p 
            class="fr-badge fr-badge--sm fr-badge--no-icon fr-mb-0 full-data-badge"
            :class="link.fullData ? 'fr-badge--info' : 'badge-without-docs'"
          >
            <RiInformationFill aria-hidden="true" size="12" class="fr-mr-1v info-icon" />
            <span>{{ link.fullData ? t('with-docs') : t('without-docs') }}</span>
          </p>
        </div>
      </div>
      <!-- Badge visible uniquement en desktop -->
      <div class="share-badge-desktop">
        <DsfrBadge
          v-if="link.enabled"
          :label="t('active-sharing')"
          type="success"
          small
        />
        <p v-else class="fr-badge fr-badge--sm fr-badge--new fr-badge--no-icon fr-mb-0">
          <RiPauseCircleFill aria-hidden="true" size="1em" class="fr-mr-1v" />
          <span>{{ t('disabled-sharing') }}</span>
        </p>
      </div>
      <!-- Actions -->
      <div class="share-actions">
        <ShareActionsMenu
          :enabled="link.enabled"
          :link-type="link.type"
          @copy-link="handleCopyLink"
          @toggle-pause="handleTogglePause"
          @resend-mail="handleResendMail"
          @delete="handleDelete"
        />
        <button type="button" class="link-button blue-text" @click="toggleExpanded">
          {{ expanded ? t('show-less') : t('show-all') }}
          <RiSubtractLine v-if="expanded" aria-hidden="true" size="1em" />
          <RiAddLine v-else aria-hidden="true" size="1em" />
        </button>
      </div>
    </div>
    <SharingLinkDetails v-if="expanded" :link @refresh="emit('refresh')" />
  </div>
</template>

<script setup lang="ts">
import { DsfrBadge } from '@gouvminint/vue-dsfr'
import {
  RiAddLine,
  RiHome4Line,
  RiInformationFill,
  RiLinksLine,
  RiMailLine,
  RiPauseCircleFill,
  RiShakeHandsLine,
  RiSubtractLine
} from '@remixicon/vue'
import dayjs from 'dayjs'
import type { ApartmentSharingLink } from 'df-shared-next/src/models/ApartmentSharingLink'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import SharingLinkDetails from './SharingLinkDetails.vue'
import ShareActionsMenu from './ShareActionsMenu.vue'
import { ApartmentSharingLinkService } from '@/services/ApartmentSharingLinkService'
import { AnalyticsService } from '@/services/AnalyticsService'
import { useResendMail } from '@/composables/useResendMail'
import { toast } from '../toast/toastUtils'

const props = defineProps<{ link: ApartmentSharingLink }>()
const emit = defineEmits<{ refresh: [] }>()

const { t } = useI18n()
const { resendMail } = useResendMail()

const expanded = ref(false)

const toggleExpanded = () => {
  if (!expanded.value) {
    AnalyticsService.sharingExpandDetails()
  }
  expanded.value = !expanded.value
}

const formatDate = (date: string) => dayjs(date).format('D MMM YYYY')

const handleCopyLink = async () => {
  if (props.link.url) {
    try {
      const fullUrl = `${globalThis.location.origin}${props.link.url}`
      await navigator.clipboard.writeText(fullUrl)
      toast.success(t('link-copied'), null)
    } catch {
      toast.error(t('copy-error'), null)
    }
  }
}

const handleTogglePause = async () => {
  try {
    await ApartmentSharingLinkService.updateLinkStatus(props.link, !props.link.enabled)
    emit('refresh')
    toast.success(props.link.enabled ? t('pause-success') : t('reactivate-success'), null)
  } catch (error) {
    console.error(error)
    toast.error(t('pause-error'), null)
  }
}

const handleResendMail = async () => {
  if (await resendMail(props.link)) {
    emit('refresh')
  }
}

const handleDelete = async () => {
  try {
    await ApartmentSharingLinkService.deleteLink(props.link)
    emit('refresh')
    toast.success(t('delete-success'), null)
  } catch (error) {
    console.error(error)
    toast.error(t('delete-error'), null)
  }
}
</script>

<style scoped>
/* Layout principal */
.share-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.share-infos {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.share-content {
  margin-left: 0.5rem;
  flex: 1;
  min-width: 0;
}

.share-title {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 0.25rem;
}

.share-icon {
  flex-shrink: 0;
}

.share-dates {
  margin-top: 0.25rem;
}

.full-data-badge {
  margin-top: 0.25rem;
  text-transform: uppercase;
  
  .info-icon {
    color: #0063cb;
  }
}

.badge-without-docs {
  background-color: #fff;
  border: 1px solid #0063cb;
  color: #0063cb;
}

.border-left {
  margin-left: 0.5rem;
}
.border-left::before {
  content: '|';
  margin-right: 6px;
}

/* Badge desktop - visible par défaut */
.share-badge-desktop {
  display: flex;
  justify-content: center;
  flex: 0 0 auto;
  margin: 0 1rem;
}

/* Badge mobile - masqué par défaut */
.share-badge-mobile {
  display: none;
  margin: 0.5rem 0;
}

/* Actions */
.share-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.link-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid;
  white-space: nowrap;
}

/* Responsive mobile */
@media (max-width: 767px) {
  .share-row {
    flex-direction: column;
    align-items: stretch;
  }

  .share-infos {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    padding-top: 10px;
  }

  .share-content {
    flex: 1;
    margin-left: 0.5rem;
    min-width: 0;
  }

  .share-title {
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    line-height: 1.4;
  }

  /* En mobile: badge sous le titre */
  .share-badge-desktop {
    display: none;
  }

  /* Badge et dates à 8px du bord gauche - sortir de l'indentation */
  .share-badge-mobile {
    display: block;
    margin-top: 0.25rem;
    /* Compenser: margin-left de .share-content (0.5rem) + largeur checkbox (~32px) - 8px voulu */
    margin-left: calc(-0.5rem - 32px + 8px);
  }

  .share-dates {
    margin-top: 0.25rem;
    margin-left: calc(-0.5rem - 32px + 8px);
  }

  .full-data-badge {
    margin-left: calc(-0.5rem - 32px + 8px);
  }

  /* Actions en bas, alignées à droite */
  .share-actions {
    width: 100%;
    justify-content: flex-end;
    margin-top: 0.5rem;
    padding-top: 0.5rem;
  }
}
</style>

<i18n>
{
  "en": {
    "created": "Created on: ",
    "expires": "Expires on:",
    "never": "never",
    "consultations": "Consultations: ",
    "times": "{0} times",
    "active-sharing": "Active sharing",
    "disabled-sharing": "Disabled sharing",
    "show-all": "Show all",
    "show-less": "Show less",
    "link-copied": "Link copied",
    "copy-error": "Error copying link",
    "pause-success": "Sharing paused",
    "reactivate-success": "Sharing reactivated",
    "pause-error": "Error updating sharing status",
    "delete-success": "Sharing deleted",
    "delete-error": "Error deleting sharing",
    "with-docs": "Full file with supporting documents",
    "without-docs": "File without supporting documents"
  },
  "fr": {
    "created": "Créé le : ",
    "expires": "Expire le : ",
    "never": "jamais",
    "consultations": "Consultations : ",
    "times": "{0} fois",
    "active-sharing": "Partage actif",
    "disabled-sharing": "Partage en pause",
    "show-all": "Afficher tout",
    "show-less": "Afficher moins",
    "link-copied": "Le lien a été copié",
    "copy-error": "Erreur lors de la copie du lien",
    "pause-success": "Partage mis en pause",
    "reactivate-success": "Partage réactivé",
    "pause-error": "Erreur lors de la mise à jour du statut",
    "delete-success": "Partage supprimé",
    "delete-error": "Erreur lors de la suppression du partage",
    "with-docs": "Dossier complet avec justificatifs",
    "without-docs": "Dossier sans documents justificatifs"
  }
}
</i18n>
