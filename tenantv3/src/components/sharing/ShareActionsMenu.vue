<template>
  <div class="actions-menu" ref="menuContainer">
    <button
      type="button"
      class="actions-button"
      @click="toggleMenu"
      :aria-expanded="isOpen"
      aria-haspopup="true"
    >
      <span class="actions-text">{{ t('actions') }}</span>
      <RiArrowUpSLine v-if="isOpen" aria-hidden="true" size="16px" class="arrow-icon" />
      <RiArrowDownSLine v-else aria-hidden="true" size="16px" class="arrow-icon" />
    </button>

    <div v-if="isOpen" class="dropdown-menu">
      <!-- Options for LINK type -->
      <template v-if="linkType === 'LINK'">
        <button v-if="enabled" type="button" class="menu-item" @click="handleCopyLink">
          <RiFileCopyLine aria-hidden="true" size="16px" class="menu-icon" />
          <span>{{ t('copy-the-link') }}</span>
        </button>

        <button type="button" class="menu-item" @click="handleTogglePause">
          <RiPauseCircleLine v-if="enabled" aria-hidden="true" size="16px" class="menu-icon" />
          <RiPlayCircleLine v-else aria-hidden="true" size="16px" class="menu-icon" />
          <span>{{ enabled ? t('pause-sharing') : t('reactivate-sharing') }}</span>
        </button>
      </template>

      <!-- Options for MAIL type -->
      <template v-if="linkType === 'MAIL'">
        <button v-if="enabled" type="button" class="menu-item" @click="handleResendMail">
          <RiSendPlaneLine aria-hidden="true" size="16px" class="menu-icon" />
          <span>{{ t('resend-mail') }}</span>
        </button>

        <button type="button" class="menu-item" @click="handleTogglePause">
          <RiPauseCircleLine v-if="enabled" aria-hidden="true" size="16px" class="menu-icon" />
          <RiPlayCircleLine v-else aria-hidden="true" size="16px" class="menu-icon" />
          <span>{{ enabled ? t('pause-sharing') : t('reactivate-sharing') }}</span>
        </button>
      </template>

      <!-- Options for OWNER/PARTNER type -->
      <template v-if="linkType === 'OWNER' || linkType === 'PARTNER'">
        <button type="button" class="menu-item" @click="handleTogglePause">
          <RiPauseCircleLine v-if="enabled" aria-hidden="true" size="16px" class="menu-icon" />
          <RiPlayCircleLine v-else aria-hidden="true" size="16px" class="menu-icon" />
          <span>{{ enabled ? t('pause-sharing') : t('reactivate-sharing') }}</span>
        </button>
      </template>

      <button type="button" class="menu-item delete-item" @click.stop="handleDelete">
        <RiDeleteBinLine aria-hidden="true" size="16px" class="menu-icon" />
        <span>{{ t('delete-sharing') }}</span>
      </button>
    </div>
    <DsfrModalPatch
      v-model:is-opened="isDeleteModalOpen"
      :title="t('delete-confirmation-title')"
      :actions="modalActions"
      size="xl"
    >
      <p>{{ t('delete-confirmation-message') }}</p>
    </DsfrModalPatch>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, type ComputedRef } from 'vue'
import {
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiFileCopyLine,
  RiPauseCircleLine,
  RiPlayCircleLine,
  RiDeleteBinLine,
  RiSendPlaneLine
} from '@remixicon/vue'
import { useI18n } from 'vue-i18n'
import { AnalyticsService } from '@/services/AnalyticsService'
import DsfrModalPatch from 'df-shared-next/src/components/patches/DsfrModalPatch.vue'
import type { DsfrButtonProps } from '@gouvminint/vue-dsfr'

const props = defineProps<{
  enabled?: boolean
  linkType: 'LINK' | 'MAIL' | 'OWNER' | 'PARTNER'
}>()

const emit = defineEmits<{
  copyLink: []
  togglePause: []
  resendMail: []
  delete: []
}>()

const { t } = useI18n()

const isOpen = ref(false)

const isDeleteModalOpen = ref(false)
const modalActions: ComputedRef<DsfrButtonProps[]> = computed(() => [
  {
    label: t('cancel'),
    type: 'button',
    secondary: true,
    onClick() {
      isDeleteModalOpen.value = false
    }
  },
  {
    label: t('confirm-delete'),
    type: 'button',
    onClick() {
      confirmDelete()
    }
  }
])

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const closeMenu = () => {
  isOpen.value = false
}

const handleCopyLink = () => {
  AnalyticsService.sharingAction('copy')
  emit('copyLink')
  closeMenu()
}

const handleTogglePause = () => {
  AnalyticsService.sharingAction(props.enabled ? 'disable' : 'enable')
  emit('togglePause')
  closeMenu()
}

const handleResendMail = () => {
  emit('resendMail')
  closeMenu()
}

const handleDelete = () => {
  isDeleteModalOpen.value = true
  closeMenu()
}

const confirmDelete = () => {
  AnalyticsService.sharingAction('delete')
  emit('delete')
  isDeleteModalOpen.value = false
}
</script>

<style scoped>
.actions-menu {
  position: relative;
  display: inline-block;
}

.actions-button {
  background-color: #ffffff;
  border: 1px solid #dddddd;
  padding: 4px 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.actions-button:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.actions-button[aria-expanded='true'] {
  background-color: #e3e3fd;
}

.actions-text {
  font-family: Marianne, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
  color: #000091;
  padding-left: 4px;
}

.arrow-icon {
  color: #000091;
  pointer-events: none;
}

.dropdown-menu {
  position: absolute;
  top: 32px;
  left: 0;
  width: 282px;
  max-height: 430px;
  background-color: #ffffff;
  border-top: 1px solid #e3e3fd;
  box-shadow: 0px 4px 12px 0px rgba(0, 0, 18, 0.16);
  overflow: hidden;
  z-index: 1000;
}

.menu-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 16px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-family: Marianne, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
  color: #000091;
  text-align: left;
  transition: background-color 0.2s;
}

.menu-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.menu-icon {
  flex-shrink: 0;
  color: #000091;
}

.delete-item {
  background-color: rgba(0, 0, 0, 0.04);
}
</style>

<i18n>
{
  "en": {
    "actions": "Actions",
    "copy-the-link": "Copy the link",
    "pause-sharing": "Pause sharing",
    "reactivate-sharing": "Reactivate sharing",
    "resend-mail": "Resend share by email",
    "delete-sharing": "Delete sharing",
    "delete-confirmation-title": "Delete confirmation",
    "delete-confirmation-message": "Are you sure you want to delete this sharing?",
    "cancel": "Cancel",
    "confirm-delete": "Delete"
  },
  "fr": {
    "actions": "Actions",
    "copy-the-link": "Copier le lien",
    "pause-sharing": "Mettre le partage en pause",
    "reactivate-sharing": "Réactiver le partage",
    "resend-mail": "Renvoyer le partage par mail",
    "delete-sharing": "Supprimer le partage",
    "delete-confirmation-title": "Confirmation de suppression",
    "delete-confirmation-message": "Êtes-vous sûr de vouloir supprimer ce partage ?",
    "cancel": "Annuler",
    "confirm-delete": "Supprimer"
  }
}
</i18n>
