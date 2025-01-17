<template>
  <Modal @close="closeModal()">
    <template #header>
      <div class="fr-container">
        <h1 class="fr-modal__title">
          <slot name="title"></slot>
        </h1>
      </div>
    </template>
    <template #body>
      <div class="fr-container">
        <div class="fr-grid-row justify-content-center">
          <div class="fr-col-12">
            <p>
              <slot></slot>
            </p>
            <div class="align--right">
              <DfButton type="submit" class="fr-mr-3w" @click="validSelect()" :primary="true">{{
                validateBtnText ? validateBtnText : t('validate')
              }}</DfButton>
              <DfButton class="fr-mr-3w" @click="undoSelect()">{{
                cancelBtnText ? cancelBtnText : t('cancel')
              }}</DfButton>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import Modal from './ModalComponent.vue'
import DfButton from '../Button/DfButton.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emit = defineEmits<{ valid: []; cancel: [] }>()

defineProps<{
  validateBtnText?: string
  cancelBtnText?: string
}>()

function validSelect() {
  emit('valid')
}

function undoSelect() {
  emit('cancel')
}

function closeModal() {
  emit('cancel')
}
</script>

<i18n>
{
  "en": {
    "validate": "Validate",
    "cancel": "Cancel"
  },
  "fr": {
    "validate": "Valider",
    "cancel": "Annuler"
  }
}
</i18n>
