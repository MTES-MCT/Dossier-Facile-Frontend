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
      <RiArrowUpSLine
        v-if="isOpen"
        aria-hidden="true"
        size="16px"
        class="arrow-icon"
      />
      <RiArrowDownSLine
        v-else
        aria-hidden="true"
        size="16px"
        class="arrow-icon"
      />
    </button>
    
    <div v-if="isOpen" class="dropdown-menu">
      <!-- Options for LINK type -->
      <template v-if="linkType === 'LINK'">
        <button
          type="button"
          class="menu-item"
          @click="handleCopyLink"
        >
          <RiFileCopyLine aria-hidden="true" size="16px" class="menu-icon" />
          <span>{{ t('copy-the-link') }}</span>
        </button>
        
        <button
          type="button"
          class="menu-item"
          @click="handleTogglePause"
        >
          <RiPauseCircleLine v-if="enabled" aria-hidden="true" size="16px" class="menu-icon" />
          <RiPlayCircleLine v-else aria-hidden="true" size="16px" class="menu-icon" />
          <span>{{ enabled ? t('pause-sharing') : t('reactivate-sharing') }}</span>
        </button>
      </template>

      <!-- Options for MAIL type -->
      <template v-if="linkType === 'MAIL'">
        <button
          type="button"
          class="menu-item"
          @click="handleResendMail"
        >
          <RiSendPlaneLine aria-hidden="true" size="16px" class="menu-icon" />
          <span>{{ t('resend-mail') }}</span>
        </button>
      </template>
      
      <button
        type="button"
        class="menu-item delete-item"
        @click.stop="handleDelete"
      >
        <RiDeleteBinLine aria-hidden="true" size="16px" class="menu-icon" />
        <span>{{ t('delete-sharing') }}</span>
      </button>
    </div>
    
    <ModalComponent v-if="isDeleteModalOpen" @close="closeDeleteModal">
      <template #header>
        <h4>{{ t('delete-confirmation-title') }}</h4>
      </template>
      <template #body>
      <p>{{ t('delete-confirmation-message') }}</p>
      </template>
      <template #footer>
        <ul class="fr-btns-group fr-btns-group--inline-md">
          <li>
            <DfButton @click="closeDeleteModal">{{ t('cancel') }}</DfButton>
          </li>
          <li>
            <DfButton primary @click="confirmDelete">{{ t('confirm-delete') }}</DfButton>
          </li>
        </ul>
      </template>
    </ModalComponent>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
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
import ModalComponent from 'df-shared-next/src/components/ModalComponent.vue'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'

defineProps<{
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
const canCloseModalOnClickOutside = ref(false)
const menuContainer = ref<HTMLElement>()

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const closeMenu = () => {
  isOpen.value = false
}

const handleCopyLink = () => {
  emit('copyLink')
  closeMenu()
}

const handleTogglePause = () => {
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

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  canCloseModalOnClickOutside.value = false
}

// Activer la fermeture sur clic extérieur après un court délai
// pour éviter que le clic initial sur "Supprimer" ne ferme la modale
watch(isDeleteModalOpen, (newValue) => {
  if (newValue) {
    setTimeout(() => {
      canCloseModalOnClickOutside.value = true
    }, 100)
  }
})

const confirmDelete = () => {
  emit('delete')
  closeDeleteModal()
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  
  // Fermer la modale si on clique sur le backdrop (en dehors du contenu)
  if (isDeleteModalOpen.value && canCloseModalOnClickOutside.value) {
    // Vérifier si le clic est sur le backdrop (pas sur le contenu de la modale)
    if (target.classList.contains('modal-backdrop')) {
      closeDeleteModal()
      return
    }
  }
  
  // Ne pas fermer le menu si la modale de suppression est ouverte
  if (isDeleteModalOpen.value) {
    return
  }
  if (menuContainer.value && !menuContainer.value.contains(target)) {
    closeMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.actions-menu {
  position: relative;
  display: inline-block;
}

.actions-button {
  background-color: #FFFFFF;
  border: 1px solid #DDDDDD;
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

.actions-button[aria-expanded="true"] {
  background-color: #E3E3FD;
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
}

.dropdown-menu {
  position: absolute;
  top: 32px;
  left: 0;
  width: 282px;
  max-height: 430px;
  background-color: #FFFFFF;
  border-top: 1px solid #E3E3FD;
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
