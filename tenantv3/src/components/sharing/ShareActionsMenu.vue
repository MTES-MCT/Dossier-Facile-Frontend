<template>
  <div ref="menuContainer" class="actions-menu">
    <DsfrButton
      type="button"
      :label="t('actions')"
      tertiary
      :icon="isOpen ? 'fr-icon-arrow-up-s-line' : 'fr-icon-arrow-down-s-line'"
      icon-right
      size="sm"
      :aria-expanded="isOpen"
      :aria-controls="dropdownID"
      :aria-describedby="`${linkId}-title`"
      @click="toggleMenu"
    />

    <div v-show="isOpen" :id="dropdownID" class="dropdown-menu fr-p-1v" @keyup.esc="isOpen = false">
      <!-- Options for LINK type -->
      <DsfrButton
        v-if="linkType === 'LINK' && enabled"
        class="menu-item"
        type="button"
        :label="t('copy-the-link')"
        tertiary
        no-outline
        icon="fr-icon-clipboard-line"
        size="sm"
        :aria-describedby="`${linkId}-title`"
        @click="handleCopyLink"
      />
      <!-- Options for MAIL type -->
      <DsfrButton
        v-if="linkType === 'MAIL' && enabled"
        class="menu-item"
        type="button"
        :label="t('resend-mail')"
        tertiary
        no-outline
        icon="fr-icon-send-plane-line"
        size="sm"
        :aria-describedby="`${linkId}-title`"
        @click="handleResendMail"
      />

      <DsfrButton
        class="menu-item"
        type="button"
        :label="enabled ? t('pause-sharing') : t('reactivate-sharing')"
        tertiary
        no-outline
        :icon="enabled ? 'fr-icon-pause-circle-line' : 'fr-icon-play-circle-line'"
        size="sm"
        :aria-describedby="`${linkId}-title`"
        @click="handleTogglePause"
      />

      <DsfrButton
        ref="delete-btn"
        class="menu-item"
        type="button"
        :label="t('delete-sharing')"
        tertiary
        no-outline
        icon="fr-icon-delete-bin-line"
        size="sm"
        :aria-describedby="`${linkId}-title`"
        @click.stop="handleDelete"
      />
    </div>
    <DsfrModalPatch
      v-model:is-opened="isDeleteModalOpen"
      :title="t('delete-confirmation-title')"
      :actions="modalActions"
      size="xl"
      @close="handleFocus"
    >
      <p>{{ t('delete-confirmation-message') }}</p>
    </DsfrModalPatch>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, type ComputedRef, useTemplateRef, nextTick, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { AnalyticsService } from '@/services/AnalyticsService'
import DsfrModalPatch from 'df-shared-next/src/components/patches/DsfrModalPatch.vue'
import { DsfrButton, type DsfrButtonProps, useRandomId } from '@gouvminint/vue-dsfr'
import { FocusLegendKey, type FocusLegendType } from '@/models/InjectionKeys'

const props = defineProps<{
  enabled?: boolean
  linkType: 'LINK' | 'MAIL' | 'OWNER' | 'PARTNER'
  linkId: string
}>()

const emit = defineEmits<{
  copyLink: []
  togglePause: []
  resendMail: []
  delete: []
}>()

const { t } = useI18n()
const dropdownID = useRandomId('dropdown')
const isOpen = ref(false)
const setFocusLegend = inject(FocusLegendKey) as FocusLegendType

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
}

const confirmDelete = async () => {
  AnalyticsService.sharingAction('delete')
  emit('delete')
  isDeleteModalOpen.value = false
  await nextTick()
  setFocusLegend()
}

const deleteBtn = useTemplateRef('delete-btn')
const handleFocus = async () => {
  await nextTick()
  deleteBtn.value?.$el.focus()
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
  background-color: #ffffff;
  border-top: 1px solid #e3e3fd;
  box-shadow: 0px 4px 12px 0px rgba(0, 0, 18, 0.16);
  overflow: hidden;
  z-index: 1000;
}

.menu-item {
  inline-size: 100%;
}

.menu-icon {
  flex-shrink: 0;
  color: #000091;
}

.delete-item {
  background-color: rgba(0, 0, 0, 0.04);
}
</style>

<i18n lang="json">
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
